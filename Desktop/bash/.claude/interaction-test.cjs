const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const filePath = 'file:///' + path.resolve('dist/index.html').replace(/\\/g, '/');
  await page.goto(filePath);
  await page.waitForTimeout(1000);

  // 초기 상태 스크린샷
  await page.screenshot({ path: '.claude/screenshots/e2e-01-initial.png', fullPage: true });

  // 샘플 데이터 추가
  const sampleBtn = await page.$('#btn-sample');
  if (sampleBtn) {
    await sampleBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '.claude/screenshots/e2e-02-sample-data.png', fullPage: true });
  }

  // 연락처 추가
  await page.fill('#input-name', '테스트');
  await page.fill('#input-phone', '010-9999-8888');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '.claude/screenshots/e2e-03-insert.png', fullPage: true });

  // 검색
  await page.fill('#input-name', '홍길동');
  await page.click('#btn-search');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '.claude/screenshots/e2e-04-search.png', fullPage: true });

  // 삭제
  await page.fill('#input-name', '테스트');
  await page.click('#btn-delete');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '.claude/screenshots/e2e-05-delete.png', fullPage: true });

  console.log('Console errors:', errors.length);
  errors.forEach(e => console.log('  ERROR:', e));
  console.log('E2E test:', errors.length === 0 ? 'PASSED' : 'FAILED');

  await browser.close();
})();
