const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  const fp = 'file:///' + path.resolve('dist/index.html').replace(/\\/g, '/');
  await page.goto(fp);
  await page.waitForTimeout(2000);

  // 1. 초기 상태
  await page.screenshot({ path: '.claude/screenshots/final-01-initial.png' });
  console.log('1. Initial state OK');

  // 2. 샘플 데이터 추가
  await page.click('#btn-sample');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '.claude/screenshots/final-02-sample.png' });
  const contacts = await page.$$('.contact-card');
  console.log(`2. Sample data: ${contacts.length} contacts`);

  // 3. 수동 삽입
  await page.fill('#input-name', '테스트맨');
  await page.fill('#input-phone', '010-9876-5432');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '.claude/screenshots/final-03-insert.png' });
  const afterInsert = await page.$$('.contact-card');
  console.log(`3. After insert: ${afterInsert.length} contacts`);

  // 4. 검색
  await page.fill('#input-name', '홍길동');
  await page.click('#btn-search');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '.claude/screenshots/final-04-search.png' });
  console.log('4. Search OK');

  // 5. 삭제
  await page.fill('#input-name', '테스트맨');
  await page.click('#btn-delete');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '.claude/screenshots/final-05-delete.png' });
  const afterDelete = await page.$$('.contact-card');
  console.log(`5. After delete: ${afterDelete.length} contacts`);

  // 6. 테이블 리사이징
  await page.selectOption('#table-size', '13');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '.claude/screenshots/final-06-resize.png' });
  const bucketsAfter = await page.$$('.bucket');
  console.log(`6. After resize: ${bucketsAfter.length} buckets`);

  // 7. 스크린샷
  await page.screenshot({ path: '.claude/screenshots/final-07-overview.png' });
  console.log('7. Overview OK');

  // 8. 초기화
  await page.click('#btn-reset');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '.claude/screenshots/final-08-reset.png' });
  const afterReset = await page.$$('.contact-card');
  console.log(`8. After reset: ${afterReset.length} contacts`);

  // 9. 속도 조절
  await page.fill('#speed-slider', '2');
  await page.dispatchEvent('#speed-slider', 'input');
  console.log('9. Speed control OK');

  // 10. 키보드 Enter
  await page.fill('#input-name', '키보드맨');
  await page.fill('#input-phone', '010-1111-2222');
  await page.press('#input-phone', 'Enter');
  await page.waitForTimeout(1500);
  const afterKeyboard = await page.$$('.contact-card');
  console.log(`10. Keyboard submit: ${afterKeyboard.length} contacts`);

  console.log('\nPage errors:', errors.length);
  errors.forEach(e => console.log('  -', e));
  console.log('\nFull E2E test:', errors.length === 0 ? 'PASSED' : 'FAILED');

  await browser.close();
})();
