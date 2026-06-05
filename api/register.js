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

    if (airtableToken && airtableBaseId) {
      const airtableRes = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/Registrace`,
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

      // Confirmation email is handled by Brevo automation
      // (triggered when contact is added to list 4)
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
