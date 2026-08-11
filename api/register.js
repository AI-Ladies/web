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

    // --- Airtable: create registration record (Status: Registrace = before payment) ---
    const airtableToken = process.env.AIRTABLE_NIGHT_TOKEN;
    const airtableBaseId = process.env.AIRTABLE_NIGHT_BASE_ID;
    const airtableTable = process.env.AIRTABLE_NIGHT_TABLE || 'Registrace';

    if (!airtableToken || !airtableBaseId) {
      console.error('[NIGHT REGISTER] CRITICAL: AIRTABLE_API_TOKEN or AIRTABLE_NIGHT_BASE_ID not set — AT record NOT created for', email);
    } else {
      try {
        const airtableRes = await fetch(
          `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTable)}`,
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
                Status: 'Registrace',
              },
            }),
          }
        );

        if (!airtableRes.ok) {
          const errData = await airtableRes.json().catch(() => ({}));
          console.error('[NIGHT REGISTER] CRITICAL: AT write FAILED for', email, '— data will be missing! Error:', JSON.stringify(errData));
        }
      } catch (err) {
        console.error('[NIGHT REGISTER] CRITICAL: AT write threw for', email, '—', err.message);
      }
    }

    // Brevo + confirmation email happen AFTER payment (via complete-registration.js / stripe-webhook.js)

    const stripeUrl = 'https://buy.stripe.com/cNieVe3oO7mvbdf1yhes000';

    return res.status(200).json({
      success: true,
      stripeUrl,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Něco se pokazilo. Zkus to prosím znovu nebo nám napiš na hello@ailadies.cz.',
    });
  }
}
