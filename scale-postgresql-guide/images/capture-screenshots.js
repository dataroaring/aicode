const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const files = [
  'scale-pg-01-scaling-spectrum',
  'scale-pg-02-architecture-constraints',
  'scale-pg-03-connection-pooling',
  'scale-pg-04-partitioning',
  'scale-pg-05-sharding',
  'scale-pg-06-analytics-offload',
  'scale-pg-07-decision-framework',
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 700, height: 400, deviceScaleFactor: 2 });

  for (const file of files) {
    const htmlPath = path.join(__dirname, `${file}.html`);
    const outPath = path.join(__dirname, `${file}.png`);
    if (!fs.existsSync(htmlPath)) {
      console.log(`Skipped (not found): ${file}.html`);
      continue;
    }

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: outPath,
      clip: { x: 0, y: 0, width: 700, height: 400 }
    });
    console.log(`Captured: ${file}.png`);
  }

  await browser.close();
  console.log('All screenshots captured.');
})();
