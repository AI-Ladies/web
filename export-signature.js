const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 2000, deviceScaleFactor: 4 });

  const filePath = path.resolve(__dirname, 'email-signature.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0', timeout: 20000 });

  const variants = [
    { id: 'sig-3', file: 'email-signature-v3.png' },
    { id: 'sig-8', file: 'email-signature-v8.png' },
    { id: 'sig-petra-3', file: 'email-signature-petra-v3.png' },
    { id: 'sig-petra-8', file: 'email-signature-petra-v8.png' },
    { id: 'sig-katka-8', file: 'email-signature-katka-v8.png' },
  ];

  await page.evaluate(() => { document.body.style.background = 'transparent'; });

  for (const v of variants) {
    const el = await page.$(`#${v.id}`);
    if (!el) {
      console.error(`Element #${v.id} not found`);
      continue;
    }
    const outPath = path.resolve(__dirname, v.file);
    await el.screenshot({ path: outPath, type: 'png', omitBackground: true });
    const size = require('fs').statSync(outPath);
    console.log(`${v.id}: ${v.file} (${(size.size / 1024).toFixed(0)} KB)`);
  }

  await browser.close();
})();
