const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // 첫 번째 사이트: Open Hash
    await page.goto('https://www.cs.usfca.edu/~galles/visualization/OpenHash.html', { timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '.claude/screenshots/research-4-usfca.png', fullPage: false });

    const content = await page.evaluate(() => {
      return document.body.innerText.substring(0, 3000);
    });

    fs.writeFileSync('.claude/research-raw-4.txt', content, 'utf8');
    console.log('✓ OpenHash 데이터 수집 완료');

    // 두 번째 사이트: Closed Hash
    await page.goto('https://www.cs.usfca.edu/~galles/visualization/ClosedHash.html', { timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '.claude/screenshots/research-4b-usfca-closed.png', fullPage: false });

    const content2 = await page.evaluate(() => {
      return document.body.innerText.substring(0, 3000);
    });

    fs.writeFileSync('.claude/research-raw-4b.txt', content2, 'utf8');
    console.log('✓ ClosedHash 데이터 수집 완료');

  } catch (error) {
    console.error('오류:', error.message);
  } finally {
    await browser.close();
  }
})();
