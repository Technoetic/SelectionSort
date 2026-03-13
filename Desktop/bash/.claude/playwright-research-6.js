const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Material Design contacts component 조사
    console.log('Material Design 컴포넌트 페이지 접속...');
    await page.goto('https://m3.material.io/components', { timeout: 30000 });
    await page.waitForTimeout(3000);

    // 스크린샷 저장
    await page.screenshot({ path: '.claude/screenshots/research-6-material.png', fullPage: false });
    console.log('스크린샷 저장 완료');

    // 페이지 내용 추출
    const content = await page.evaluate(() => {
      return document.body.innerText.substring(0, 10000);
    });

    fs.writeFileSync('.claude/research-raw-6.txt', content, 'utf8');
    console.log('페이지 내용 저장 완료');

    // 추가: 연락처 관련 컴포넌트 분석
    console.log('추가 분석 중...');
    const componentList = await page.evaluate(() => {
      const items = [];
      const links = document.querySelectorAll('a[href*="component"]');
      links.forEach((link, idx) => {
        if (idx < 10) {
          items.push({
            text: link.textContent.trim(),
            href: link.getAttribute('href')
          });
        }
      });
      return items;
    });

    fs.writeFileSync('.claude/research-components-6.json', JSON.stringify(componentList, null, 2), 'utf8');
    console.log('컴포넌트 목록 저장 완료');

  } catch (error) {
    console.error('오류 발생:', error.message);
  } finally {
    await browser.close();
  }
})();
