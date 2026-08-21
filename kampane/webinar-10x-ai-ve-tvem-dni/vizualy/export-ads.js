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
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const exports = [
    {
      file: 'meta-ads-square.html',
      ids: ['sq1', 'sq2', 'sq3', 'sq4', 'sq5', 'sq6'],
      names: ['square-1-hero-claim', 'square-2-pain-point', 'square-3-practical', 'square-4-slysis-o-ai', 'square-5-clean-claim', 'square-6-program'],
      vw: 1200,
      vh: 8000,
    },
    {
      file: 'meta-ads-stories.html',
      ids: ['st1', 'st2', 'st3', 'st4', 'st5', 'st6'],
      names: ['story-1-hero-claim', 'story-2-pain-point', 'story-3-practical', 'story-4-slysis-o-ai', 'story-5-clean-claim', 'story-6-program'],
      vw: 1200,
      vh: 14000,
    },
  ];

  for (const exp of exports) {
    const page = await browser.newPage();
    await page.setViewport({ width: exp.vw, height: exp.vh, deviceScaleFactor: 2 });
    await page.goto(`file://${path.join(base, exp.file)}`, { waitUntil: 'networkidle0', timeout: 60000 });

    for (let i = 0; i < exp.ids.length; i++) {
      const el = await page.$(`#${exp.ids[i]}`);
      if (!el) { console.error(`Element #${exp.ids[i]} not found in ${exp.file}`); continue; }
      const outPath = path.join(outDir, `${exp.names[i]}.png`);
      await el.screenshot({ path: outPath, type: 'png' });
      const size = fs.statSync(outPath);
      console.log(`✓ ${exp.names[i]}.png (${(size.size / 1024).toFixed(0)} KB)`);
    }
    await page.close();
  }

  // LinkedIn event header (separate file, in repo root)
  const headerPage = await browser.newPage();
  await headerPage.setViewport({ width: 2100, height: 1200, deviceScaleFactor: 2 });
  const headerHtml = path.resolve(base, '..', '..', '..', 'linkedin-event-header-10x-ai-ve-tvem-dni.html');
  await headerPage.goto(`file://${headerHtml}`, { waitUntil: 'networkidle0', timeout: 60000 });
  const headerEl = await headerPage.$('#linkedin-event-header');
  if (headerEl) {
    const headerOut = path.join(outDir, 'linkedin-event-header.png');
    await headerEl.screenshot({ path: headerOut, type: 'png' });
    const size = fs.statSync(headerOut);
    console.log(`✓ linkedin-event-header.png (${(size.size / 1024).toFixed(0)} KB)`);
  }
  await headerPage.close();

  await browser.close();
  console.log(`\nDone! Files saved to ${outDir}`);
})();
