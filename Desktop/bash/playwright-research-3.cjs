const fs = require('fs');
const path = require('path');

(async () => {
  const outputDir = '.claude/research-raw';
  
  try {
    // HTML 파일 분석
    const htmlPath = 'src/index.html';
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // CSS 파일 분석
    const cssFiles = [
      'src/css/main.css',
      'src/css/animations.css',
      'src/css/tutorial.css',
      'src/css/visualizer.css'
    ];

    let analysis = '# UX/UI 구조 분석\n\n';
    analysis += `## 분석 시각: ${new Date().toISOString()}\n\n`;

    // HTML 구조 분석
    analysis += '## 1. HTML 구조\n\n';
    analysis += '### 마크업 분석\n\n';
    analysis += '```html\n';
    analysis += htmlContent.substring(0, 1000);
    analysis += '\n```\n\n';

    // DOM 요소 분석
    analysis += '### 주요 DOM 요소\n\n';
    const idMatches = htmlContent.match(/id="([^"]+)"/g) || [];
    const classMatches = htmlContent.match(/class="([^"]+)"/g) || [];
    
    analysis += `**ID 요소**: ${idMatches.length}개\n`;
    idMatches.slice(0, 10).forEach(match => {
      analysis += `- ${match}\n`;
    });
    if (idMatches.length > 10) {
      analysis += `- ... 외 ${idMatches.length - 10}개\n`;
    }

    analysis += '\n**Class 요소**: ${classMatches.length}개\n';
    classMatches.slice(0, 10).forEach(match => {
      analysis += `- ${match}\n`;
    });
    if (classMatches.length > 10) {
      analysis += `- ... 외 ${classMatches.length - 10}개\n`;
    }

    // CSS 분석
    analysis += '\n## 2. CSS 스타일 분석\n\n';
    
    let totalCSSLines = 0;
    let colorCount = 0;
    let animationCount = 0;

    for (const cssFile of cssFiles) {
      if (fs.existsSync(cssFile)) {
        const cssContent = fs.readFileSync(cssFile, 'utf8');
        const lines = cssContent.split('\n').length;
        const colors = (cssContent.match(/#[0-9a-f]{3,6}|rgb|hsla?/gi) || []).length;
        const animations = (cssContent.match(/@keyframes|animation|transition/gi) || []).length;
        
        totalCSSLines += lines;
        colorCount += colors;
        animationCount += animations;

        analysis += `### ${path.basename(cssFile)}\n`;
        analysis += `- 라인: ${lines}\n`;
        analysis += `- 색상 정의: ${colors}개\n`;
        analysis += `- 애니메이션: ${animations}개\n\n`;
      }
    }

    analysis += `## 3. CSS 통계\n\n`;
    analysis += `- 전체 CSS 라인: ${totalCSSLines}\n`;
    analysis += `- 전체 색상 정의: ${colorCount}개\n`;
    analysis += `- 전체 애니메이션: ${animationCount}개\n`;

    // 반응성 분석
    analysis += '\n## 4. 반응형 디자인\n\n';
    const mediaQueries = (htmlContent.match(/@media/gi) || []).length + 
                         cssFiles.reduce((sum, file) => {
                           if (fs.existsSync(file)) {
                             const content = fs.readFileSync(file, 'utf8');
                             return sum + (content.match(/@media/gi) || []).length;
                           }
                           return sum;
                         }, 0);
    
    analysis += `- 미디어 쿼리: ${mediaQueries}개\n`;
    analysis += `- 반응형 지원: ${mediaQueries > 0 ? '예' : '제한적'}\n`;

    // 접근성 분석
    analysis += '\n## 5. 접근성 분석\n\n';
    const ariaLabels = (htmlContent.match(/aria-/gi) || []).length;
    const altTexts = (htmlContent.match(/alt="/gi) || []).length;
    
    analysis += `- ARIA 속성: ${ariaLabels}개\n`;
    analysis += `- Alt 텍스트: ${altTexts}개\n`;
    analysis += `- 접근성 점수: ${ariaLabels > 0 ? '중상' : '낮음'}\n`;

    fs.writeFileSync(path.join(outputDir, 'ui-structure-analysis.txt'), analysis, 'utf8');
    console.log('✅ UI/UX 구조 분석 완료:', path.join(outputDir, 'ui-structure-analysis.txt'));
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
})();
