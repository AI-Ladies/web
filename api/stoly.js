export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const airtableToken = process.env.AIRTABLE_API_TOKEN;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;

  if (!airtableToken || !airtableBaseId) {
    return res.status(500).json({ success: false, error: 'Chyba konfigurace serveru.' });
  }

  if (req.method === 'POST') {
    try {
      const { topic, bestTip, interestingTool, wantToTry, oneSentence, name } = req.body;

      if (!topic) {
        return res.status(400).json({ success: false, error: 'Chybí téma.' });
      }

      if (!bestTip && !interestingTool && !wantToTry && !oneSentence) {
        return res.status(400).json({ success: false, error: 'Vyplň prosím alespoň jedno pole.' });
      }

      const airtableRes = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/Stoly`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${airtableToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            typecast: true,
            fields: {
              Tema: topic,
              'Nejlepsi tip': bestTip || '',
              Nastroj: interestingTool || '',
              'Chceme vyzkouset': wantToTry || '',
              'Jedna veta': oneSentence || '',
              Jmeno: name || '',
            },
          }),
        }
      );

      if (!airtableRes.ok) {
        const errData = await airtableRes.json().catch(() => ({}));
        console.error('Airtable POST error:', errData);
        return res.status(500).json({ success: false, error: 'Nepodařilo se uložit.' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Stoly POST error:', error);
      return res.status(500).json({ success: false, error: 'Něco se pokazilo.' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { topic } = req.query;

      let url = `https://api.airtable.com/v0/${airtableBaseId}/Stoly`;
      if (topic) {
        url += `?filterByFormula=${encodeURIComponent(`{Tema}="${topic}"`)}`;
      }

      const airtableRes = await fetch(url, {
        headers: { Authorization: `Bearer ${airtableToken}` },
      });

      if (!airtableRes.ok) {
        const errData = await airtableRes.json().catch(() => ({}));
        console.error('Airtable GET error:', errData);
        return res.status(500).json({ success: false, error: 'Nepodařilo se načíst odpovědi.' });
      }

      const data = await airtableRes.json();
      const records = data.records.map(r => ({
        id: r.id,
        topic: r.fields.Tema || '',
        bestTip: r.fields['Nejlepsi tip'] || '',
        interestingTool: r.fields.Nastroj || '',
        wantToTry: r.fields['Chceme vyzkouset'] || '',
        oneSentence: r.fields['Jedna veta'] || '',
        name: r.fields.Jmeno || '',
        createdAt: r.createdTime,
      }));

      records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({ success: true, records });
    } catch (error) {
      console.error('Stoly GET error:', error);
      return res.status(500).json({ success: false, error: 'Něco se pokazilo.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
