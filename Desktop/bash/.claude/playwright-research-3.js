const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://en.wikipedia.org/wiki/Associative_array', { timeout: 30000 });
  await page.screenshot({ path: '.claude/screenshots/research-3-assoc-array.png', fullPage: false });

  const content = await page.evaluate(() => {
    const article = document.querySelector('#mw-content-text');
    return article ? article.innerText.substring(0, 5000) : document.body.innerText.substring(0, 5000);
  });

  fs.writeFileSync('.claude/research-raw-3.txt', content, 'utf8');
  await browser.close();
})();
