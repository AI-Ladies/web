export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, consent } = req.body;

    if (!email || !consent) {
      return res.status(400).json({
        success: false,
        error: 'Vyplň e-mail a potvrď souhlas.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Zadej prosím platný e-mail.',
      });
    }

    const brevoKey = process.env.BREVO_API_KEY;
    const brevoListId = process.env.BREVO_NEWSLETTER_LIST_ID;

    if (brevoKey && brevoListId) {
      const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          listIds: [Number(brevoListId)],
          updateEnabled: true,
        }),
      });

      if (!brevoRes.ok) {
        const errData = await brevoRes.json().catch(() => ({}));
        if (errData.code === 'duplicate_parameter') {
          return res.status(200).json({ success: true, alreadySubscribed: true });
        }
        console.error('Brevo newsletter error:', errData);
        return res.status(500).json({
          success: false,
          error: 'Něco se pokazilo. Zkus to prosím znovu.',
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return res.status(500).json({
      success: false,
      error: 'Něco se pokazilo. Zkus to prosím znovu.',
    });
  }
}
