const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

(async () => {
  const outputDir = '.claude/research-raw';
  
  try {
    let analysis = '# GitHub 저장소 조사 결과\n\n';
    analysis += `## 분석 시각: ${new Date().toISOString()}\n\n`;

    // Git 로컬 정보
    analysis += '## 1. 로컬 Git 정보\n\n';
    
    try {
      const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      const lastAuthor = execSync('git log -1 --format=%an', { encoding: 'utf8' }).trim();
      const lastCommitMsg = execSync('git log -1 --format=%s', { encoding: 'utf8' }).trim();
      
      analysis += `**원격 저장소**: ${remoteUrl}\n`;
      analysis += `**현재 브랜치**: ${branch}\n`;
      analysis += `**최신 커밋**: ${commitHash.substring(0, 7)}\n`;
      analysis += `**마지막 작성자**: ${lastAuthor}\n`;
      analysis += `**마지막 커밋 메시지**: ${lastCommitMsg}\n\n`;

      // 커밋 통계
      const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
      const fileCount = execSync('git ls-files | wc -l', { encoding: 'utf8' }).trim();
      
      analysis += `**총 커밋**: ${commitCount}개\n`;
      analysis += `**추적 파일**: ${fileCount}개\n`;
      analysis += `**저장소 이름**: ${remoteUrl.split('/').pop().replace('.git', '')}\n`;
      analysis += `**소유자**: ${remoteUrl.split('/')[remoteUrl.split('/').length - 2]}\n\n`;
    } catch (e) {
      analysis += `**Git 정보 수집 실패**: ${e.message}\n\n`;
    }

    // 프로젝트 메타데이터
    analysis += '## 2. 프로젝트 메타데이터\n\n';
    
    const packagePath = 'package.json';
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      analysis += `**프로젝트 이름**: ${pkg.name || 'N/A'}\n`;
      analysis += `**버전**: ${pkg.version || 'N/A'}\n`;
      analysis += `**설명**: ${pkg.description || 'N/A'}\n`;
      analysis += `**저자**: ${pkg.author || 'N/A'}\n`;
      analysis += `**라이선스**: ${pkg.license || 'N/A'}\n`;
      analysis += `**저장소**: ${pkg.repository?.url || 'N/A'}\n`;
      analysis += `**홈페이지**: ${pkg.homepage || 'N/A'}\n\n`;
      
      analysis += '### 의존성 통계\n\n';
      const deps = pkg.dependencies ? Object.keys(pkg.dependencies).length : 0;
      const devDeps = pkg.devDependencies ? Object.keys(pkg.devDependencies).length : 0;
      analysis += `**일반 의존성**: ${deps}개\n`;
      analysis += `**개발 의존성**: ${devDeps}개\n`;
      analysis += `**총 의존성**: ${deps + devDeps}개\n\n`;
    }

    // README 분석
    analysis += '## 3. README 파일 분석\n\n';
    if (fs.existsSync('README.md')) {
      const readme = fs.readFileSync('README.md', 'utf8');
      const lines = readme.split('\n');
      analysis += `**파일 크기**: ${(readme.length / 1024).toFixed(2)} KB\n`;
      analysis += `**라인 수**: ${lines.length}\n`;
      analysis += `**섹션 수**: ${(readme.match(/^#+\s/gm) || []).length}\n\n`;
      
      analysis += '### 처음 500자\n\n';
      analysis += '```markdown\n';
      analysis += readme.substring(0, 500);
      analysis += '\n```\n\n';
    } else {
      analysis += '**README.md**: 없음\n\n';
    }

    // 라이선스 확인
    analysis += '## 4. 라이선스 정보\n\n';
    const licenses = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING', 'COPYING.md'];
    let licenseFound = false;
    for (const lic of licenses) {
      if (fs.existsSync(lic)) {
        const licContent = fs.readFileSync(lic, 'utf8');
        analysis += `**파일명**: ${lic}\n`;
        analysis += `**크기**: ${(licContent.length / 1024).toFixed(2)} KB\n`;
        analysis += `\`\`\`\n`;
        analysis += licContent.substring(0, 300);
        analysis += `\n\`\`\`\n\n`;
        licenseFound = true;
        break;
      }
    }
    if (!licenseFound) {
      analysis += '**라이선스 파일**: 없음\n\n';
    }

    // 구성 파일 확인
    analysis += '## 5. 구성 파일\n\n';
    const configFiles = [
      '.gitignore',
      'tsconfig.json',
      'webpack.config.js',
      'vitest.config.js',
      'biome.json',
      '.eslintrc.js',
      'prettier.config.js'
    ];
    
    analysis += '| 파일 | 상태 |\n|------|------|\n';
    for (const cfg of configFiles) {
      const status = fs.existsSync(cfg) ? '✅ 있음' : '❌ 없음';
      analysis += `| ${cfg} | ${status} |\n`;
    }
    analysis += '\n';

    fs.writeFileSync(path.join(outputDir, 'github-analysis.txt'), analysis, 'utf8');
    console.log('✅ GitHub 조사 완료:', path.join(outputDir, 'github-analysis.txt'));
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
})();
