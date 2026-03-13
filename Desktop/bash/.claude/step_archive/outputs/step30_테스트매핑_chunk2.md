# Step 30 - 테스트 매핑 (사용자 요청 기준)

## 핵심 테스트 매핑 테이블

| 소스 파일 | 테스트 파일 | 테스트 유형 | 우선순위 | 설명 |
|-----------|------------|------------|---------|------|
| src/js/HashTable.js | tests/HashTable.test.js | 단위 테스트 | P0 | 해시테이블 자료구조 핵심 알고리즘 |
| src/js/ContactBook.js | tests/ContactBook.test.js | 단위 테스트 | P0 | 전화번호부 비즈니스 로직 |
| src/js/AnimationEngine.js | tests/AnimationEngine.test.js | 단위 테스트 | P1 | 애니메이션 엔진 (DOM Mock 필요) |
| src/js/TutorialManager.js | tests/TutorialManager.test.js | 단위 테스트 | P1 | 튜토리얼 상태 관리 |
| src/js/Visualizer.js + src/js/App.js | tests/e2e.test.js | E2E 테스트 | P2 | DOM 의존성 (Playwright 사용) |

## 파일별 테스트 전략

### 1. HashTable.js 테스트
**목표**: 해시 함수 알고리즘 및 충돌 처리 검증

**테스트 케이스**:
- 초기화 (다양한 크기)
- 해싱 함수 (키 → 인덱스)
- 삽입 (정상, 중복, 충돌)
- 검색 (존재, 불존재, 다중 결과)
- 삭제 (일반, 마지막, 첫번째)
- 충돌 해결 (체이닝 확인)
- 경계값 (빈 테이블, 가득 찬 테이블)

**예상 테스트 수**: 30-40개

### 2. ContactBook.js 테스트
**목표**: 전화번호부 CRUD 및 입력 검증

**테스트 케이스**:
- 연락처 추가 (정상, 중복, 빈 값)
- 연락처 검색 (존재, 불존재, 부분 일치)
- 연락처 삭제 (정상, 존재하지 않음)
- 모든 연락처 조회
- 통계 정보 (로드팩터, 충돌 수)
- 입력 검증 (null, undefined, 특수문자)

**예상 테스트 수**: 20-30개

### 3. AnimationEngine.js 테스트
**목표**: Web Animation API 래퍼 기능 검증

**테스트 케이스**:
- 애니메이션 속도 조절 (setSpeed, getSpeed)
- 페이드 인/아웃 (DOM Mock 필요)
- 슬라이드 인/아웃
- 하이라이트 효과
- 애니메이션 큐 관리
- 에러 핸들링

**Mock 필요**: DOM 요소, Element.animate() 메서드

**예상 테스트 수**: 20-25개

### 4. TutorialManager.js 테스트
**목표**: 튜토리얼 단계 네비게이션 및 상태 관리

**테스트 케이스**:
- 튜토리얼 단계 로드 (13개 단계)
- 다음 단계 이동
- 이전 단계 이동
- 특정 단계로 이동
- 현재 단계 조회
- 단계 변경 이벤트 콜백
- 렌더링 상태 확인

**예상 테스트 수**: 20-25개

### 5. E2E 테스트 (Visualizer.js + App.js)
**목표**: DOM 렌더링 및 사용자 상호작용 검증

**테스트 케이스**:
- 애플리케이션 로드 및 초기화
- DOM 요소 렌더링 (버킷 배열, 통계)
- 연락처 추가 통합 테스트 (화면 반영)
- 연락처 검색 통합 테스트
- 연락처 삭제 통합 테스트
- 애니메이션 재생 확인
- 튜토리얼 네비게이션 (DOM)
- 접근성 감사 (axe-core)
- 성능 측정 (Lighthouse)

**사용 도구**: Playwright, axe-core, Lighthouse CI

**예상 테스트 수**: 15-20개

## 테스트 환경 구성

### 프레임워크 스택
```
단위 테스트: Vitest (Jest 호환)
Mock: vitest/test-mocks, Happy DOM/jsdom
E2E: Playwright (이미 설치)
접근성: @axe-core/playwright (이미 설치)
성능: Lighthouse CI (이미 설치)
커버리지: c8 (v11.0.0, 이미 설치)
```

### 디렉토리 구조
```
tests/
├── HashTable.test.js        (30-40개 케이스)
├── ContactBook.test.js      (20-30개 케이스)
├── AnimationEngine.test.js  (20-25개 케이스)
├── TutorialManager.test.js  (20-25개 케이스)
├── e2e.test.js              (15-20개 케이스)
└── setup.js                 (공통 설정)
```

## 커버리지 목표

| 파일 | 라인 커버리지 | 분기 커버리지 | 함수 커버리지 |
|------|------------|------------|------------|
| HashTable.js | 90% | 85% | 90% |
| ContactBook.js | 85% | 80% | 85% |
| AnimationEngine.js | 75% | 70% | 75% |
| TutorialManager.js | 80% | 75% | 80% |
| 전체 평균 | 82% | 77% | 82% |

## 실행 계획

### Phase 1: 단위 테스트 설정
- Vitest 설정 파일 작성
- Mock 환경 구성
- 테스트 기본 틀 작성

### Phase 2: 코어 테스트 작성
- HashTable.js 테스트 (30-40개)
- ContactBook.js 테스트 (20-30개)

### Phase 3: 보조 테스트 작성
- AnimationEngine.js 테스트 (20-25개)
- TutorialManager.js 테스트 (20-25개)

### Phase 4: E2E 테스트 작성
- Playwright 스크립트 작성 (15-20개)
- 접근성 감사 (axe-core)
- 성능 측정 (Lighthouse)

### Phase 5: 검증 및 최적화
- 커버리지 측정
- 취약점 분석
- 성능 최적화

---

**생성 시각**: 2026-03-13 23:05:00
**소스**: 프로젝트 자동 분석
**상태**: 매핑 계획 완료
