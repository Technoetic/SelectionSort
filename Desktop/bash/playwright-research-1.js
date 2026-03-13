const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outputDir = '.claude/research-raw';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 프로젝트 구조 분석
    const srcDir = 'src';
    const fileAnalysis = {};
    
    function walkDir(dir, rootPath = '') {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const relPath = rootPath ? `${rootPath}/${file}` : file;
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          fileAnalysis[relPath + '/'] = { type: 'directory' };
          walkDir(fullPath, relPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.html')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n').length;
          fileAnalysis[relPath] = {
            type: 'file',
            ext: path.extname(file),
            lines: lines,
            size: stat.size,
            hasExports: content.includes('export') || content.includes('module.exports'),
            hasImports: content.includes('import') || content.includes('require'),
          };
        }
      });
    }

    walkDir(srcDir);
    
    // 결과 저장
    const resultContent = `# 프로젝트 파일 구조 분석

## 분석 시각: ${new Date().toISOString()}

## 프로젝트 구조

\`\`\`json
${JSON.stringify(fileAnalysis, null, 2)}
\`\`\`

## 통계

- 총 JS/JSX 파일: ${Object.entries(fileAnalysis).filter(([k, v]) => v.ext === '.js' || v.ext === '.jsx').length}
- 총 CSS 파일: ${Object.entries(fileAnalysis).filter(([k, v]) => v.ext === '.css').length}
- 총 HTML 파일: ${Object.entries(fileAnalysis).filter(([k, v]) => v.ext === '.html').length}

`;

    fs.writeFileSync(path.join(outputDir, 'project-structure.txt'), resultContent, 'utf8');
    console.log('✅ 프로젝트 구조 분석 완료:', path.join(outputDir, 'project-structure.txt'));
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
})();
