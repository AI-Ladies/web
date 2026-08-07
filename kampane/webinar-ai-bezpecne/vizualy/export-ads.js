const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const base = path.resolve(__dirname);
  const outDir = path.join(base, 'png');

  const exports = [
    { file: 'meta-ads-square.html', ids: ['sq1','sq2','sq3','sq4'], prefix: 'square', vw: 1200, vh: 6000 },
    { file: 'meta-ads-stories.html', ids: ['st1','st2','st3','st4'], prefix: 'story', vw: 1200, vh: 10000 },
  ];

  for (const exp of exports) {
    const page = await browser.newPage();
    await page.setViewport({ width: exp.vw, height: exp.vh, deviceScaleFactor: 2 });
    await page.goto(`file://${path.join(base, exp.file)}`, { waitUntil: 'networkidle0', timeout: 30000 });

    for (const id of exp.ids) {
      const el = await page.$(`#${id}`);
      if (!el) { console.error(`Element #${id} not found`); continue; }
      const idx = exp.ids.indexOf(id) + 1;
      const outPath = path.join(outDir, `${exp.prefix}-${idx}.png`);
      await el.screenshot({ path: outPath, type: 'png' });
      const size = fs.statSync(outPath);
      console.log(`${exp.prefix}-${idx}.png (${(size.size / 1024).toFixed(0)} KB)`);
    }
    await page.close();
  }

  await browser.close();
  console.log('\nDone!');
})();
