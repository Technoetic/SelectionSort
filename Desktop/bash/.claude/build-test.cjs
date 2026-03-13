const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const filePath = 'file:///' + path.resolve('dist/index.html').replace(/\\/g, '/');
  console.log('Loading:', filePath);

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto(filePath);
  await page.waitForTimeout(2000);

  await page.screenshot({ path: '.claude/screenshots/build-test.png', fullPage: true });

  const title = await page.title();
  console.log('Title:', title);

  const appDiv = await page.$('#app');
  console.log('App div:', appDiv ? 'Found' : 'Not found');

  const bucketArray = await page.$('.bucket-array');
  console.log('Bucket array:', bucketArray ? 'Found' : 'Not found');

  const tutorialPanel = await page.$('.tutorial-panel');
  console.log('Tutorial panel:', tutorialPanel ? 'Found' : 'Not found');

  console.log('Console errors:', errors.length);
  if (errors.length > 0) {
    errors.forEach(e => console.log('  ERROR:', e));
  }

  await browser.close();
  console.log('Build test:', errors.length === 0 ? 'PASSED' : 'FAILED');
})();
