const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const files = [
  'pg-vs-mysql-01-db-engines-trend',
  'pg-vs-mysql-02-stackoverflow-survey',
  'pg-vs-mysql-03-extension-ecosystem',
  'pg-vs-mysql-04-mvcc-comparison',
  'pg-vs-mysql-05-openai-notion-architecture',
  'pg-vs-mysql-06-feature-comparison',
  'pg-vs-mysql-07-decision-framework',
  'pg-vs-mysql-08-oltp-olap-bridge',
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 700, height: 400, deviceScaleFactor: 2 });

  for (const file of files) {
    const htmlPath = path.resolve(__dirname, `${file}.html`);
    if (!fs.existsSync(htmlPath)) {
      console.log(`SKIP: ${file}.html not found`);
      continue;
    }
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    const outPath = path.resolve(__dirname, `${file}.png`);
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 700, height: 400 } });
    console.log(`OK: ${outPath}`);
  }

  await browser.close();
  console.log('\nDone. All screenshots saved as PNG.');
})();
