# Step 16 - API 계약 문서 조사 (Chunk 2)
## UI 컨트롤러, 애니메이션 모듈, 이벤트 핸들러 인터페이스

---

## 6. UI 컨트롤러 (Controller/UIManager) 인터페이스

### 6.1 역할
- 사용자 입력 수집
- HashTable 클래스 메서드 호출
- 애니메이션 모듈에 시각화 요청
- 이벤트 발생 및 상태 관리

### 6.2 생성자 및 초기화
```javascript
// 서명
constructor(hashTableInstance, animationManager, viewRenderer)

// 매개변수
- hashTableInstance: HashTable 클래스 인스턴스
- animationManager: 애니메이션 관리 모듈
- viewRenderer: DOM 업데이트를 담당하는 렌더러

// 책임
- DOM 요소 선택자 캐싱
- 이벤트 리스너 등록
- 초기 상태 설정
```

### 6.3 메서드: handleInsert(key, value)
```javascript
// 서명
handleInsert(key, value) -> void

// 기능
- 사용자 입력으로부터 key와 value 수집
- HashTable.insert() 호출
- 성공 여부에 따라 애니메이션 재생
- UI 업데이트 (로드 팩터, 항목 수 등)

// 수행 단계
1. 입력 검증 (key, value 공백 확인)
2. HashTable.insert() 호출
3. AnimationManager.playInsertAnimation(index, key, value) 호출
4. ViewRenderer.updateStats() 호출
5. 성공/실패 메시지 표시

// 오류 처리
- 입력 검증 실패: UI에 에러 메시지 표시
- HashTable 오류: console.error() 및 사용자 알림
```

### 6.4 메서드: handleSearch(key)
```javascript
// 서명
handleSearch(key) -> void

// 기능
- 사용자 입력으로부터 key 수집
- HashTable.search() 호출
- 검색 애니메이션 재생
- 결과를 UI에 표시

// 수행 단계
1. 입력 검증
2. HashTable.search() 호출
3. AnimationManager.playSearchAnimation(index, found) 호출
4. ViewRenderer.displaySearchResult(found, value) 호출
```

### 6.5 메서드: handleDelete(key)
```javascript
// 서명
handleDelete(key) -> void

// 기능
- 사용자 입력으로부터 key 수집
- HashTable.delete() 호출
- 삭제 애니메이션 재생
- UI 업데이트

// 수행 단계
1. 입력 검증
2. HashTable.delete() 호출
3. AnimationManager.playDeleteAnimation(index, key) 호출
4. ViewRenderer.updateStats() 호출
```

### 6.6 메서드: handleRehash()
```javascript
// 서명
handleRehash() -> void

// 기능
- 리해싱 프로세스 애니메이션화
- 기존 버킷들을 새 버킷으로 재배치하는 과정 시각화

// 구현 힌트
- 단계적으로 각 항목을 재해싱
- 각 단계마다 애니메이션 재생
- 완료 후 최종 상태 렌더링
```

### 6.7 메서드: reset()
```javascript
// 서명
reset() -> void

// 기능
- 해시테이블 및 UI를 초기 상태로 리셋

// 수행 단계
1. HashTable.clear() 호출
2. ViewRenderer.reset() 호출
3. 입력 필드 초기화
4. 애니메이션 상태 초기화
```

---

## 7. 애니메이션 모듈 (AnimationManager) 인터페이스

### 7.1 역할
- 데이터 구조 변화를 시각적으로 표현
- 부드러운 애니메이션 재생
- 사용자의 이해를 돕는 시각적 피드백 제공

### 7.2 생성자
```javascript
// 서명
constructor(canvasElement, options = {})

// 매개변수
- canvasElement: <canvas> 또는 DOM 요소
- options: 애니메이션 설정
  - duration: 기본 애니메이션 시간 (ms, 기본값 500)
  - easing: 이징 함수 (선형, 이즈인아웃 등)
  - colors: {bucket, highlight, collision, success, error} 색상 설정

// 책임
- 렌더링 루프 관리 (requestAnimationFrame 사용)
- 시간 기반 애니메이션 계산
```

### 7.3 메서드: playInsertAnimation(bucketIndex, key, value)
```javascript
// 서명
playInsertAnimation(bucketIndex, key, value) -> Promise<void>

// 기능
- 키-값 쌍이 버킷에 삽입되는 과정을 시각화

// 시각화 단계
1. 키의 해시 계산 시뮬레이션 (선형으로 움직이며 강조)
2. 대상 버킷 강조
3. 항목이 버킷에 추가되는 애니메이션 (확대 또는 페이드인)
4. 완료 확인 (체크마크 또는 색상 변화)

// 반환값
- Promise: 애니메이션 완료 시 resolve
```

### 7.4 메서드: playSearchAnimation(bucketIndex, found, highlightIndex = -1)
```javascript
// 서명
playSearchAnimation(bucketIndex, found, highlightIndex = -1) -> Promise<void>

// 기능
- 키를 검색하는 과정을 시각화

// 시각화 단계
1. 입력된 키를 강조
2. 해시 함수 적용 시뮬레이션 (시각적 표현)
3. 대상 버킷으로 이동 (애니메이션)
4. 버킷 내에서 검색 (목표 항목 강조 또는 '없음' 표시)
5. 결과 피드백 (체크마크 또는 X 표시)

// 반환값
- Promise: 애니메이션 완료 시 resolve
```

### 7.5 메서드: playDeleteAnimation(bucketIndex, key)
```javascript
// 서명
playDeleteAnimation(bucketIndex, key) -> Promise<void>

// 기능
- 키-값 쌍이 해시테이블에서 제거되는 과정을 시각화

// 시각화 단계
1. 대상 버킷 강조
2. 항목 축소 또는 페이드아웃
3. 항목 제거 완료 표시

// 반환값
- Promise: 애니메이션 완료 시 resolve
```

### 7.6 메서드: playRehashAnimation(oldTable, newTable)
```javascript
// 서명
playRehashAnimation(oldTable, newTable) -> Promise<void>

// 기능
- 리해싱 과정을 시뮬레이션하고 시각화

// 시각화 단계
1. 이전 테이블의 모든 항목 표시
2. 각 항목을 하나씩 새 테이블로 이동
3. 해시 함수 재계산 애니메이션
4. 새 테이블 완성 표시

// 반환값
- Promise: 애니메이션 완료 시 resolve

// 선택 사항: 단계별 진행 제어
- pauseRehash()
- resumeRehash()
- skipRehash()
```

### 7.7 메서드: playCollisionAnimation(bucketIndex, method = 'chaining')
```javascript
// 서명
playCollisionAnimation(bucketIndex, method) -> Promise<void>

// 기능
- 해시 충돌 해결 방식을 시각화

// 기본값
- method: 'chaining' (체이닝) 또는 'openAddressing' (개방 주소법)

// 시각화 단계 (Chaining)
1. 같은 버킷에 여러 항목 표시
2. 연결 리스트 구조로 연결 표시 (화살표 또는 선)
3. 검색 시 각 항목을 순회 애니메이션

// 시각화 단계 (Open Addressing)
1. 첫 번째 시도한 버킷 강조
2. 충돌 발생 시각화 (빨간색 또는 경고 표시)
3. 다음 버킷으로 이동 (선형, 이차, 이중 해싱에 따라 다름)
4. 빈 버킷 발견 시 삽입
```

### 7.8 메서드: clear()
```javascript
// 서명
clear() -> void

// 기능
- 모든 애니메이션 중지
- 렌더링 루프 정지
- 캔버스 초기화
```

---

## 8. 뷰 렌더러 (ViewRenderer) 인터페이스

### 8.1 역할
- DOM 요소 업데이트
- 통계 정보 표시 (로드 팩터, 항목 수, 버킷 용량)
- 메시지 및 결과 표시

### 8.2 메서드: updateStats(size, capacity, loadFactor)
```javascript
// 서명
updateStats(size, capacity, loadFactor) -> void

// 기능
- 통계 정보를 UI에 표시

// DOM 업데이트 대상
- #stats-size: 현재 항목 수
- #stats-capacity: 현재 버킷 용량
- #stats-loadfactor: 로드 팩터 (백분율 표시)
- #loadfactor-bar: 로드 팩터 시각화 막대
```

### 8.3 메서드: displaySearchResult(found, value)
```javascript
// 서명
displaySearchResult(found, value) -> void

// 기능
- 검색 결과를 메시지로 표시

// 예시
- 찾은 경우: "검색 성공! 값: {value}"
- 찾지 못한 경우: "검색 실패! 키를 찾을 수 없습니다."
```

### 8.4 메서드: displayMessage(message, type = 'info')
```javascript
// 서명
displayMessage(message, type) -> void

// 매개변수
- message: 표시할 메시지 텍스트
- type: 'info' | 'success' | 'error' | 'warning'

// 기능
- 상황에 맞는 메시지 표시 (색상, 아이콘 포함)
```

### 8.5 메서드: renderBuckets(table)
```javascript
// 서명
renderBuckets(table) -> void

// 기능
- 해시테이블의 모든 버킷을 시각적으로 렌더링

// 표현 방식
- 각 버킷을 박스로 표시
- 각 항목을 리스트 아이템으로 표시
- 충돌 해결 방식에 따라 시각 변경 (체이닝: 연결 표시, 개방: 탐사 경로 표시)
```

### 8.6 메서드: reset()
```javascript
// 서명
reset() -> void

// 기능
- UI를 초기 상태로 복원
- 모든 입력 필드 초기화
- 통계 정보 초기화
- 메시지 영역 초기화
```

---

## 9. 이벤트 핸들러 구조

### 9.1 DOM 이벤트 바인딩
```javascript
// 삽입 버튼 클릭
document.getElementById('insert-btn').addEventListener('click', (e) => {
  e.preventDefault();
  controller.handleInsert(
    document.getElementById('key-input').value,
    document.getElementById('value-input').value
  );
});

// 검색 버튼 클릭
document.getElementById('search-btn').addEventListener('click', (e) => {
  e.preventDefault();
  controller.handleSearch(document.getElementById('key-input').value);
});

// 삭제 버튼 클릭
document.getElementById('delete-btn').addEventListener('click', (e) => {
  e.preventDefault();
  controller.handleDelete(document.getElementById('key-input').value);
});

// 리셋 버튼 클릭
document.getElementById('reset-btn').addEventListener('click', (e) => {
  e.preventDefault();
  controller.reset();
});
```

### 9.2 키보드 이벤트 (옵션)
```javascript
// Enter 키로 삽입 실행
document.getElementById('value-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    controller.handleInsert(
      document.getElementById('key-input').value,
      document.getElementById('value-input').value
    );
  }
});
```

### 9.3 커스텀 이벤트 (선택 사항)
```javascript
// 해시테이블 상태 변경 시
window.dispatchEvent(new CustomEvent('hashTableChanged', {
  detail: { size, capacity, loadFactor }
}));

// 리해싱 시작/완료 시
window.dispatchEvent(new CustomEvent('rehashStart', { detail: {...} }));
window.dispatchEvent(new CustomEvent('rehashComplete', { detail: {...} }));
```

---

## 10. 모듈 간 호출 흐름 (Sequence Diagram)

### 10.1 Insert 작업 흐름
```
사용자 입력
  ↓
Controller.handleInsert(key, value)
  ├→ 입력 검증
  ├→ HashTable.insert(key, value)
  │  ├→ hash(key) 호출 (인덱스 계산)
  │  ├→ 버킷에 항목 추가
  │  └→ 로드 팩터 확인 (리해싱 필요 시)
  ├→ AnimationManager.playInsertAnimation(index, key, value)
  ├→ ViewRenderer.updateStats(...)
  └→ 성공 메시지 표시
```

### 10.2 Search 작업 흐름
```
사용자 입력
  ↓
Controller.handleSearch(key)
  ├→ 입력 검증
  ├→ HashTable.search(key)
  │  └→ hash(key) 후 버킷 검색
  ├→ AnimationManager.playSearchAnimation(index, found)
  ├→ ViewRenderer.displaySearchResult(found, value)
  └→ 결과 메시지 표시
```

### 10.3 Delete 작업 흐름
```
사용자 입력
  ↓
Controller.handleDelete(key)
  ├→ 입력 검증
  ├→ HashTable.delete(key)
  │  └→ hash(key) 후 버킷에서 제거
  ├→ AnimationManager.playDeleteAnimation(index, key)
  ├→ ViewRenderer.updateStats(...)
  └→ 삭제 완료 메시지 표시
```

---

## 11. 에러 처리 및 예외 상황

### 11.1 HashTable 에러
- `TypeError`: 유효하지 않은 키 입력
- `CapacityError`: 용량 초과 (리해싱 실패)
- `DuplicateKeyError`: 중복 키 처리 (선택적)

### 11.2 애니메이션 에러
- 렌더링 컨텍스트 없음: Canvas API 불가
- 메모리 부족: 큰 테이블 렌더링 실패

### 11.3 UI 에러
- DOM 요소 찾기 실패: null 참조
- 입력 검증 실패: 빈 문자열, 특수문자 등

---

## 파일 저장 위치
모든 연구 자료: `/c/Users/Admin/Desktop/bash/.claude/step_archive/outputs/`
