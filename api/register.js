export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { fname, lname, email, field, seniority, aiLevel, gdpr } = req.body;

    if (!fname || !lname || !email || !gdpr) {
      return res.status(400).json({
        success: false,
        error: 'Vyplň prosím všechna povinná pole a souhlas s podmínkami.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Zadej prosím platný e-mail.',
      });
    }

    // --- Airtable: create registration record ---
    const airtableToken = process.env.AIRTABLE_API_TOKEN;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTable = process.env.AIRTABLE_NIGHT_TABLE || 'Registrace';

    if (airtableToken && airtableBaseId) {
      const airtableRes = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/${airtableTable}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${airtableToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            typecast: true,
            fields: {
              'First Name': fname,
              Surname: lname,
              Email: email,
              Obor: field || '',
              Seniorita: seniority || '',
              AI: aiLevel || '',
              'GDPR souhlas': true,
              'Datum registrace': new Date().toISOString().split('T')[0],
              Status: 'Nova',
            },
          }),
        }
      );

      if (!airtableRes.ok) {
        const errData = await airtableRes.json().catch(() => ({}));
        console.error('Airtable error:', errData);
      }
    }

    // --- Brevo: add contact to AI Ladies Night list ---
    const brevoKey = process.env.BREVO_API_KEY;
    const brevoNightListId = process.env.BREVO_NIGHT_LIST_ID;

    if (brevoKey && brevoNightListId) {
      // --- sklonovani-jmen.cz: get vocative (5th case) of first name ---
      let fname5pad = fname;
      const sklonKey = process.env.SKLONOVANI_API_KEY;
      if (sklonKey) {
        try {
          const sklonUrl = new URL('https://www.sklonovani-jmen.cz/api');
          sklonUrl.searchParams.set('klic', sklonKey);
          sklonUrl.searchParams.set('pad', '5');
          sklonUrl.searchParams.set('jmeno', `${fname} ${lname}`);
          sklonUrl.searchParams.set('pouzit-osloveni', 'ne');
          sklonUrl.searchParams.set('pouzit-prijmeni', 'ne');
          sklonUrl.searchParams.set('pouzit-krestni', 'ano');
          sklonUrl.searchParams.set('format', 'json');

          const sklonRes = await fetch(sklonUrl.toString());
          if (sklonRes.ok) {
            const sklonData = await sklonRes.json();
            if (Array.isArray(sklonData) && sklonData[0]?.odpoved) {
              const odpoved = sklonData[0].odpoved;
              if (!/^\d+$/.test(odpoved)) {
                fname5pad = odpoved;
              }
            }
          }
        } catch (err) {
          console.error('Sklonovani-jmen error (fallback to fname):', err.message);
        }
      }

      const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          attributes: {
            FIRSTNAME: fname,
            LASTNAME: lname,
            FIRSTNAME_5PAD: fname5pad,
            FIELD: field || '',
            SENIORITY: seniority || '',
            AI_LEVEL: aiLevel || '',
          },
          listIds: [Number(brevoNightListId)],
          updateEnabled: true,
        }),
      });

      if (!brevoRes.ok) {
        const errData = await brevoRes.json().catch(() => ({}));
        console.error('Brevo contact error:', errData);
      }

      const brevoTemplateId = Number(process.env.BREVO_NIGHT_TEMPLATE_ID) || 1;
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [{ email, name: `${fname} ${lname}` }],
          templateId: brevoTemplateId,
          params: { FIRSTNAME: fname, FIRSTNAME_5PAD: fname5pad },
        }),
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Něco se pokazilo. Zkus to prosím znovu nebo nám napiš na hello@ailadies.cz.',
    });
  }
}
