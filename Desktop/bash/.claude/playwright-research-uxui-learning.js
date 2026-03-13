// playwright-research-uxui-learning.js
// Research: Interactive Learning Platforms and Educational UX
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Researching: Brilliant.org - Interactive Learning Platform');
    await page.goto('https://brilliant.org/wiki/hash-tables/', { timeout: 30000 });

    // Take screenshot
    await page.screenshot({
      path: '.claude/screenshots/research-uxui-brilliant-hashtable.png',
      fullPage: false
    });
    console.log('Screenshot saved: research-uxui-brilliant-hashtable.png');

    // Extract content
    const content = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText.substring(0, 10000),
        sections: document.querySelectorAll('article section, .section, [role="main"] section').length,
        images: document.querySelectorAll('img').length,
        interactive: document.querySelectorAll('[data-interactive], .interactive, [class*="interactive"]').length,
      };
    });

    // Save raw content
    fs.writeFileSync(
      '.claude/research-raw-uxui-brilliant.txt',
      `BRILLIANT.ORG HASH TABLE PAGE ANALYSIS\n` +
      `=====================================\n` +
      `Title: ${content.title}\n` +
      `Page Structure:\n` +
      `- Sections: ${content.sections}\n` +
      `- Images/Diagrams: ${content.images}\n` +
      `- Interactive Components: ${content.interactive}\n\n` +
      `Content Preview:\n${content.bodyText}`,
      'utf8'
    );
    console.log('Raw content saved: research-raw-uxui-brilliant.txt');

  } catch (error) {
    console.error('Error during Brilliant.org research:', error);
    fs.writeFileSync(
      '.claude/research-error-uxui-brilliant.txt',
      `Error: ${error.message}\n${error.stack}`,
      'utf8'
    );
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
