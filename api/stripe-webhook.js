import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function verifySignature(payload, sigHeader, secret) {
  const elements = sigHeader.split(',');
  let timestamp = null;
  let signatures = [];

  for (const element of elements) {
    const [prefix, value] = element.trim().split('=', 2);
    if (prefix === 't') timestamp = value;
    if (prefix === 'v1') signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) {
    throw new Error('Invalid signature header format');
  }

  const signed = `${timestamp}.${payload}`;
  const expected = crypto.createHmac('sha256', secret).update(signed).digest('hex');

  return signatures.some(sig => {
    try {
      return crypto.timingSafeEqual(
        Buffer.from(sig, 'utf8'),
        Buffer.from(expected, 'utf8')
      );
    } catch {
      return false;
    }
  });
}

function getTemplateForSlug(slug) {
  const templates = {
    'ai-bezpecne': Number(process.env.BREVO_TEMPLATE_AI_BEZPECNE) || null,
    'asistent-na-web': Number(process.env.BREVO_TEMPLATE_ASISTENT_NA_WEB) || null,
  };
  return templates[slug] || null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error('Failed to read request body:', err.message);
    return res.status(400).json({ error: 'Could not read body' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    console.error('Missing stripe-signature header');
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  const bodyStr = rawBody.toString('utf8');

  try {
    if (!verifySignature(bodyStr, sig, webhookSecret)) {
      console.error('Signature mismatch - check STRIPE_WEBHOOK_SECRET');
      return res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    console.error('Signature verification error:', err.message);
    return res.status(400).json({ error: 'Signature verification failed' });
  }

  let event;
  try {
    event = JSON.parse(bodyStr);
  } catch (err) {
    console.error('Invalid JSON body:', err.message);
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object;
  const email = session.customer_details?.email || session.customer_email;

  if (!email) {
    console.error('No email in checkout session:', session.id);
    return res.status(200).json({ received: true, note: 'no email found' });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    console.error('BREVO_API_KEY not configured');
    return res.status(200).json({ received: true, note: 'brevo not configured' });
  }

  const webinarSlug = session.metadata?.webinar_slug;
  let templateId;

  if (webinarSlug) {
    templateId = getTemplateForSlug(webinarSlug);
    if (!templateId) {
      console.error(`No Brevo template for webinar slug: ${webinarSlug}`);
      return res.status(200).json({ received: true, note: `no template for ${webinarSlug}` });
    }
  } else {
    templateId = Number(process.env.BREVO_NIGHT_TEMPLATE_ID) || 1;
  }

  let firstName = '';
  let firstName5pad = '';

  try {
    const contactRes = await fetch(
      `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
      { headers: { 'api-key': brevoKey, Accept: 'application/json' } }
    );

    if (contactRes.ok) {
      const contact = await contactRes.json();
      firstName = contact.attributes?.FIRSTNAME || '';
      firstName5pad = contact.attributes?.FIRSTNAME_5PAD || firstName;
    }
  } catch (err) {
    console.error('Brevo contact lookup error:', err.message);
  }

  if (!firstName) {
    const name = session.customer_details?.name || '';
    firstName = name.split(' ')[0] || '';
    firstName5pad = firstName;
  }

  // Update Airtable status to "Zaplaceno"
  if (webinarSlug) {
    try {
      const airtableToken = process.env.AIRTABLE_API_TOKEN;
      const airtableBaseId = process.env.AIRTABLE_BASE_ID;
      if (airtableToken && airtableBaseId) {
        const searchUrl = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent('Registrace webináře')}?filterByFormula=AND({Email}='${email}',{Webinář slug}='${webinarSlug}')&maxRecords=1`;
        const searchRes = await fetch(searchUrl, {
          headers: { Authorization: `Bearer ${airtableToken}` },
        });
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const record = searchData.records?.[0];
          if (record) {
            await fetch(
              `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent('Registrace webináře')}/${record.id}`,
              {
                method: 'PATCH',
                headers: {
                  Authorization: `Bearer ${airtableToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fields: { Status: 'Zaplaceno' } }),
              }
            );
          }
        }
      }
    } catch (err) {
      console.error('Airtable status update error:', err.message);
    }
  }

  // Send confirmation email (webhook is backup — cookie approach on TY page is primary)
  try {
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: [{ email, name: session.customer_details?.name || firstName }],
        templateId,
        params: { FIRSTNAME: firstName, FIRSTNAME_5PAD: firstName5pad || firstName },
      }),
    });

    if (!emailRes.ok) {
      const errData = await emailRes.json().catch(() => ({}));
      console.error('Brevo email send error:', errData);
    } else {
      console.log(`Webhook: confirmation sent to ${email} (template ${templateId}, slug: ${webinarSlug || 'night'})`);
    }
  } catch (err) {
    console.error('Email send error:', err.message);
  }

  return res.status(200).json({ received: true });
}
