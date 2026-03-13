// playwright-research-uxui-patterns.js
// Research: Web-based UI Patterns and Interactive Design
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Researching: MDN Web Docs - Interactive Web Tutorials');
    await page.goto('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures', { timeout: 30000 });

    // Take screenshot
    await page.screenshot({
      path: '.claude/screenshots/research-uxui-mdn-datastructures.png',
      fullPage: false
    });
    console.log('Screenshot saved: research-uxui-mdn-datastructures.png');

    // Extract content
    const content = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText.substring(0, 10000),
        codeBlocks: document.querySelectorAll('pre, code, [class*="code"]').length,
        examples: document.querySelectorAll('[class*="example"], .example, aside').length,
        navigation: document.querySelectorAll('nav, [role="navigation"]').length,
        interactiveElements: document.querySelectorAll('[role="button"], button, [interactive]').length,
      };
    });

    // Save raw content
    fs.writeFileSync(
      '.claude/research-raw-uxui-mdn.txt',
      `MDN WEB DOCS - DATA STRUCTURES PAGE ANALYSIS\n` +
      `==========================================\n` +
      `Title: ${content.title}\n` +
      `Educational Content Structure:\n` +
      `- Code Examples: ${content.codeBlocks}\n` +
      `- Example Sections: ${content.examples}\n` +
      `- Navigation Elements: ${content.navigation}\n` +
      `- Interactive Components: ${content.interactiveElements}\n\n` +
      `Content Preview:\n${content.bodyText}`,
      'utf8'
    );
    console.log('Raw content saved: research-raw-uxui-mdn.txt');

  } catch (error) {
    console.error('Error during MDN research:', error);
    fs.writeFileSync(
      '.claude/research-error-uxui-mdn.txt',
      `Error: ${error.message}\n${error.stack}`,
      'utf8'
    );
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
