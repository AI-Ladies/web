const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const slides = [
  { id: 's1', name: 'slide-1-cover' },
  { id: 's2', name: 'slide-2-licence' },
  { id: 's3', name: 'slide-3-vypni-trenovani' },
  { id: 's4', name: 'slide-4-nikdy-nevkladat' },
  { id: 's5', name: 'slide-5-co-muzes' },
  { id: 's6', name: 'slide-6-policejni-test' },
  { id: 's7', name: 'slide-7-pravo-byt-zapomenut' },
  { id: 's8', name: 'slide-8-ai-ladies' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1440, deviceScaleFactor: 2 });

  const htmlPath = path.resolve(__dirname, 'linkedin-carousel-ai-checklist.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

  const outDir = path.resolve(__dirname, 'linkedin-carousel-png');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const slide of slides) {
    const el = await page.$(`#${slide.id}`);
    if (!el) {
      console.log(`⚠ Element #${slide.id} not found, skipping`);
      continue;
    }
    const outPath = path.join(outDir, `${slide.name}.png`);
    await el.screenshot({ path: outPath, type: 'png' });
    const size = fs.statSync(outPath);
    console.log(`✓ ${slide.name}.png (${(size.size / 1024).toFixed(0)} KB)`);
  }

  console.log(`\nAll slides exported to: ${outDir}`);
  await browser.close();
})();
