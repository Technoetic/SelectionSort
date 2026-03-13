const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

(async () => {
  // Simple HTTP server for axe-core compatibility
  const html = fs.readFileSync('dist/index.html', 'utf8');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  });
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`http://localhost:${port}`);
  await page.waitForTimeout(2000);

  const results = await new AxeBuilder({ page }).analyze();

  console.log('Violations:', results.violations.length);
  results.violations.forEach(v => {
    console.log(`  [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`);
  });

  console.log('Passes:', results.passes.length);
  console.log('Incomplete:', results.incomplete.length);

  fs.writeFileSync('.claude/a11y-results.json', JSON.stringify(results, null, 2));
  console.log('\nAccessibility test:', results.violations.length === 0 ? 'PASSED' : `${results.violations.length} issues found`);

  await browser.close();
  server.close();
})();
