export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { fname, lname, email, gdpr, webinar } = req.body;

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

    const stripeLinks = {
      'ai-bezpecne': process.env.STRIPE_LINK_AI_BEZPECNE || '',
      'asistent-na-web': process.env.STRIPE_LINK_ASISTENT_NA_WEB || '',
      'proc-mi-z-ai-leze-nuda': process.env.STRIPE_LINK_PROC_MI_Z_AI_LEZE_NUDA || '',
      'ai-texty': process.env.STRIPE_LINK_AI_TEXTY || '',
      'ai-zivot': process.env.STRIPE_LINK_AI_ZIVOT || '',
    };

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
