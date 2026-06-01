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
        `https://api.airtable.com/v0/${airtableBaseId}/Registrace%20AI%20Ladies%20Night`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${airtableToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              Jmeno: fname,
              Prijmeni: lname,
              Email: email,
              Obor: field || '',
              Seniorita: seniority || '',
              'AI Level': aiLevel || '',
              'GDPR souhlas': true,
              'Datum registrace': new Date().toISOString().split('T')[0],
              Stav: 'Nova',
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

      // --- Brevo: send confirmation email ---
      // Placeholder: will be replaced with proper HTML template in Phase 3
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'AI Ladies', email: 'hello@ailadies.cz' },
          to: [{ email, name: `${fname} ${lname}` }],
          subject: 'Potvrzení registrace na AI Ladies Night',
          htmlContent: `
            <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
              <h1 style="font-size: 24px; color: #0d0d0d;">Díky za registraci, ${fname}!</h1>
              <p>Těšíme se na tebe na <strong>AI Ladies Night</strong>.</p>
              <div style="background: #f8f5f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="margin: 4px 0;"><strong>Kdy:</strong> Středa 18. června 2026, 18:00–21:00</p>
                <p style="margin: 4px 0;"><strong>Kde:</strong> Trinity Bank, Na Příkopě, Praha 1</p>
                <p style="margin: 4px 0;"><strong>Cena:</strong> 390 Kč</p>
              </div>
              <p>Platební instrukce ti pošleme v dalším e-mailu.</p>
              <p style="margin-top: 24px;">Pokud máš jakékoli otázky, napiš nám na <a href="mailto:hello@ailadies.cz" style="color: #c49f47;">hello@ailadies.cz</a>.</p>
              <p style="margin-top: 32px; color: #9c8e82; font-size: 14px;">— Tým AI Ladies</p>
            </div>
          `,
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
