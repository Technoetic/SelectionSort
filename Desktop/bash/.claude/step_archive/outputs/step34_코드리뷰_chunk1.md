# Step 34: 코드 분석 - knip 미사용 코드 분석

## 개요
`knip` 도구를 사용하여 미사용 파일, 미사용 의존성, 미사용 코드를 분석했습니다.

## 분석 결과 요약

### 전체 통계
- **분석 대상 파일**: 200+개 (프로젝트 전체)
- **미사용 파일**: 170개 감지
- **미사용 의존성**: 6개
- **모듈 클린 상태**: 양호

## 미사용 파일 분석

### 주 프로젝트 소스 (문제 없음)
소스 코드의 모든 파일이 현재 사용 중:
- ✅ `src/js/*.js` - 모두 사용 중
- ✅ `src/classes/*.js` - 모두 사용 중
- ✅ `src/utils/constants.js` - 사용 중
- ✅ `src/css/*.css` - 모두 사용 중
- ✅ `src/*.jsx` - 모두 사용 중

### 미사용 파일 (무시 가능)
감지된 미사용 파일은 대부분 다음 카테고리:

1. **설정 파일** (기술적으로 미사용으로 감지되지만 필요):
   - `lighthouserc.js` - lighthouse 성능 검사 설정
   - `vite.config.js` - 빌드 도구 설정
   - `tailwind.config.js` - CSS 프레임워크 설정
   - `postcss.config.js` - CSS 처리기 설정
   - `tsconfig.json`, `tsconfig.node.json` - TypeScript 설정
   - `eslint.config.js` - 린터 설정

2. **참고 자료 및 분석 파일** (`.claude/references/`):
   - algorithm-visualizer 참고 자료
   - dsa-visualization 참고 자료
   - big-o-performance 참고 자료
   - 선형 해싱 구현 참고
   - Torus 분산 시스템 참고

3. **Playwright 테스트 파일** (`.claude/`):
   - playwright-research-*.js - UI 테스트 연구용

## 미사용 의존성 분석

### 미사용으로 감지된 패키지 (package.json)

#### Dependencies (6개):
1. **@axe-core/playwright** - 접근성 테스팅 (실제로 사용되지 않음)
2. **ace-builds** - 코드 에디터 (사용 가능하지만 현재 미사용)
3. **c8** - 코드 커버리지 (테스트 도구로 설정되었지만 미사용)
4. **gsap** - 애니메이션 라이브러리 (내부 애니메이션 엔진 사용)
5. **jscpd** - 코드 중복 분석 (분석 도구, 실행 시에만 사용)
6. **react-icons** - 아이콘 라이브러리 (미사용)

#### DevDependencies (6개):
1. **@biomejs/biome** - 코드 포매터 (설정만 있음)
2. **@lhci/cli** - Lighthouse CI (설정만 있음)
3. **madge** - 의존성 시각화 (미사용)
4. **playwright** - E2E 테스트 (설정되었지만 미사용)
5. **stylelint** - CSS 린터 (설정만 있음)
6. **stylelint-config-standard** - stylelint 규칙 (stylelint와 함께 설정됨)

## 주요 발견사항

### 긍정적 평가
1. **핵심 소스 코드 우수**: src/ 디렉토리의 모든 파일이 활발히 사용됨
2. **효율적인 구조**: 불필요한 중간 파일이 없음
3. **모듈 간 의존성 명확**: 각 모듈의 역할이 뚜렷함

### 개선 권장사항

1. **불필요한 의존성 제거**:
   ```
   npm uninstall gsap ace-builds @axe-core/playwright react-icons
   ```
   - gsap 대신 내부 AnimationEngine 사용
   - ace-builds 미사용
   - @axe-core/playwright, react-icons 미사용

2. **개발 의존성 정리**:
   ```
   npm uninstall --save-dev madge
   ```
   - madge는 의존성 시각화만 하고 실제 로직에 영향 없음

3. **테스트 도구 통합** (선택사항):
   - playwright와 c8를 실제로 사용하거나 제거
   - 현재는 설정만 있고 미사용

4. **린터 활성화**:
   - biome, stylelint 설정이 있으므로 CI/CD에 통합하거나 제거

## 분석 결과 신뢰도
- **높음**: 의존성 분석은 매우 정확함
- **보통**: 파일 사용 여부는 동적 import 등으로 감지 실패할 수 있음

## 권장 정리 작업 (우선순위)

### 1순위 - 반드시 제거
- gsap (내부 엔진 사용)
- react-icons (미사용)

### 2순위 - 검토 후 제거
- ace-builds
- @axe-core/playwright
- madge

### 3순위 - 활용 계획 후 유지
- playwright (E2E 테스트 도입하면 유지)
- c8 (커버리지 측정하면 유지)
- @biomejs/biome (CI/CD 통합하면 유지)
- stylelint (CSS 검사 통합하면 유지)

## 분석 데이터 소스
- 분석 도구: knip
- 분석 일시: 2026-03-13
- 결과 파일: `.claude/step34_knip_results.json`
- Node 버전: v20.11.0
