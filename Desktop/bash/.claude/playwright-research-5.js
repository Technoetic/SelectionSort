const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log('Navigating to algorithm-visualizer.org...');
    await page.goto('https://algorithm-visualizer.org/', { timeout: 30000, waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('Taking screenshot...');
    await page.screenshot({
      path: '.claude/screenshots/research-5-algo-viz.png',
      fullPage: true
    });

    console.log('Extracting page content...');
    const content = await page.evaluate(() => {
      const body = document.body.innerText || '';
      const html = document.documentElement.outerHTML || '';
      return {
        text: body.substring(0, 5000),
        html: html.substring(0, 8000)
      };
    });

    // Also extract visual structure info
    const uiElements = await page.evaluate(() => {
      const result = {
        buttons: [],
        inputs: [],
        colors: [],
        layout: {
          header: !!document.querySelector('header'),
          nav: !!document.querySelector('nav'),
          main: !!document.querySelector('main'),
          sidebar: !!document.querySelector('[class*="sidebar"], [class*="side"]')
        }
      };

      // Collect button info
      document.querySelectorAll('button, [role="button"]').forEach(btn => {
        result.buttons.push({
          text: btn.textContent.trim().substring(0, 50),
          class: btn.className
        });
      });

      // Collect input elements
      document.querySelectorAll('input, textarea').forEach(inp => {
        result.inputs.push({
          type: inp.type,
          placeholder: inp.placeholder,
          class: inp.className
        });
      });

      // Extract color palette from computed styles
      const colors = new Set();
      document.querySelectorAll('*').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colors.add(style.backgroundColor);
        }
        if (style.color) {
          colors.add(style.color);
        }
      });
      result.colors = Array.from(colors).slice(0, 20);

      return result;
    });

    const fullReport = `# Algorithm Visualizer - UX/UI Research Report

## Page Structure
- Body Text (first 5000 chars): ${content.text}

## UI Elements Found
${JSON.stringify(uiElements, null, 2)}

## HTML Structure (first 8000 chars)
${content.html}

## Analysis Timestamp
${new Date().toISOString()}
`;

    fs.writeFileSync('.claude/research-raw-5.txt', fullReport, 'utf8');
    console.log('Data saved to .claude/research-raw-5.txt');

    await browser.close();
    console.log('Research complete.');
  } catch (error) {
    console.error('Error during research:', error.message);
    process.exit(1);
  }
})();
