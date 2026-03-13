# Step 16 - API 계약 문서 조사 (Chunk 3)
## 추가 모듈 인터페이스 및 구현 가이드

---

## 12. 튜토리얼 모듈 (TutorialController) 인터페이스 (선택 사항)

### 12.1 역할
- 단계별 학습 가이드 제공
- 각 단계의 목표 설명
- 사용자 진행 상황 추적

### 12.2 메서드 정의
```javascript
// 서명
constructor(steps = [])

// 매개변수
- steps: 튜토리얼 단계 배열
  [
    {
      id: 0,
      title: "삽입 배우기",
      description: "키-값 쌍을 해시테이블에 삽입합니다.",
      targetAction: "insert",
      hints: ["key와 value를 입력하세요", "Insert 버튼을 클릭하세요"]
    },
    ...
  ]

// getCurrentStep() -> Object
// goToStep(index) -> void
// nextStep() -> void
// prevStep() -> void
// completeStep() -> void
// getProgress() -> {current, total, percent}
```

---

## 13. 로깅 및 디버깅 모듈 (선택 사항)

### 13.1 역할
- 모듈 간 상호작용 로깅
- 성능 측정
- 버그 디버깅

### 13.2 인터페이스
```javascript
// Logger 클래스
class Logger {
  log(category, message, data = null) { }
  warn(message) { }
  error(message, exception) { }

  // 성능 측정
  startMeasure(label) { }
  endMeasure(label) { }
  getMetrics() -> Object
}

// 사용 예시
logger.log('HashTable', 'Insert operation', {key, value, index});
logger.log('Animation', 'Start animation', {type: 'insert', duration: 500});
```

---

## 14. 데이터 구조 시각화 명세

### 14.1 HTML 구조 (기본 템플릿)
```html
<div id="hash-table-container">
  <!-- 입력 영역 -->
  <div class="input-section">
    <input id="key-input" type="text" placeholder="Enter key">
    <input id="value-input" type="text" placeholder="Enter value">
    <button id="insert-btn">Insert</button>
    <button id="search-btn">Search</button>
    <button id="delete-btn">Delete</button>
    <button id="reset-btn">Reset</button>
  </div>

  <!-- 통계 영역 -->
  <div class="stats-section">
    <div class="stat">
      <label>Size:</label>
      <span id="stats-size">0</span>
    </div>
    <div class="stat">
      <label>Capacity:</label>
      <span id="stats-capacity">16</span>
    </div>
    <div class="stat">
      <label>Load Factor:</label>
      <span id="stats-loadfactor">0%</span>
      <div id="loadfactor-bar" style="width: 0%"></div>
    </div>
  </div>

  <!-- 메시지 영역 -->
  <div id="message-area" class="hidden"></div>

  <!-- 시각화 영역 -->
  <div class="visualization-section">
    <canvas id="hash-table-canvas" width="800" height="400"></canvas>
    <!-- 또는 -->
    <div id="buckets-container" class="buckets-grid"></div>
  </div>
</div>
```

### 14.2 CSS 클래스 (필수)
```css
/* 버킷 스타일 */
.bucket {
  border: 2px solid #333;
  background-color: #f0f0f0;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  min-height: 50px;
}

.bucket.highlight {
  background-color: #ffeb3b;
  border-color: #fbc02d;
}

.bucket.collision {
  border-color: #f44336;
  background-color: #ffebee;
}

/* 항목 스타일 */
.item {
  background-color: #2196f3;
  color: white;
  padding: 5px 10px;
  margin: 3px 0;
  border-radius: 3px;
  font-size: 12px;
}

.item.found {
  background-color: #4caf50;
}

.item.deleted {
  text-decoration: line-through;
  opacity: 0.5;
}

/* 메시지 스타일 */
.message.success {
  color: #4caf50;
  background-color: #e8f5e9;
}

.message.error {
  color: #f44336;
  background-color: #ffebee;
}
```

---

## 15. 충돌 처리 시각화 상세

### 15.1 Chaining 방식 시각화
```javascript
// 버킷 표현 예시
Bucket[3] -> Item(key1, val1) -> Item(key2, val2) -> Item(key3, val3)

// 화면 표시
┌─────────────────────┐
│ Bucket[3]           │
├─────────────────────┤
│ key1 : val1         │
│   ↓                 │
│ key2 : val2         │
│   ↓                 │
│ key3 : val3         │
└─────────────────────┘
```

### 15.2 Open Addressing 시각화 (Linear Probing)
```javascript
// 시뮬레이션 예시
Insert key5 → hash(key5) = 7 (occupied)
           → try 8 (occupied)
           → try 9 (occupied)
           → try 10 (empty) ✓ Insert here

// 화면 표시
[6] [7] [8] [9] [10] [11]
      ↓   ↓   ↓   ✓
   key3 key4 key5 key5 (inserted)
```

---

## 16. 성능 최적화 가이드

### 16.1 Hash 함수 최적화
```javascript
// 나쁜 예시: O(n) 해싱
hash(key) {
  let sum = 0;
  for (let char of key) {
    sum += char.charCodeAt(0);
  }
  return sum % this.capacity;
}

// 좋은 예시: O(1) 해싱 (다항식 롤링)
hash(key) {
  let hash = 0;
  const p = 31;
  const m = 1e9 + 7;
  let p_pow = 1;

  for (let char of key) {
    hash = (hash + (char.charCodeAt(0) - 96) * p_pow) % m;
    p_pow = (p_pow * p) % m;
  }

  return hash % this.capacity;
}
```

### 16.2 캐싱 전략
```javascript
// DOM 요소 캐싱 (초기화 시 1회)
class UIController {
  constructor() {
    this.elements = {
      keyInput: document.getElementById('key-input'),
      valueInput: document.getElementById('value-input'),
      insertBtn: document.getElementById('insert-btn'),
      // ... 다른 요소들
    };
  }

  // 이후 this.elements.keyInput 사용
}
```

### 16.3 애니메이션 최적화
```javascript
// requestAnimationFrame 사용 (CPU 효율적)
class AnimationManager {
  animate() {
    const startTime = performance.now();

    const frame = (currentTime) => {
      const progress = (currentTime - startTime) / this.duration;

      if (progress < 1) {
        this.render(progress);
        requestAnimationFrame(frame);
      } else {
        this.render(1);
        this.onComplete();
      }
    };

    requestAnimationFrame(frame);
  }
}
```

---

## 17. 접근성 (Accessibility) 고려사항

### 17.1 ARIA 속성
```html
<!-- 입력 필드 레이블 연결 -->
<label for="key-input">Key:</label>
<input id="key-input" aria-describedby="key-help">
<span id="key-help">Enter a unique key</span>

<!-- 버튼 역할 명확화 -->
<button id="insert-btn" aria-label="Insert key-value pair">
  Insert
</button>

<!-- 라이브 영역 (상태 변경 알림) -->
<div id="message-area" role="status" aria-live="polite">
  <!-- 메시지가 여기 표시됨 -->
</div>
```

### 17.2 키보드 네비게이션
```javascript
// Tab 키로 포커스 이동
// Enter 키로 동작 실행

document.getElementById('value-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('insert-btn').click();
  }
});
```

---

## 18. 테스트 인터페이스 정의

### 18.1 HashTable 테스트
```javascript
// 단위 테스트 예시
describe('HashTable', () => {
  let ht;

  beforeEach(() => {
    ht = new HashTable(16);
  });

  it('should insert key-value pair', () => {
    const result = ht.insert('key1', 'value1');
    expect(result).toBe(true);
    expect(ht.search('key1')).toBe('value1');
  });

  it('should return null for non-existent key', () => {
    expect(ht.search('nonexistent')).toBe(null);
  });

  it('should delete key-value pair', () => {
    ht.insert('key1', 'value1');
    const result = ht.delete('key1');
    expect(result).toBe(true);
    expect(ht.search('key1')).toBe(null);
  });

  it('should rehash when load factor exceeds threshold', () => {
    const oldCapacity = ht.getCapacity();
    // 충분한 항목 삽입으로 리해싱 트리거
    for (let i = 0; i < 20; i++) {
      ht.insert(`key${i}`, `value${i}`);
    }
    expect(ht.getCapacity()).toBeGreaterThan(oldCapacity);
  });
});
```

---

## 19. 설정 파일 (Configuration) 구조

### 19.1 기본 설정
```javascript
// config.js
export const HASH_TABLE_CONFIG = {
  initialCapacity: 16,
  loadFactorThreshold: 0.75,
  collisionMethod: 'chaining', // 'chaining' | 'openAddressing'
  probingMethod: 'linear', // 'linear' | 'quadratic' | 'double'
  maxCapacity: 1024,
};

export const ANIMATION_CONFIG = {
  duration: 500, // ms
  easing: 'easeInOutQuad',
  colors: {
    bucket: '#f0f0f0',
    bucketBorder: '#333',
    highlight: '#ffeb3b',
    collision: '#f44336',
    success: '#4caf50',
    error: '#f44336',
  },
};

export const UI_CONFIG = {
  showLoadFactorBar: true,
  showStatistics: true,
  showTutorial: false,
  theme: 'light', // 'light' | 'dark'
};
```

---

## 20. 참고 자료 및 출처

### 20.1 GitHub 저장소 (연구 결과)
1. **LinearHashing** (rabinadk1)
   - URL: https://github.com/rabinadk1/LinearHashing
   - 특징: Linear Probing을 이용한 해시테이블 시각화
   - 라이브러리: p5.js

2. **hash-table-visualizer** (mrexcelgodsown)
   - URL: https://github.com/mrexcelgodsown/hash-table-visualizer
   - 특징: Chaining 방식 충돌 해결, Tailwind CSS 사용
   - 상태: 활발한 개발 (2025-10)

3. **big-o-performance-java** (rramatchandran)
   - URL: https://github.com/rramatchandran/big-o-performance-java
   - 특징: Big-O 성능 비교 시각화
   - 라이브러리: React

### 20.2 이론 자료
- Wikipedia: Hash table
  - 발명 역사 (1953: Hans Peter Luhn)
  - 시간 복잡도 분석
  - 로드 팩터 개념
  - 충돌 해결 전략

---

## 파일 저장 위치 및 참고자료

**조사 결과 저장 위치**:
- Chunk 1: `/c/Users/Admin/Desktop/bash/.claude/step_archive/outputs/step16_조사결과_chunk1.md`
- Chunk 2: `/c/Users/Admin/Desktop/bash/.claude/step_archive/outputs/step16_조사결과_chunk2.md`
- Chunk 3: `/c/Users/Admin/Desktop/bash/.claude/step_archive/outputs/step16_조사결과_chunk3.md`

**데이터 원본**:
- GitHub API 검색 결과 1: `/c/Users/Admin/Desktop/bash/.claude/research-raw-api-1.json`
- GitHub API 검색 결과 2: `/c/Users/Admin/Desktop/bash/.claude/research-raw-api-2.json`
- Wikipedia 해시테이블: `/c/Users/Admin/Desktop/bash/.claude/research-raw-hashtable.txt`

**종료 시점**: 2026-03-13 22:52 UTC+9
