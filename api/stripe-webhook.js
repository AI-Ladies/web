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
  const parts = Object.fromEntries(
    sigHeader.split(',').map(p => { const [k, v] = p.split('='); return [k, v]; })
  );
  const signed = `${parts.t}.${payload}`;
  const expected = crypto.createHmac('sha256', secret).update(signed).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(parts.v1, 'hex'), Buffer.from(expected, 'hex'));
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

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  try {
    if (!verifySignature(rawBody.toString('utf8'), sig, webhookSecret)) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    console.error('Signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(rawBody.toString('utf8'));

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
  const templateId = Number(process.env.BREVO_NIGHT_TEMPLATE_ID) || 1;

  if (!brevoKey) {
    console.error('BREVO_API_KEY not configured');
    return res.status(200).json({ received: true, note: 'brevo not configured' });
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
      console.log(`Confirmation email sent to ${email} after payment`);
    }
  } catch (err) {
    console.error('Email send error:', err.message);
  }

  return res.status(200).json({ received: true });
}
