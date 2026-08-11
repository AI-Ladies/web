export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fname, lname, email, field, seniority, webinar, webinarName, event, aiLevel } = req.body || {};

  const isNight = event === 'night';

  if (!email || (!webinar && !isNight)) {
    return res.status(400).json({ error: 'Email and webinar slug (or event=night) required' });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  const airtableToken = process.env.AIRTABLE_API_TOKEN;

  const webinarLists = {
    'ai-bezpecne': 8,
    'asistent-na-web': 9,
    'proc-mi-z-ai-leze-nuda': 10,
    '10x-ai-ve-tvem-dni': 11,
  };

  const templates = {
    'ai-bezpecne': 7,
    'asistent-na-web': 8,
    'proc-mi-z-ai-leze-nuda': 9,
    '10x-ai-ve-tvem-dni': 16,
  };

  const sentAttr = isNight
    ? 'CONFIRMATION_SENT'
    : `CONFIRMATION_SENT_${webinar.replace(/-/g, '_').toUpperCase()}`;
  const templateId = isNight
    ? (Number(process.env.BREVO_NIGHT_TEMPLATE_ID) || 6)
    : templates[webinar];
  const brevoListId = isNight ? 6 : webinarLists[webinar];

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

  // --- Airtable ---
  if (airtableToken) {
    try {
      if (isNight) {
        // Night: find existing record (from register.js) and update Status to Zaplaceno
        const nightBaseId = process.env.AIRTABLE_NIGHT_BASE_ID;
        const nightTable = process.env.AIRTABLE_NIGHT_TABLE || 'Registrace';
        if (nightBaseId) {
          const searchUrl = `https://api.airtable.com/v0/${nightBaseId}/${encodeURIComponent(nightTable)}?filterByFormula={Email}='${email}'&sort%5B0%5D%5Bfield%5D=Datum+registrace&sort%5B0%5D%5Bdirection%5D=desc&maxRecords=1`;
          const searchRes = await fetch(searchUrl, {
            headers: { Authorization: `Bearer ${airtableToken}` },
          });
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            const record = searchData.records?.[0];
            if (record) {
              await fetch(
                `https://api.airtable.com/v0/${nightBaseId}/${encodeURIComponent(nightTable)}/${record.id}`,
                {
                  method: 'PATCH',
                  headers: {
                    Authorization: `Bearer ${airtableToken}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ fields: { Status: 'Zaplaceno' } }),
                }
              );
            } else {
              // Backup: no pre-existing record, create one
              await fetch(
                `https://api.airtable.com/v0/${nightBaseId}/${encodeURIComponent(nightTable)}`,
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${airtableToken}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    typecast: true,
                    fields: {
                      'First Name': firstName,
                      Surname: lastName,
                      Email: email,
                      Obor: field || '',
                      Seniorita: seniority || '',
                      AI: aiLevel || '',
                      'GDPR souhlas': true,
                      'Datum registrace': new Date().toISOString().split('T')[0],
                      Status: 'Zaplaceno',
                    },
                  }),
                }
              );
            }
          }
        }
      } else {
        // Webinar: create new record
        const airtableBaseId = process.env.AIRTABLE_BASE_ID;
        if (airtableBaseId) {
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
        }
      }
    } catch (err) {
      console.error('Airtable error:', err.message);
    }
  }

  // --- Brevo: add contact to list ---
  if (brevoKey) {
    try {
      const brevoAttrs = {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        FIRSTNAME_5PAD: fname5pad,
      };
      if (isNight) {
        brevoAttrs.FIELD = field || '';
        brevoAttrs.SENIORITY = seniority || '';
        brevoAttrs.AI_LEVEL = aiLevel || '';
      } else {
        brevoAttrs.WEBINAR_SLUG = webinar;
        brevoAttrs.WEBINAR_NAME = webinarName || '';
      }

      const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          attributes: brevoAttrs,
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
        console.log(`Complete-registration: confirmation sent to ${email} (template ${templateId}, ${isNight ? 'night' : webinar})`);
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
