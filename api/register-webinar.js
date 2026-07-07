export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { fname, lname, email, gdpr, field, seniority, webinar, webinarName } = req.body;

    if (!fname || !lname || !email || !gdpr || !webinar) {
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

    // Stripe Payment Links per webinar (configure here)
    const stripeLinks = {
      'ai-bezpecne': process.env.STRIPE_LINK_AI_BEZPECNE || '',
      'asistent-na-web': process.env.STRIPE_LINK_ASISTENT_NA_WEB || '',
      'proc-mi-z-ai-leze-nuda': process.env.STRIPE_LINK_PROC_MI_Z_AI_LEZE_NUDA || '',
      'ai-texty': process.env.STRIPE_LINK_AI_TEXTY || '',
      'ai-zivot': process.env.STRIPE_LINK_AI_ZIVOT || '',
    };

    // --- Airtable: create registration record ---
    const airtableToken = process.env.AIRTABLE_API_TOKEN;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTable = 'Registrace webináře';

    if (airtableToken && airtableBaseId) {
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
              'Email': email,
              'Jméno': fname,
              'Příjmení': lname,
              'Webinář slug': webinar,
              'Obor': field || '',
              'Seniorita': seniority || '',
              'GDPR souhlas': true,
              'Datum registrace': new Date().toISOString().split('T')[0],
              'Status': 'Nová',
            },
          }),
        }
      );

      if (!airtableRes.ok) {
        const errData = await airtableRes.json().catch(() => ({}));
        console.error('Airtable error:', errData);
      }
    }

    // --- Brevo: add contact to webinar list ---
    const brevoKey = process.env.BREVO_API_KEY;
    const brevoWebinarListId = process.env.BREVO_WEBINAR_LIST_ID || '8';

    if (brevoKey) {
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
            WEBINAR_SLUG: webinar,
            WEBINAR_NAME: webinarName || '',
          },
          listIds: [Number(brevoWebinarListId)],
          updateEnabled: true,
        }),
      });

      if (!brevoRes.ok) {
        const errData = await brevoRes.json().catch(() => ({}));
        console.error('Brevo contact error:', errData);
      }
    }

    // Return Stripe payment link
    const stripeUrl = stripeLinks[webinar]
      ? stripeLinks[webinar] + '?prefilled_email=' + encodeURIComponent(email)
      : null;

    return res.status(200).json({
      success: true,
      stripeUrl,
    });
  } catch (error) {
    console.error('Webinar registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Něco se pokazilo. Zkus to prosím znovu nebo nám napiš na hello@ailadies.cz.',
    });
  }
}
