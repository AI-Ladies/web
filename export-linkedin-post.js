const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  const filePath = path.resolve(__dirname, 'linkedin-post-image.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0', timeout: 20000 });

  const el = await page.$('#linkedin-post');
  const outPath = path.resolve(__dirname, 'linkedin-post.png');
  await el.screenshot({ path: outPath, type: 'png' });

  const size = require('fs').statSync(outPath);
  console.log(`Exported: linkedin-post.png (${(size.size / 1024).toFixed(0)} KB)`);

  await browser.close();
})();
