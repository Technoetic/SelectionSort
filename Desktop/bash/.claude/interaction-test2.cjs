const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  const errors = [];
  page.on('console', msg => {
    console.log(`[${msg.type()}]`, msg.text());
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const filePath = 'file:///' + path.resolve('dist/index.html').replace(/\\/g, '/');
  await page.goto(filePath);
  await page.waitForTimeout(2000);

  // 샘플 데이터 추가
  await page.click('#btn-sample');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: '.claude/screenshots/e2e-sample-long.png', fullPage: true });

  // 연락처 목록 확인
  const contacts = await page.$$('.contact-card');
  console.log('Contact cards found:', contacts.length);

  // 버킷 확인
  const buckets = await page.$$('.bucket');
  console.log('Buckets found:', buckets.length);

  // 체인 노드 확인
  const nodes = await page.$$('.chain-node');
  console.log('Chain nodes found:', nodes.length);

  // 튜토리얼 패널 확인
  const tutorialContent = await page.$eval('.tutorial-panel', el => el.innerHTML.length);
  console.log('Tutorial content length:', tutorialContent);

  await browser.close();
})();
