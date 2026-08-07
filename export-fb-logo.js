const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1400, deviceScaleFactor: 1 });

  const filePath = path.resolve(__dirname, 'fb-logo.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0', timeout: 30000 });

  const el = await page.$('#fb-logo');
  if (!el) {
    console.error('Element #fb-logo not found');
    process.exit(1);
  }

  const outPath = path.resolve(__dirname, 'fb-logo.png');
  await el.screenshot({ path: outPath, type: 'png' });
  const size = fs.statSync(outPath);
  console.log(`✓ fb-logo.png (${(size.size / 1024).toFixed(0)} KB)`);

  await browser.close();
})();
