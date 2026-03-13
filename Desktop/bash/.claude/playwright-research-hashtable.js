// playwright-research-hashtable.js
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Fetching Wikipedia - Hash table...');
    await page.goto('https://en.wikipedia.org/wiki/Hash_table', { timeout: 30000 });

    // Take screenshot
    await page.screenshot({
      path: '.claude/screenshots/research-hashtable-wiki.png',
      fullPage: false
    });
    console.log('Screenshot saved: .claude/screenshots/research-hashtable-wiki.png');

    // Extract text content
    const content = await page.evaluate(() => {
      const article = document.querySelector('#mw-content-text');
      if (article) {
        return article.innerText;
      }
      return document.body.innerText;
    });

    // Save raw content
    fs.writeFileSync(
      '.claude/research-raw-hashtable.txt',
      content,
      'utf8'
    );
    console.log('Raw content saved: .claude/research-raw-hashtable.txt');
    console.log('Content length:', content.length, 'characters');

  } catch (error) {
    console.error('Error during research:', error);
    fs.writeFileSync(
      '.claude/research-error-hashtable.txt',
      `Error: ${error.message}\n${error.stack}`,
      'utf8'
    );
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
