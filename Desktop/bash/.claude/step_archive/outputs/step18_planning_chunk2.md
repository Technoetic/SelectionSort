# Step 18 - 기획 (Planning Chunk 2)
## 상세 구현 가이드 및 참고 사항

작성 날짜: 2026-03-13

---

## 8. 충돌 해결 방식 구현 계획

### 8.1 Chaining 방식 (권장)

**구현 전략**:
```javascript
class HashTable {
  #buckets = new Array(capacity)
    .fill(null)
    .map(() => [])  // 각 버킷은 배열

  insert(key, value) {
    const index = this.#hash(key);
    const bucket = this.#buckets[index];
    
    // 기존 키 업데이트 여부 확인
    const existing = bucket.find(item => item.key === key);
    
    if (existing) {
      existing.value = value;
      return {success: true, index, updated: true};
    } else {
      bucket.push({key, value});
      this.#size++;
      if (this.getLoadFactor() > this.#loadFactorThreshold) {
        this.#rehash();
      }
      return {success: true, index, updated: false};
    }
  }

  search(key) {
    const index = this.#hash(key);
    const bucket = this.#buckets[index];
    const item = bucket.find(item => item.key === key);
    
    return {
      found: !!item,
      value: item?.value,
      index,
      chainLength: bucket.length
    };
  }

  delete(key) {
    const index = this.#hash(key);
    const bucket = this.#buckets[index];
    const idx = bucket.findIndex(item => item.key === key);
    
    if (idx !== -1) {
      bucket.splice(idx, 1);
      this.#size--;
      return {success: true, index};
    }
    return {success: false, index};
  }
}
```

**시각화 대상**: 각 버킷 아래에 체인된 항목들 표시

### 8.2 Open Addressing 방식 (선택사항)

**구현 전략**: Linear Probing 사용
```javascript
class HashTable {
  #buckets = new Array(capacity)  // 각 셀은 {key, value} 또는 null

  insert(key, value) {
    let index = this.#hash(key);
    let attempts = 0;
    
    while (attempts < this.#capacity) {
      if (this.#buckets[index] === null) {
        this.#buckets[index] = {key, value};
        this.#size++;
        // 필요시 리해싱
        return {success: true, index, attempts};
      }
      
      if (this.#buckets[index].key === key) {
        this.#buckets[index].value = value;
        return {success: true, index, attempts, updated: true};
      }
      
      index = (index + 1) % this.#capacity;  // Linear Probing
      attempts++;
    }
    
    return {success: false, error: 'Overflow'};
  }
}
```

**시각화 대상**: 탐사 경로를 화살표로 표시

---

## 9. 해시 함수 구현

### 9.1 심플 해시 함수 (기본)
```javascript
#hash(key) {
  if (typeof key === 'number') {
    return key % this.#capacity;
  }
  
  // 문자열: 각 문자의 charCode 합
  let hash = 0;
  for (let char of String(key)) {
    hash += char.charCodeAt(0);
  }
  return hash % this.#capacity;
}
```

**장점**: 구현 간단
**단점**: 분포가 균등하지 않을 수 있음

### 9.2 고급 해시 함수 (선택사항)
```javascript
#hash(key) {
  const prime = 31;
  const modulo = 1e9 + 7;
  let hash = 0;
  let primePower = 1;

  const str = String(key);
  for (let i = str.length - 1; i >= 0; i--) {
    hash = (hash + (str.charCodeAt(i) - 96) * primePower) % modulo;
    primePower = (primePower * prime) % modulo;
  }

  return Math.abs(hash) % this.#capacity;
}
```

**장점**: 더 균등한 분포
**단점**: 더 느림 (다항식 롤링 해시)

---

## 10. 리해싱 (Resizing) 구현

### 10.1 리해싱 알고리즘
```javascript
#rehash() {
  const oldBuckets = this.#buckets;
  const oldCapacity = this.#capacity;
  
  // 새 용량은 이전의 2배
  this.#capacity = oldCapacity * 2;
  this.#buckets = new Array(this.#capacity)
    .fill(null)
    .map(() => []);  // Chaining인 경우
  
  this.#size = 0;

  // 모든 항목 재해싱
  for (const bucket of oldBuckets) {
    for (const {key, value} of bucket) {
      const newIndex = this.#hash(key);
      this.#buckets[newIndex].push({key, value});
      this.#size++;
    }
  }
  
  // 애니메이션 관리자에 알림
  return {
    oldCapacity,
    newCapacity: this.#capacity,
    entriesMoved: this.#size
  };
}
```

### 10.2 리해싱 트리거
```javascript
// insert() 메서드에서
if (this.getLoadFactor() > this.#loadFactorThreshold) {
  const rehashInfo = this.#rehash();
  // AnimationManager에 리해싱 애니메이션 재생 요청
  return {..., rehashed: true, rehashInfo};
}
```

---

## 11. 애니메이션 구현 가이드

### 11.1 기본 애니메이션 프레임워크
```javascript
class AnimationManager {
  async playInsertAnimation(index, key, value) {
    const startTime = performance.now();
    const duration = this.#duration;

    return new Promise((resolve) => {
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        this.#render(progress, {type: 'insert', index, key, value});

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }
}
```

### 11.2 시각화 기법

**Insert 애니메이션**:
1. 키 입력 강조 (파란색으로 표시)
2. 해시 함수 적용 시뮬레이션 (화살표 이동)
3. 버킷에 항목 추가 (확대/페이드인)
4. 성공 표시 (체크마크)

**Search 애니메이션**:
1. 검색할 키 강조
2. 대상 버킷으로 이동
3. 버킷 내 항목 스캔 (체이닝의 경우 각 항목 하이라이트)
4. 결과 표시 (찾음/못 찾음)

**Delete 애니메이션**:
1. 삭제할 항목 강조
2. 항목 축소 (scale-down)
3. 항목 제거 (페이드아웃)
4. 통계 업데이트

---

## 12. HTML 구조 설계

### 12.1 레이아웃
```html
<div id="container">
  <!-- 헤더 -->
  <header class="header">
    <h1>Hash Table Interactive Tutorial</h1>
    <p class="subtitle">Learn how hash tables work</p>
  </header>

  <!-- 제어 영역 -->
  <div class="control-section">
    <div class="input-group">
      <input id="key-input" type="text" placeholder="Key">
      <input id="value-input" type="text" placeholder="Value">
    </div>
    <div class="button-group">
      <button id="insert-btn">Insert</button>
      <button id="search-btn">Search</button>
      <button id="delete-btn">Delete</button>
      <button id="reset-btn">Reset</button>
    </div>
  </div>

  <!-- 통계 영역 -->
  <div class="stats-section">
    <div class="stat">
      <label>Size:</label>
      <span id="stat-size">0</span>
    </div>
    <div class="stat">
      <label>Capacity:</label>
      <span id="stat-capacity">16</span>
    </div>
    <div class="stat">
      <label>Load Factor:</label>
      <span id="stat-loadfactor">0%</span>
      <div id="loadfactor-bar"></div>
    </div>
  </div>

  <!-- 메시지 영역 -->
  <div id="message-area" class="hidden"></div>

  <!-- 시각화 영역 -->
  <div class="visualization-section">
    <canvas id="hash-table-canvas" width="1000" height="600"></canvas>
  </div>
</div>
```

### 12.2 CSS 클래스

**버킷 스타일**:
```css
.bucket {
  display: inline-block;
  width: 80px;
  height: 80px;
  border: 2px solid #333;
  background-color: #f0f0f0;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
}

.bucket.active {
  background-color: #ffeb3b;
  border-color: #fbc02d;
}

.bucket.collision {
  border-color: #f44336;
  background-color: #ffebee;
}
```

**항목 스타일**:
```css
.item {
  background-color: #2196f3;
  color: white;
  padding: 4px 8px;
  margin: 2px 0;
  border-radius: 3px;
  font-size: 12px;
  word-break: break-all;
}

.item.found {
  background-color: #4caf50;
}
```

---

## 13. 테스트 계획

### 13.1 단위 테스트 (Unit Tests)
```javascript
// HashTable 테스트
- insert(): 새 항목 추가, 기존 키 업데이트
- search(): 존재하는 키, 없는 키
- delete(): 존재하는 키, 없는 키
- getSize(), getCapacity(), getLoadFactor()
- 리해싱: 로드 팩터 초과 시 자동 리해싱

// 충돌 처리 테스트
- Chaining: 여러 항목이 같은 버킷에 들어감
- Open Addressing: Linear Probing 작동
```

### 13.2 통합 테스트 (Integration Tests)
```javascript
// 전체 워크플로우
- Insert → Search → Delete
- 여러 리해싱 발생
- 대량 데이터 삽입 (스트레스 테스트)
```

### 13.3 UI/UX 테스트
```javascript
// 사용자 입력
- 빈 입력 처리
- 특수문자 처리
- 매우 긴 키/값 처리
- 중복 삽입

// 애니메이션
- 애니메이션 재생 속도
- 여러 연산 순차 처리
```

---

## 14. 성능 최적화 항목

### 14.1 DOM 최적화
- DOM 요소 캐싱 (초기화 시 1회만 querySelector)
- 배치 업데이트 (여러 변경사항을 한 번에 반영)

### 14.2 렌더링 최적화
- requestAnimationFrame 사용
- Canvas 이중 버퍼링 (더블 버퍼링)
- 불필요한 리드로우 제거

### 14.3 메모리 최적화
- 큰 테이블 시 메모리 사용량 모니터링
- 애니메이션 큐 크기 제한

---

## 파일 저장 위치
- 기획 청크 2: `/c/Users/Admin/Desktop/bash/.claude/step_archive/outputs/step18_planning_chunk2.md`
