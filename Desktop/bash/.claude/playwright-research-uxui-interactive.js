// playwright-research-uxui-interactive.js
// Research: Interactive Data Structure Visualizations and UX/UI Patterns
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Researching: VisuAlgo - Data Structure Visualization Platform');
    await page.goto('https://visualgo.net/en/hashtable', { timeout: 30000 });

    // Take screenshot
    await page.screenshot({
      path: '.claude/screenshots/research-uxui-visualgo-hashtable.png',
      fullPage: false
    });
    console.log('Screenshot saved: research-uxui-visualgo-hashtable.png');

    // Extract text content
    const content = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText,
        headingsCount: document.querySelectorAll('h1, h2, h3').length,
        buttonsCount: document.querySelectorAll('button').length,
        inputsCount: document.querySelectorAll('input, select').length,
      };
    });

    // Save raw content
    fs.writeFileSync(
      '.claude/research-raw-uxui-visualgo.txt',
      `VISUALGO HASH TABLE PAGE ANALYSIS\n` +
      `================================\n` +
      `Title: ${content.title}\n` +
      `Interactive Elements Found:\n` +
      `- Buttons: ${content.buttonsCount}\n` +
      `- Input/Select Controls: ${content.inputsCount}\n` +
      `- Headings: ${content.headingsCount}\n\n` +
      `Page Content:\n${content.bodyText}`,
      'utf8'
    );
    console.log('Raw content saved: research-raw-uxui-visualgo.txt');

  } catch (error) {
    console.error('Error during VisuAlgo research:', error);
    fs.writeFileSync(
      '.claude/research-error-uxui-visualgo.txt',
      `Error: ${error.message}\n${error.stack}`,
      'utf8'
    );
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
