# Step 33 코드 리뷰 보고서 - jscpd 코드 중복 분석

**분석 일시:** 2026-03-13
**도구:** jscpd (Copy-Paste Detector)
**분석 대상:** src/ 디렉토리
**임계값:** 5% 이상 중복 블록

---

## 전체 중복 분석 결과

| 메트릭 | 결과 |
|--------|------|
| **발견된 클론 수** | **3개** |
| **중복된 라인** | 49줄 (전체 대비 1.43%) |
| **중복된 토큰** | 296개 (전체 대비 1.27%) |
| **분석된 파일** | 21개 |
| **분석된 라인** | 3,420줄 |

### 평가
- ✅ **전체 중복 비율이 1.43%로 매우 낮음** - 우수한 코드 품질
- ✅ **3개의 작은 클론만 발견** - 중복 리팩토링 필요도 낮음
- ✅ CSS/JSX/HTML 파일에서 중복 없음
- ⚠️ JavaScript 파일 2개(UIController.js, AnimationManager.js)에서만 중복 발견

---

## 언어별 중복 분석

### JavaScript (12개 파일)
- **파일 수:** 12개
- **총 라인:** 2,030줄
- **총 토큰:** 15,006개
- **발견된 클론:** 3개
- **중복된 라인:** 49줄 (2.41%)
- **중복된 토큰:** 296개 (1.97%)

**분석:** 약간의 중복이 있지만 전반적으로 양호함

### CSS (6개 파일)
- **파일 수:** 6개
- **총 라인:** 1,282줄
- **발견된 클론:** 0개
- **중복된 라인:** 0줄 (0%)

**분석:** ✅ 완벽한 상태 - 중복 없음

### JSX (2개 파일)
- **파일 수:** 2개
- **총 라인:** 23줄
- **발견된 클론:** 0개

**분석:** ✅ 완벽한 상태 - 중복 없음

### Markup/HTML (1개 파일)
- **파일 수:** 1개
- **총 라인:** 85줄
- **발견된 클론:** 0개

**분석:** ✅ 완벽한 상태 - 중복 없음

---

## 클론 상세 분석

### Clone #1: UIController.js의 중복된 메서드 (33% 중복)

**위치:**
- 첫 번째: `src/classes/UIController.js` 라인 79-100 (22줄)
- 두 번째: `src/classes/UIController.js` 라인 19-40 (22줄)

**중복 코드:**
```javascript
) {
  if (this.isAnimating) {
    this.viewRenderer.displayMessage(
      'Animation in progress',
      MESSAGE_TYPES.WARNING
    )
    return
  }

  // Validate input
  if (!this.#validateInput(key)) {
    this.viewRenderer.displayMessage(
      'Invalid key',
      MESSAGE_TYPES.ERROR
    )
    return
  }

  this.isAnimating = true

  try {
    // Perform search/deletion...
```

**분석:**
- **원인:** 유사한 메서드들의 초기 검증 로직이 동일
- **패턴:** 애니메이션 상태 확인 → 입력 검증 → 에러 처리
- **파일 통계:**
  - 파일 크기: 254줄
  - 중복 라인: 84줄
  - 중복률: **33.07%** ⚠️ 높음

**개선 방안:**
```javascript
// 공통 검증 로직을 메서드로 추출
#performActionWithValidation(key, action) {
  // 1. 애니메이션 상태 확인
  if (this.isAnimating) {
    this.viewRenderer.displayMessage(
      'Animation in progress',
      MESSAGE_TYPES.WARNING
    )
    return false
  }

  // 2. 입력 검증
  if (!this.#validateInput(key)) {
    this.viewRenderer.displayMessage(
      'Invalid key',
      MESSAGE_TYPES.ERROR
    )
    return false
  }

  // 3. 액션 수행
  this.isAnimating = true
  try {
    return action(key)
  } catch (error) {
    this.viewRenderer.displayMessage(
      error.message,
      MESSAGE_TYPES.ERROR
    )
    return false
  }
}

// 사용
search(key) {
  return this.#performActionWithValidation(key, (k) => {
    // Perform search
  })
}

delete(key) {
  return this.#performActionWithValidation(key, (k) => {
    // Perform deletion
  })
}
```

---

### Clone #2: UIController.js의 또 다른 중복 (같은 패턴)

**위치:**
- 첫 번째: `src/classes/UIController.js` 라인 129-150 (22줄)
- 두 번째: `src/classes/UIController.js` 라인 79-40 (비교 대상)

**특징:** Clone #1과 동일한 패턴의 반복

**영향:** UIController.js 내 높은 중복도로 인한 유지보수 어려움

---

### Clone #3: AnimationManager.js의 중복 (5.53% 중복)

**위치:**
- 첫 번째: `src/classes/AnimationManager.js` 라인 113-120 (8줄)
- 두 번째: `src/classes/AnimationManager.js` 라인 76-83 (8줄)

**중복 코드:**
```javascript
${Date.now()}`
const duration = this.duration / this.speed

return new Promise((resolve) => {
  const tl = gsap.timeline({
    onComplete: () => {
      this.activeAnimations.delete(animationId)
      resolve({ success: true }
```

**분석:**
- **원인:** 유사한 애니메이션 처리 로직
- **파일 통계:**
  - 파일 크기: 253줄
  - 중복 라인: 14줄
  - 중복률: **5.53%** ⚠️ 임계값 근처

**개선 방안:**
```javascript
// 공통 애니메이션 초기화 로직 추출
#createAnimationTimeline(animationId) {
  const duration = this.duration / this.speed

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        this.activeAnimations.delete(animationId)
        resolve({ success: true })
      }
    })
    return tl
  })
}
```

---

## 리팩토링 우선순위

| 파일 | 중복률 | 중복 라인 | 우선순위 | 난이도 |
|------|--------|---------|---------|--------|
| UIController.js | 33.07% | 84줄 | 🔴 높음 | 중간 |
| AnimationManager.js | 5.53% | 14줄 | 🟡 중간 | 낮음 |

---

## 개선 계획

### Phase 1: UIController.js 리팩토링 (1주)

**목표:** 33% 중복 제거, 20% 이상 라인 수 감소

**작업 항목:**
1. 공통 검증 메서드 `#performActionWithValidation()` 생성
2. 중복된 3개 메서드(search, insert, delete) 통합
3. 에러 처리 로직 중앙화
4. 테스트 코드 작성 및 검증

**예상 결과:**
- 중복률 33% → 0%로 감소
- 코드 라인 수 254줄 → 180줄로 감소 (약 29% 감소)
- 유지보수성 대폭 개선

### Phase 2: AnimationManager.js 리팩토링 (1주)

**목표:** 5.5% 중복 제거

**작업 항목:**
1. 애니메이션 타임라인 생성 메서드 추출
2. 중복 코드 통합
3. 애니메이션 로직 테스트

**예상 결과:**
- 중복률 5.5% → 0%로 감소
- 애니메이션 로직 단순화

### Phase 3: 자동화 및 모니터링 (지속)

**작업 항목:**
1. pre-commit hook에 jscpd 통합
2. CI/CD 파이프라인에 중복 검사 추가
3. PR 체크리스트에 중복 검사 포함

---

## 코드 품질 평가

| 항목 | 등급 | 설명 |
|------|------|------|
| 중복도 (Duplication) | B+ | 전체 1.43% - 우수, 특정 파일만 개선 필요 |
| 리팩토링 위험도 | 낮음 | 중복 제거 시 부작용 최소 |
| 개선 효과 | 높음 | UIController.js 개선 시 33% 감소 가능 |

---

## 체크리스트

### UIController.js 개선
- [ ] 공통 검증 메서드 구현
- [ ] search/insert/delete 메서드 통합
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 실행
- [ ] jscpd 재검사 (0% 달성 확인)

### AnimationManager.js 개선
- [ ] 애니메이션 타임라인 생성 메서드 추출
- [ ] 단위 테스트 작성
- [ ] jscpd 재검사

### 자동화
- [ ] pre-commit hook 설정
- [ ] CI/CD 통합
- [ ] 개발팀 교육

---

## 참고자료

- [jscpd 공식 문서](https://github.com/kucherenko/jscpd)
- [DRY 원칙 (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- [리팩토링: 기존 코드 개선하기](https://refactoring.guru/)

---

**보고서 작성:** Step 33 jscpd 자동 분석
**상태:** 완료
