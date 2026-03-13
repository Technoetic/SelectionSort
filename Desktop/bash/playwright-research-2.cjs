const fs = require('fs');
const path = require('path');

(async () => {
  const outputDir = '.claude/research-raw';
  
  const jsFiles = [
    'src/js/HashTable.js',
    'src/js/ContactBook.js',
    'src/js/AnimationEngine.js',
    'src/js/Visualizer.js',
    'src/js/TutorialManager.js',
    'src/js/App.js',
  ];

  try {
    let analysis = '# 주요 JS 파일 분석\n\n';
    analysis += `## 분석 시각: ${new Date().toISOString()}\n\n`;

    for (const file of jsFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        // 함수/클래스 추출
        const functions = [];
        const classes = [];
        const exports = [];
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('function ')) {
            functions.push({ line: i + 1, name: line.split('(')[0].replace('function ', '') });
          }
          if (line.startsWith('class ')) {
            classes.push({ line: i + 1, name: line.split(' ')[1] || 'Unknown' });
          }
          if (line.includes('export ') || line.includes('module.exports')) {
            exports.push({ line: i + 1, content: line });
          }
        }

        analysis += `## ${file}\n\n`;
        analysis += `- 전체 라인: ${lines.length}\n`;
        analysis += `- 함수: ${functions.length} (${functions.map(f => f.name).join(', ')})\n`;
        analysis += `- 클래스: ${classes.length} (${classes.map(c => c.name).join(', ')})\n`;
        analysis += `- Export: ${exports.length} 개\n`;
        analysis += `\n`;

        // 처음 50줄 샘플
        analysis += '### 샘플 코드 (처음 50줄)\n\n```javascript\n';
        analysis += lines.slice(0, 50).join('\n');
        analysis += '\n```\n\n';
      }
    }

    fs.writeFileSync(path.join(outputDir, 'js-files-analysis.txt'), analysis, 'utf8');
    console.log('✅ JS 파일 분석 완료:', path.join(outputDir, 'js-files-analysis.txt'));
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
})();
