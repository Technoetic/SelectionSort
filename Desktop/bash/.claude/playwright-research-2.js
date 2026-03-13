const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://visualgo.net/en/hashtable', { timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '.claude/screenshots/research-2-visualgo.png', fullPage: false });

    const content = await page.evaluate(() => {
      return document.body.innerText.substring(0, 5000);
    });

    fs.writeFileSync('.claude/research-raw-2.txt', content, 'utf8');
    console.log('Playwright research completed successfully');
    console.log('Screenshot: .claude/screenshots/research-2-visualgo.png');
    console.log('Raw data: .claude/research-raw-2.txt');

    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
