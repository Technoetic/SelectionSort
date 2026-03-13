# Step 34 코드 리뷰 보고서 - knip 미사용 코드 분석

**분석 일시:** 2026-03-13
**도구:** knip (Unused Code Detection)
**분석 대상:** 전체 프로젝트

---

## 전체 미사용 코드 분석 결과

| 카테고리 | 개수 | 상태 |
|---------|------|------|
| **미사용 파일** | 142개 | ⚠️ 많음 |
| **미사용 의존성** | 6개 | 🔴 높음 |
| **미사용 devDependencies** | 6개 | 🔴 높음 |
| **설정 권고사항** | 1개 | 📋 필요 |

---

## 1. 미사용 파일 분석 (142개)

### 분류별 분석

#### A. 설정 파일 (2개)
```
lighthouserc.cjs
lighthouserc.js
```
**분석:** Lighthouse CI 설정 파일로 보이지만 현재 사용되지 않음
**조치:** 삭제 권장

#### B. Playwright 테스트 파일 (9개)
```
.claude/playwright-research-*.js (8개)
- playwright-research-2.js
- playwright-research-3.js
- playwright-research-4.js
- playwright-research-5.js
- playwright-research-6.js
- playwright-research-hashtable.js
- playwright-research-uxui-interactive.js
- playwright-research-uxui-learning.js
- playwright-research-uxui-patterns.js
```
**분석:** 연구/개발용 Playwright 테스트 스크립트
**목적:** 프로토타입 작성, 일회성 테스트
**조치:** 검토 후 삭제 권장

#### C. 테스트 파일 (2개)
```
tests/ContactBook.test.cjs
tests/HashTable.test.cjs
```
**분석:** Unit test 파일로 보이지만 현재 미사용 상태
**원인:** Jest/Vitest 등과 연동되지 않음 (CommonJS 형식)
**조치:** 기존 테스트 프레임워크 통합 필요

#### D. 주요 소스 파일 (28개) - 중요
```
src/classes/AnimationManager.js
src/classes/HashTable.js
src/classes/UIController.js
src/classes/ViewRenderer.js
src/css/animations.css
src/css/main.css
src/css/tutorial.css
src/css/visualizer.css
src/js/AnimationEngine.js
src/js/App.js
src/js/ContactBook.js
src/js/HashTable.js
src/js/TutorialManager.js
src/js/Visualizer.js
src/utils/constants.js
src/js/HashTable.js [duplicate]
```

**분석:** 프로젝트의 핵심 소스 파일들이 미사용으로 표시됨

**원인:** knip이 ESM 모듈 엔트리포인트를 제대로 인식하지 못함
- src/App.jsx와 src/main.jsx가 실제 진입점
- 이 파일들이 다른 파일들을 import하지만 knip 설정 부재로 인식 실패

**설명:** ⚠️ **False Positive** - 실제로는 사용 중인 파일들

**조치:** knip.json 설정 파일 생성으로 해결 필요

#### E. Reference 디렉토리 파일들 (101개)
```
.claude/references/dsa-visualization/*
.claude/references/hash-table-visualizer/*
.claude/references/hash-table-visualized/*
.claude/references/linear-hashing/*
.claude/references/LinearHashing/*
.claude/references/algorithm-visualizer/*
.claude/references/torus/*
.claude/references/big-o-performance/*
```

**분석:** 연구용 참조 자료 및 벤치마크 코드
**목적:** 학습, 비교 분석, 컨셉 검증
**조치:** 별도 폴더로 관리하거나 .knip 제외 설정

---

## 2. 미사용 의존성 분석 (6개) - 우선순위 높음

### 현재 미사용 의존성

| 패키지 | 버전 | 이유 | 권장사항 |
|--------|------|------|---------|
| @axe-core/playwright | - | 접근성 테스트 미사용 | 삭제 또는 통합 계획 |
| ace-builds | - | 코드 에디터 라이브러리 미사용 | 삭제 또는 기능 추가 |
| c8 | - | 커버리지 도구 미사용 | 테스트 프레임워크 통합 시 필요 |
| gsap | - | **애니메이션 라이브러리** | ⚠️ 사실은 사용 중 (false positive) |
| jscpd | - | 중복 코드 분석 도구 | 개발 도구로 사용 |
| react-icons | - | 아이콘 라이브러리 미사용 | UI 개선 시 필요할 수 있음 |

**특별 주의:** GSAP은 src/classes/AnimationManager.js에서 사용되고 있습니다!

### 검토 필요 의존성

```json
{
  "@axe-core/playwright": "Accessibility testing - 사용 계획 있으면 유지",
  "ace-builds": "Code editor - 향후 기능 추가 계획 있으면 유지",
  "react-icons": "Icon library - UI 개선 계획 있으면 유지"
}
```

---

## 3. 미사용 devDependencies 분석 (6개)

| 패키지 | 버전 | 이유 | 권장사항 |
|--------|------|------|---------|
| @biomejs/biome | - | 코드 포매터/린터 미사용 | 활성화 필요 또는 삭제 |
| @lhci/cli | - | Lighthouse CI 미사용 | 설정 파일 제거 후 삭제 |
| madge | - | 의존성 시각화 도구 미사용 | 개발 도구 - 필요시 유지 |
| playwright | - | E2E 테스트 미사용 | 테스트 자동화 계획 있으면 유지 |
| stylelint | - | CSS 린터 미사용 | 활성화 필요 또는 삭제 |
| stylelint-config-standard | - | stylelint 설정 미사용 | stylelint 제거 시 함께 삭제 |

**분석:**
- 대부분 개발 도구로 설치되었으나 활용되지 않음
- 코드 품질 관리를 위해 활성화 추천

---

## 4. 설정 권고사항

### knip.json 설정 파일 필요

**현재 상태:** 설정 없음 → knip이 엔트리포인트를 인식 못함

**생성 권고 설정:**
```json
{
  "entry": [
    "src/main.jsx",
    "src/App.jsx",
    "src/index.html"
  ],
  "project": [
    "src/**/*.{js,jsx,ts,tsx}",
    "tests/**/*.{js,jsx,ts,tsx}"
  ],
  "ignore": [
    ".claude/**",
    "report/**",
    "dist/**",
    "node_modules/**"
  ],
  "ignoreBinaries": [
    "node",
    "npm"
  ]
}
```

**효과:**
- 미사용 파일 감지 정확도 대폭 향상
- False positive 제거
- 실제 dead code만 감지

---

## 우선순위별 조치 계획

### Phase 1: 긴급 (Immediate) - 설정 파일 생성

**목표:** knip 설정 정상화
**작업:**
1. knip.json 파일 생성
2. entry points 설정 (src/main.jsx, src/App.jsx)
3. project patterns 정의
4. ignore 패턴 설정

**예상 효과:**
- False positive 대폭 감소
- 실제 미사용 코드 정확히 감지

### Phase 2: 단기 (1주) - 명백한 미사용 코드 정리

**목표:** 프로젝트 정리
**작업:**
1. 설정 파일 삭제
   - lighthouserc.cjs / lighthouserc.js
2. Playwright 테스트 파일 정리
   - .claude/playwright-research-*.js 제거 (필요한 것만 백업)
3. 테스트 파일 통합 또는 삭제
   - tests/ContactBook.test.cjs → Vitest로 마이그레이션

**예상 효과:**
- 불필요한 파일 제거
- 프로젝트 정리도 향상

### Phase 3: 단기 (1~2주) - 의존성 정리

**목표:** package.json 최적화
**작업:**
1. 미사용 devDependencies 제거 또는 활성화
   - stylelint 활성화 (권장) 또는 제거
   - @biomejs/biome 활성화 (권장) 또는 제거
   - playwright 활성화 (권장) 또는 제거
2. 의도적 의존성 명시
   - react-icons, ace-builds 등 향후 계획 문서화

**예상 효과:**
- 명확한 의존성 정책
- 불필요한 패키지 제거로 설치 시간 단축

### Phase 4: 중기 (2~4주) - 코드 품질 도구 활성화

**목표:** 정적 분석 자동화
**작업:**
1. ESLint 설정 (이미 있으면 활성화)
2. stylelint 활성화
3. Prettier 또는 Biome 포매팅
4. pre-commit hook 설정
5. CI/CD 파이프라인 통합

**예상 효과:**
- 자동 코드 품질 검사
- 일관된 코드 스타일 유지

### Phase 5: 장기 - 테스트 자동화

**목표:** E2E 및 단위 테스트 프레임워크 구축
**작업:**
1. Vitest 설정 (단위 테스트)
2. Playwright 활성화 (E2E 테스트)
3. 테스트 커버리지 100% 목표

---

## 체크리스트

### 즉시 조치
- [ ] knip.json 설정 파일 생성
- [ ] entry points 정의
- [ ] 재분석 실행

### 첫 주
- [ ] lighthouserc.* 파일 삭제
- [ ] Playwright 테스트 파일 정리
- [ ] 테스트 파일 마이그레이션 계획

### 개발 도구 활성화
- [ ] stylelint 설정 및 활성화
- [ ] @biomejs/biome 설정 및 활성화
- [ ] pre-commit hook 설정

### 장기 계획
- [ ] E2E 테스트 자동화 (Playwright)
- [ ] 단위 테스트 프레임워크 (Vitest)
- [ ] CI/CD 파이프라인 통합

---

## 주의사항

⚠️ **GSAP 라이브러리:**
- knip이 GSAP을 미사용으로 보고하고 있음
- 하지만 AnimationManager.js에서 실제로 사용 중
- knip.json 설정 후 재검사 필요

⚠️ **src/ 소스 파일들:**
- 많은 수의 소스 파일이 미사용으로 보고됨
- 이는 knip 설정 부재로 인한 false positive
- knip.json 생성으로 해결될 것으로 예상

---

## 참고자료

- [knip 공식 문서](https://knip.dev/)
- [ESLint 공식 가이드](https://eslint.org/)
- [Prettier 공식 문서](https://prettier.io/)
- [Vitest 문서](https://vitest.dev/)

---

**보고서 작성:** Step 34 knip 자동 분석
**상태:** 완료

