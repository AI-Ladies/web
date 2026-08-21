const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const HTML_FILE = path.join(__dirname, 'webinar-use-cases-slide.html');
const OUT_DIR = path.join(__dirname, 'export');
const SLIDE_COUNT = 4;
const WIDTH = 1920;
const HEIGHT = 1080;

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });
  await page.goto(`file://${HTML_FILE}`, { waitUntil: 'networkidle0' });

  // hide navigation dots and hint overlay
  await page.evaluate(() => {
    document.getElementById('dots')?.remove();
    document.getElementById('hint')?.remove();
  });

  const pngPaths = [];

  for (let i = 0; i < SLIDE_COUNT; i++) {
    await page.evaluate((idx) => {
      document.querySelectorAll('.slide').forEach((s, n) => {
        s.classList.toggle('is-active', n === idx);
      });
    }, i);
    await new Promise(r => setTimeout(r, 300));

    const pngPath = path.join(OUT_DIR, `slide-${i + 1}.png`);
    await page.screenshot({ path: pngPath, type: 'png' });
    pngPaths.push(pngPath);
    console.log(`✓ slide-${i + 1}.png`);
  }

  await browser.close();

  // combine PNGs into a single PDF (landscape A-style, image fills the page)
  const pdfDoc = await PDFDocument.create();

  for (const pngPath of pngPaths) {
    const imgBytes = fs.readFileSync(pngPath);
    const img = await pdfDoc.embedPng(imgBytes);

    // landscape page sized to image aspect ratio (standard 16:9)
    const pageWidth = 1920;
    const pageHeight = 1080;
    const pdfPage = pdfDoc.addPage([pageWidth, pageHeight]);
    pdfPage.drawImage(img, { x: 0, y: 0, width: pageWidth, height: pageHeight });
  }

  const pdfPath = path.join(OUT_DIR, 'webinar-use-cases-slides.pdf');
  fs.writeFileSync(pdfPath, await pdfDoc.save());
  console.log(`\n✓ PDF: ${pdfPath}`);
  console.log(`✓ PNGs: ${OUT_DIR}/slide-*.png`);
})();
