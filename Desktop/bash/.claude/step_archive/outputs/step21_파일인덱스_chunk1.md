# Step 21 - 구현 파일 인덱싱 및 서브에이전트 배정 (Chunk 1/2)

## 프로젝트 구조 및 파일 목록

### 현재 프로젝트 구조
```
/c/Users/Admin/Desktop/bash/
├── src/
│   ├── classes/              # 비즈니스 로직 클래스 (신규)
│   │   ├── HashTable.js
│   │   ├── ViewRenderer.js
│   │   ├── AnimationManager.js
│   │   └── UIController.js
│   ├── components/           # React 컴포넌트 (신규)
│   │   ├── HashTableVisualizer.jsx
│   │   ├── ControlPanel.jsx
│   │   ├── StatisticsPanel.jsx
│   │   └── Canvas.jsx
│   ├── hooks/                # Custom React hooks (신규)
│   │   ├── useHashTable.js
│   │   └── useAnimation.js
│   ├── utils/                # 유틸리티 함수 (신규)
│   │   └── constants.js
│   ├── styles/
│   │   ├── index.css
│   │   └── App.css
│   ├── main.jsx              (기존)
│   ├── App.jsx               (기존)
│   └── js/                   (기존 - 향후 마이그레이션)
│       ├── HashTable.js      (기존 - 참고용)
│       └── ...
├── index.html                (신규)
├── package.json              (수정)
├── vite.config.js            (신규)
├── tailwind.config.js        (신규)
├── postcss.config.js         (신규)
├── tsconfig.json             (신규)
└── eslint.config.js          (신규)
```

---

## 구현 파일별 상세 계획

### Phase 1: 핵심 로직 구현 (Classes)

#### 1.1 src/utils/constants.js (신규) - 약 50줄
**용도**: 전역 상수 정의
**내용**:
- DEFAULT_CAPACITY = 16
- DEFAULT_LOAD_FACTOR_THRESHOLD = 0.75
- ANIMATION_DURATION = 600
- COLORS 객체
- MAX_MESSAGE_DURATION = 3000

**담당**: 서브에이전트 1
**우선순위**: 1 (최우선 - 다른 파일에서 참조)
**상태**: 신규 작성

---

#### 1.2 src/classes/HashTable.js (신규 또는 기존 마이그레이션) - 약 150줄
**용도**: 해시테이블 핵심 구현
**메서드**:
- constructor(capacity, loadFactorThreshold)
- insert(key, value)
- search(key)
- delete(key)
- getSize() / getCapacity() / getLoadFactor()
- getAllEntries() / getBucket(index)
- clear()
- #hash(key) - private
- #rehash() - private

**반환값**: 각 연산은 성공/실패, 인덱스, 체인 길이 등 포함
**담당**: 서브에이전트 1
**우선순위**: 2
**상태**: 기존 src/js/HashTable.js 참고 후 마이그레이션

---

#### 1.3 src/classes/ViewRenderer.js (신규) - 약 200줄
**용도**: Canvas 렌더링 + DOM 통계 업데이트
**메서드**:
- constructor(canvasElement)
- renderBuckets(buckets, highlightIndex)
- updateStats(size, capacity, loadFactor)
- displayMessage(message, type, duration)
- displaySearchResult(found, value)
- reset()
- #drawBucket(x, y, items, isHighlighted)
- #drawItem(x, y, key, value)
- #updateLoadFactorBar(loadFactor)

**담당**: 서브에이전트 2
**우선순위**: 3
**상태**: 신규 작성

---

#### 1.4 src/classes/AnimationManager.js (신규) - 약 150줄
**용도**: GSAP 기반 애니메이션 관리
**메서드**:
- constructor(config)
- playInsertAnimation(index, key, value)
- playSearchAnimation(index, found)
- playDeleteAnimation(index, key)
- setSpeed(speed)
- #createTimeline(duration)
- #highlightBucketAnimation(index, duration)

**라이브러리**: GSAP 3.12.5
**담당**: 서브에이전트 2
**우선순위**: 4
**상태**: 신규 작성

---

#### 1.5 src/classes/UIController.js (신규) - 약 180줄
**용도**: 이벤트 처리 및 모듈 간 조율
**메서드**:
- constructor(hashTable, animationManager, viewRenderer)
- handleInsert(key, value)
- handleSearch(key)
- handleDelete(key)
- handleReset()
- handleSpeedChange(speed)
- #validateInput(input)
- #updateUI(result)

**담당**: 서브에이전트 3
**우선순위**: 5
**상태**: 신규 작성

---

## 의존성 해결 순서

```
constants.js (1번)
  ↑
  ├─ HashTable.js (2번)
  │   ├─ AnimationManager.js (3번)
  │   └─ UIController.js (4번)
  │
  ├─ ViewRenderer.js (2번)
  │
  ├─ useHashTable.js (5번)
  │   └─ ControlPanel.jsx (6번)
  │
  └─ StatisticsPanel.jsx (6번)
       ↓
    HashTableVisualizer.jsx (7번)
```

---

## 서브에이전트 배정 (병렬 실행)

| 에이전트 | 담당 파일 | 우선순위 | 예상 시간 |
|---------|---------|--------|---------|
| Sub-Agent-1 | constants.js, HashTable.js | 1, 2 | 30분 |
| Sub-Agent-2 | ViewRenderer.js, AnimationManager.js | 3, 4 | 45분 |
| Sub-Agent-3 | UIController.js, useHashTable.js | 5, 6 | 45분 |

**총 예상 시간**: 약 45분 (병렬 실행 기준)

---

**문서 작성**: 2026-03-13
**대상 팀 규모**: 1-3 서브에이전트 (병렬)
**구현 방식**: Class-first 아키텍처 → React Hook 래핑
