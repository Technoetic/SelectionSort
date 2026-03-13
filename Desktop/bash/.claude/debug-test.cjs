const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGE ERROR:', e.message));
  page.on('console', msg => console.log('[' + msg.type() + ']', msg.text()));
  const fp = 'file:///' + path.resolve('dist/index.html').replace(/\\/g, '/');
  await page.goto(fp);
  await page.waitForTimeout(3000);
  await browser.close();
})();
