export default function handler(req, res) {
  const keys = Object.keys(process.env)
    .filter(k => /STRIPE|BREVO|AIRTABLE|SKLON/i.test(k))
    .map(k => `${k}=${process.env[k] ? '✓ set (' + process.env[k].length + ' chars)' : '✗ empty'}`);
  return res.status(200).json({ envKeys: keys });
}
