const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, 'png');

const SETS = [
  {
    file: 'meta-ads-square.html',
    ids: ['sq1', 'sq2', 'sq3', 'sq4', 'sq5', 'sq6'],
    names: [
      'square-1-hero-claim',
      'square-2-konverzace',
      'square-3-program',
      'square-4-low-barrier',
      'square-5-identita',
      'square-6-siroky-zaber',
    ],
    viewport: { width: 1200, height: 12000 },
  },
  {
    file: 'meta-ads-stories.html',
    ids: ['st1', 'st2', 'st3', 'st4', 'st5', 'st6'],
    names: [
      'story-1-hero-claim',
      'story-2-konverzace',
      'story-3-program',
      'story-4-low-barrier',
      'story-5-identita',
      'story-6-siroky-zaber',
    ],
    viewport: { width: 1200, height: 20000 },
  },
];

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const set of SETS) {
    const page = await browser.newPage();
    await page.setViewport({ ...set.viewport, deviceScaleFactor: 1 });

    const filePath = path.resolve(__dirname, set.file);
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0', timeout: 30000 });

    for (let i = 0; i < set.ids.length; i++) {
      const el = await page.$(`#${set.ids[i]}`);
      if (!el) {
        console.error(`Element #${set.ids[i]} not found in ${set.file}`);
        continue;
      }
      const outPath = path.join(OUT_DIR, `${set.names[i]}.png`);
      await el.screenshot({ path: outPath, type: 'png' });
      const size = fs.statSync(outPath);
      console.log(`✓ ${set.names[i]}.png (${(size.size / 1024).toFixed(0)} KB)`);
    }

    await page.close();
  }

  await browser.close();
  console.log(`\nDone! ${SETS.reduce((s, x) => s + x.ids.length, 0)} files saved to ${OUT_DIR}`);
})();
