const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 12000, deviceScaleFactor: 1 });

  const filePath = path.resolve(__dirname, 'instagram-logo.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0', timeout: 20000 });

  const variants = ['logo-a', 'logo-b', 'logo-c'];

  for (const id of variants) {
    const el = await page.$(`#${id}`);
    if (!el) {
      console.error(`Element #${id} not found`);
      continue;
    }
    const outPath = path.resolve(__dirname, `instagram-${id}.png`);
    await el.screenshot({ path: outPath, type: 'png', omitBackground: true });
    const size = require('fs').statSync(outPath);
    console.log(`${id}: instagram-${id}.png (${(size.size / 1024).toFixed(0)} KB)`);
  }

  await browser.close();
})();
