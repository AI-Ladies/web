export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, slug } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    console.error('BREVO_API_KEY not configured');
    return res.status(500).json({ error: 'Not configured' });
  }

  // Select template based on slug
  const templates = {
    'ai-bezpecne': Number(process.env.BREVO_TEMPLATE_AI_BEZPECNE) || null,
    'asistent-na-web': Number(process.env.BREVO_TEMPLATE_ASISTENT_NA_WEB) || null,
  };

  const templateId = slug
    ? templates[slug]
    : (Number(process.env.BREVO_NIGHT_TEMPLATE_ID) || 6);

  if (!templateId) {
    console.error(`No template found for slug: ${slug}`);
    return res.status(400).json({ error: `Unknown slug: ${slug}` });
  }

  // Dedup key is per-slug (CONFIRMATION_SENT for Night, CONFIRMATION_SENT_{SLUG} for webinars)
  const sentAttr = slug
    ? `CONFIRMATION_SENT_${slug.replace(/-/g, '_').toUpperCase()}`
    : 'CONFIRMATION_SENT';

  let firstName = '';
  let firstName5pad = '';

  try {
    const contactRes = await fetch(
      `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
      { headers: { 'api-key': brevoKey, Accept: 'application/json' } }
    );

    if (!contactRes.ok) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contact = await contactRes.json();
    firstName = contact.attributes?.FIRSTNAME || '';
    firstName5pad = contact.attributes?.FIRSTNAME_5PAD || firstName;

    if (contact.attributes?.[sentAttr] === true) {
      return res.status(200).json({ success: true, note: 'already sent' });
    }
  } catch (err) {
    console.error('Brevo contact lookup error:', err.message);
    return res.status(500).json({ error: 'Lookup failed' });
  }

  try {
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: [{ email, name: `${firstName}` }],
        templateId,
        params: { FIRSTNAME: firstName, FIRSTNAME_5PAD: firstName5pad || firstName },
      }),
    });

    if (!emailRes.ok) {
      const errData = await emailRes.json().catch(() => ({}));
      console.error('Brevo send error:', errData);
      return res.status(500).json({ error: 'Send failed' });
    }
  } catch (err) {
    console.error('Email send error:', err.message);
    return res.status(500).json({ error: 'Send failed' });
  }

  // Mark as sent (per-slug dedup)
  try {
    await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ attributes: { [sentAttr]: true } }),
    });
  } catch (_) {}

  return res.status(200).json({ success: true });
}
