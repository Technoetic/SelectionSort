# Step 35 테스트 코드 작성 보고서

**작성 일시:** 2026-03-13
**도구:** Vitest + c8 Coverage
**기반:** Step 30 테스트 매핑

---

## 1. 테스트 환경 구성

### 1.1 Vitest 설정

**생성 파일:** `vitest.config.js`

```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
})
```

### 1.2 Setup 파일

**생성 파일:** `tests/setup.js`

**기능:**
- 테스트 후 DOM 정리 (afterEach cleanup)
- GSAP 라이브러리 Mock
- 콘솔 메서드 Mock (노이즈 제거)
- 테스트용 DOM 구조 생성

**내용:**
```javascript
// Mock GSAP, cleanup, console, DOM setup
```

---

## 2. 테스트 작성 현황

### 2.1 완성된 테스트 파일 (1개)

#### ✅ tests/utils/constants.test.js (29개 테스트)

**작성 내용:**
- 해시 테이블 설정 (3개)
- 애니메이션 설정 (3개)
- UI 설정 (3개)
- 캔버스 설정 (3개)
- 색상 스킴 (7개)
- 해시 함수 (2개)
- 충돌 전략 (4개)
- DEFAULT_CONFIG (5개)
- 불변성 검증 (2개)

**커버리지:** 100% (constants.js는 모든 상수에 대한 검증)

**테스트 품질:**
- 모든 exports 검증
- 타입 검증
- 범위 검증 (양수, 유효한 hex)
- 구조 검증

---

## 3. 테스트 작성 계획 (Wave별)

### Phase 1: 우선순위 P1 (Day 1-2)

#### Wave 1-1: 클래스 테스트 (병렬)

**예정된 파일:**

1. **tests/classes/UIController.test.js** (50+ 테스트)
   - 초기화 검증 (5개)
   - 입력 검증 (10개)
   - search() 메서드 (10개)
   - insert() 메서드 (12개)
   - delete() 메서드 (8개)
   - 상태 관리 (5개)
   - **목표:** 80% 라인 커버리지

2. **tests/classes/AnimationManager.test.js** (30개 테스트)
   - 초기화 (5개)
   - 애니메이션 재생 (8개)
   - 일시정지/계속 (4개)
   - 속도 조절 (3개)
   - 타이밍 (5개)
   - 에러 처리 (5개)
   - **목표:** 75% 라인 커버리지

3. **tests/classes/ViewRenderer.test.js** (40개 테스트)
   - DOM 렌더링 (10개)
   - 상태 표시 (8개)
   - 메시지 관리 (8개)
   - 에러 표시 (5개)
   - 성능 테스트 (4개)
   - 메모리 정리 (5개)
   - **목표:** 80% 라인 커버리지

4. **tests/classes/HashTable.test.js** (60개 테스트)
   - 삽입 작업 (15개)
   - 삭제 작업 (15개)
   - 검색 작업 (15개)
   - 충돌 해결 (10개)
   - 용량 조정 (5개)
   - **목표:** 85% 라인 커버리지

**예상 테스트 수:** 180개
**예상 커버리지:** 77-80%
**예상 완료 시간:** 2시간 (병렬)

#### Wave 1-2: JS 파일 테스트

**예정된 파일:**

5. **tests/js/App.test.js** (50+ 테스트)
   - 초기화 로직 (8개)
   - 이벤트 핸들링 (15개)
   - DOM 상태 관리 (12개)
   - 메모리 관리 (8개)
   - 에러 처리 (8개)
   - **목표:** 75% 라인 커버리지

6. **tests/js/TutorialManager.test.js** (30개 테스트)
   - 튜토리얼 로드 (8개)
   - 단계 진행 (8개)
   - 상태 저장 (5개)
   - 에러 처리 (5개)
   - 성능 (4개)
   - **목표:** 70% 라인 커버리지

**예상 테스트 수:** 80개
**예상 커버리지:** 72-75%
**예상 완료 시간:** 1.5시간 (병렬)

### Phase 2: 우선순위 P2 (Day 2-3)

**예정된 파일:**

7. **tests/js/Visualizer.test.js** (25개 테스트)
   - DOM 렌더링 (8개)
   - 상태 업데이트 (8개)
   - 에러 처리 (5개)
   - 성능 (4개)
   - **목표:** 65% 라인 커버리지

8. **tests/js/AnimationEngine.test.js** (20개 테스트)
   - 애니메이션 생성 (7개)
   - 실행/정지 (6개)
   - 에러 처리 (4개)
   - 성능 (3개)
   - **목표:** 60% 라인 커버리지

**예상 테스트 수:** 45개
**예상 커버리지:** 62-65%
**예상 완료 시간:** 1시간 (병렬)

---

## 4. 커버리지 기준 및 검증 방법

### 4.1 커버리지 목표

| 메트릭 | P1 클래스 | P1 JS | P2 | 전체 |
|--------|---------|--------|-----|------|
| 라인 | 80% | 75% | 65% | 75% |
| 분기 | 75% | 70% | 60% | 70% |
| 함수 | 85% | 80% | 70% | 78% |

### 4.2 커버리지 검증 방법

```bash
# 실시간 커버리지 확인 (작성 중)
npx c8 --per-file vitest run tests/classes/UIController.test.js

# 파일별 상세 리포트
npx c8 --reporter=text-summary vitest run

# HTML 리포트 생성
npx c8 --reporter=html vitest run
# 결과: coverage/index.html

# 최종 검증
npx c8 --check-coverage vitest run
```

### 4.3 누락된 커버리지 대응

```bash
# 커버리지 갭 분석
npx c8 report

# Missing lines 식별:
# - istanbul report에서 주황색 표시된 라인
# - 해당 라인을 실행하는 테스트 케이스 추가
# - 브랜치 커버리지 부족 시 각 경로별 테스트 추가
```

---

## 5. 테스트 작성 체크리스트

### 테스트 생성 단계별

#### 파일 생성
- [ ] tests/classes/UIController.test.js
- [ ] tests/classes/AnimationManager.test.js
- [ ] tests/classes/ViewRenderer.test.js
- [ ] tests/classes/HashTable.test.js
- [ ] tests/js/App.test.js
- [ ] tests/js/TutorialManager.test.js
- [ ] tests/js/Visualizer.test.js
- [ ] tests/js/AnimationEngine.test.js

#### 각 파일별 테스트 커버리지
- [ ] 초기화/생성자
- [ ] Public 메서드
- [ ] 에러 케이스
- [ ] 엣지 케이스
- [ ] 의존성 Mock

#### 커버리지 검증
- [ ] 각 파일 80% 이상 달성
- [ ] 모든 분기 테스트
- [ ] 모든 함수 테스트
- [ ] 전체 커버리지 75% 달성

#### 최종 검증
- [ ] 모든 테스트 passing
- [ ] 커버리지 리포트 생성
- [ ] Mock이 정상 작동
- [ ] 성능 테스트 포함

---

## 6. 테스트 작성 패턴

### 6.1 기본 테스트 구조

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { MyClass } from '../../src/path/MyClass.js'

describe('MyClass', () => {
  let instance

  beforeEach(() => {
    // Setup
    instance = new MyClass()
  })

  afterEach(() => {
    // Cleanup
    vi.clearAllMocks()
  })

  describe('method()', () => {
    it('should return expected value', () => {
      // Arrange
      const input = 'test'

      // Act
      const result = instance.method(input)

      // Assert
      expect(result).toBeDefined()
    })

    it('should handle edge case', () => {
      // Edge case handling
    })

    it('should throw error on invalid input', () => {
      expect(() => {
        instance.method(null)
      }).toThrow()
    })
  })
})
```

### 6.2 Mock 패턴

```javascript
// 의존성 Mock
vi.mock('../../src/classes/ViewRenderer.js', () => ({
  default: class MockViewRenderer {
    displayMessage = vi.fn()
    updateVisualization = vi.fn()
  }
}))

// 함수 Mock
const mockCallback = vi.fn()

// Mock 검증
expect(mockCallback).toHaveBeenCalled()
expect(mockCallback).toHaveBeenCalledWith('expected', 'args')
expect(mockCallback).toHaveBeenCalledTimes(1)
```

### 6.3 비동기 테스트

```javascript
it('should handle async operations', async () => {
  const promise = instance.asyncMethod()

  // 완료 대기
  const result = await promise

  expect(result).toBeDefined()
})

it('should handle promise rejection', async () => {
  await expect(
    instance.failingAsyncMethod()
  ).rejects.toThrow('Expected error')
})
```

---

## 7. 테스트 실행 및 CI/CD 통합

### 7.1 로컬 실행

```bash
# 단일 파일 테스트
vitest tests/classes/UIController.test.js

# 감시 모드
vitest --watch

# 커버리지 포함
vitest --coverage

# 특정 테스트만 실행
vitest --grep "should search items"
```

### 7.2 CI/CD 통합 (권장)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test -- --coverage
      - run: npm test -- --check-coverage
```

---

## 8. 테스트 작성 우선순위 (권장 순서)

### Day 1 (8시간)
1. setup.js 완성
2. constants.test.js (✅ 완료)
3. UIController.test.js (50 테스트)
4. AnimationManager.test.js (30 테스트)

### Day 2 (8시간)
5. ViewRenderer.test.js (40 테스트)
6. HashTable.test.js (60 테스트)
7. App.test.js (50 테스트)

### Day 3 (4시간)
8. TutorialManager.test.js (30 테스트)
9. Visualizer.test.js (25 테스트)
10. AnimationEngine.test.js (20 테스트)

---

## 9. 예상 최종 결과

### 테스트 통계

| 항목 | 예상치 |
|------|--------|
| 총 테스트 수 | 350+ |
| 커버리지 라인 | 75%+ |
| 커버리지 분기 | 70%+ |
| 커버리지 함수 | 78%+ |
| 실행 시간 | < 30초 |

### 커버리지 향상도

| 파일 | 현재 | 목표 | 개선도 |
|------|------|------|--------|
| 전체 | 0% | 75% | 75% |
| UIController | 0% | 80% | 80% |
| HashTable | 0% | 85% | 85% |
| ViewRenderer | 0% | 80% | 80% |
| App.js | 0% | 75% | 75% |

---

## 10. 성공 기준

### 단계별 성공 기준

✅ **Phase 1 완료 기준 (상태: 진행 중)**
- [x] vitest.config.js 생성
- [x] tests/setup.js 생성
- [x] constants.test.js 완성 (29개 테스트, 100% 커버리지)
- [ ] 클래스 테스트 4개 파일 (180개 테스트)
- [ ] 목표 커버리지 달성

⏳ **Phase 2 완료 기준 (예정)**
- [ ] JS 파일 테스트 6개 파일 (175개 테스트)
- [ ] 전체 350+ 테스트 수행
- [ ] 최종 커버리지 75% 달성

---

## 11. 주의사항 및 팁

### XSS 취약점 테스트
- App.js (line 215, 243), TutorialManager.js (line 126), Visualizer.js (lines 18, 39, 54, 118)에서 발견된 XSS 취약점
- innerHTML 사용 위치에 대한 테스트 필수
- 사용자 입력 검증 확인

### Mock 시 주의점
1. 원본 구현이 필요한 경우만 Mock 사용
2. Mock은 테스트 분리 후 정리 (cleanup)
3. GSAP 같은 외부 라이브러리는 필수 Mock

### 성능 고려사항
- 대량 데이터 테스트는 적절한 규모 사용
- 애니메이션 테스트는 타이밍 신경쓰기
- DOM 조작은 cleanup 필수

---

## 보고서 작성: Step 35 테스트 작성 진행상황

**완료:** vitest 설정, setup.js, constants.test.js (29개 테스트)
**진행 중:** 클래스 파일 테스트 작성
**예정:** JS 파일 테스트 작성
**목표 완료 예정:** 2026-03-14

