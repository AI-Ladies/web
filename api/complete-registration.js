export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fname, lname, email, field, seniority, webinar, webinarName } = req.body || {};

  if (!email || !webinar) {
    return res.status(400).json({ error: 'Email and webinar slug required' });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  const airtableToken = process.env.AIRTABLE_API_TOKEN;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;

  const webinarLists = {
    'ai-bezpecne': 8,
    'asistent-na-web': 9,
    'proc-mi-z-ai-leze-nuda': 10,
  };

  const templates = {
    'ai-bezpecne': 7,
    'asistent-na-web': 8,
    'proc-mi-z-ai-leze-nuda': 9,
  };

  const sentAttr = `CONFIRMATION_SENT_${webinar.replace(/-/g, '_').toUpperCase()}`;
  const templateId = templates[webinar];
  const brevoListId = webinarLists[webinar];

  if (!templateId || !brevoListId) {
    return res.status(400).json({ error: `Unknown webinar: ${webinar}` });
  }

  // --- Dedup: check if already completed ---
  if (brevoKey) {
    try {
      const contactRes = await fetch(
        `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
        { headers: { 'api-key': brevoKey, Accept: 'application/json' } }
      );
      if (contactRes.ok) {
        const contact = await contactRes.json();
        const sentVal = contact.attributes?.[sentAttr];
        if (sentVal === true || sentVal === 'true') {
          return res.status(200).json({ success: true, note: 'already completed' });
        }
      }
    } catch (_) {}
  }

  const firstName = fname || '';
  const lastName = lname || '';

  // --- Vocative (5th case) ---
  let fname5pad = firstName;
  const sklonKey = process.env.SKLONOVANI_API_KEY;
  if (sklonKey && firstName && lastName) {
    try {
      const sklonUrl = new URL('https://www.sklonovani-jmen.cz/api');
      sklonUrl.searchParams.set('klic', sklonKey);
      sklonUrl.searchParams.set('pad', '5');
      sklonUrl.searchParams.set('jmeno', `${firstName} ${lastName}`);
      sklonUrl.searchParams.set('pouzit-osloveni', 'ne');
      sklonUrl.searchParams.set('pouzit-prijmeni', 'ne');
      sklonUrl.searchParams.set('pouzit-krestni', 'ano');
      sklonUrl.searchParams.set('format', 'json');

      const sklonRes = await fetch(sklonUrl.toString());
      if (sklonRes.ok) {
        const sklonData = await sklonRes.json();
        if (Array.isArray(sklonData) && sklonData[0]?.odpoved) {
          const odpoved = sklonData[0].odpoved;
          if (!/^\d+$/.test(odpoved)) fname5pad = odpoved;
        }
      }
    } catch (err) {
      console.error('Sklonovani error:', err.message);
    }
  }

  // --- Airtable: create record (Status: Zaplaceno) ---
  if (airtableToken && airtableBaseId) {
    try {
      const airtableRes = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent('Registrace webináře')}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${airtableToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            typecast: true,
            fields: {
              'Email': email,
              'Jméno': firstName,
              'Příjmení': lastName,
              'Webinář slug': webinar,
              'Obor': field || '',
              'Seniorita': seniority || '',
              'GDPR souhlas': true,
              'Datum registrace': new Date().toISOString().split('T')[0],
              'Status': 'Zaplaceno',
            },
          }),
        }
      );
      if (!airtableRes.ok) {
        const errData = await airtableRes.json().catch(() => ({}));
        console.error('Airtable error:', errData);
      }
    } catch (err) {
      console.error('Airtable error:', err.message);
    }
  }

  // --- Brevo: add contact to webinar list ---
  if (brevoKey) {
    try {
      const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          attributes: {
            FIRSTNAME: firstName,
            LASTNAME: lastName,
            FIRSTNAME_5PAD: fname5pad,
            WEBINAR_SLUG: webinar,
            WEBINAR_NAME: webinarName || '',
          },
          listIds: [Number(brevoListId)],
          updateEnabled: true,
        }),
      });
      if (!brevoRes.ok) {
        const errData = await brevoRes.json().catch(() => ({}));
        console.error('Brevo contact error:', errData);
      }
    } catch (err) {
      console.error('Brevo contact error:', err.message);
    }
  }

  // --- Send confirmation email ---
  if (brevoKey) {
    try {
      const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: [{ email, name: `${firstName} ${lastName}`.trim() || email }],
          templateId,
          params: { FIRSTNAME: firstName, FIRSTNAME_5PAD: fname5pad || firstName },
        }),
      });

      if (!emailRes.ok) {
        const errData = await emailRes.json().catch(() => ({}));
        console.error('Brevo email error:', errData);
      } else {
        console.log(`Complete-registration: confirmation sent to ${email} (template ${templateId})`);
        try {
          await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
            method: 'PUT',
            headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ attributes: { [sentAttr]: true } }),
          });
        } catch (_) {}
      }
    } catch (err) {
      console.error('Email send error:', err.message);
    }
  }

  return res.status(200).json({ success: true });
}
