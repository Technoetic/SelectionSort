# Step 19 - 설계 (Design Chunk 1)
## 클래스 상세 설계 및 API 정의

작성 날짜: 2026-03-13

---

## 1. HashTable 클래스 상세 설계

### 1.1 클래스 선언
- capacity: 초기 16개 버킷
- loadFactorThreshold: 기본값 0.75
- collisionMethod: 'chaining' (연결 리스트 방식)

### 1.2 public 메서드

insert(key, value)
- 반환: {success, index, updated, rehashed, chainLength}
- 기능: 키-값 쌍 추가, 리해싱 자동 수행

search(key)
- 반환: {found, value, index, chainLength, position}
- 기능: 키 검색

delete(key)
- 반환: {success, index, chainLength}
- 기능: 키 삭제

getSize() / getCapacity() / getLoadFactor()
- 정보 조회 메서드

getAllEntries() / getBucket(index)
- 전체/특정 버킷 조회

clear()
- 모든 항목 제거

### 1.3 private 메서드

#hash(key)
- 간단한 해시 함수: charCode 합 % capacity

#rehash()
- 용량을 2배로 증가
- 모든 항목 재배치

---

## 2. ViewRenderer 클래스 상세 설계

### 2.1 역할
- Canvas에 버킷 시각화
- DOM에 통계 정보 업데이트
- 메시지 표시

### 2.2 public 메서드

renderBuckets(buckets, highlightIndex)
- 캔버스에 모든 버킷과 항목 그리기
- 강조할 버킷을 다른 색으로 표시

updateStats(size, capacity, loadFactor)
- 통계 정보 DOM 업데이트
- 로드 팩터 막대 색상 변경 (녹색 → 주황색 → 빨강)

displayMessage(message, type, duration)
- 메시지 영역에 메시지 표시
- 자동 사라짐 기능

displaySearchResult(found, value)
- 검색 결과 메시지 표시

reset()
- 화면 초기화

---

## 3. AnimationManager 클래스 구조 (간단)

### 3.1 초기 설계

constructor(canvasElement, config)
- 캔버스와 설정 받음

playInsertAnimation(index, key, value)
- Promise 기반
- 버킷 강조 + 항목 추가 시각화
- duration: 600ms

playSearchAnimation(index, found)
- 버킷 강조
- 찾음/못 찾음 표시

playDeleteAnimation(index, key)
- 항목 제거 시각화

setSpeed(speed)
- 애니메이션 속도 조절

---

## 4. UIController 클래스 구조

### 4.1 역할
- 이벤트 리스너 등록
- 사용자 입력 검증
- 모듈 간 조율

### 4.2 public 메서드

constructor(hashTable, animationManager, viewRenderer)
- 의존성 주입

handleInsert(key, value)
1. 입력 검증
2. hashTable.insert() 호출
3. animationManager.playInsertAnimation() 호출
4. viewRenderer.updateStats() 호출

handleSearch(key)
1. 입력 검증
2. hashTable.search() 호출
3. animationManager.playSearchAnimation() 호출
4. viewRenderer.displaySearchResult() 호출

handleDelete(key)
- insert와 유사한 흐름

handleReset()
- 모든 모듈 초기화

---

## 5. HTML 구조 설계

### 5.1 레이아웃 요소

제어 영역
- key-input (텍스트 입력)
- value-input (텍스트 입력)
- 버튼: insert-btn, search-btn, delete-btn, reset-btn

통계 영역
- stat-size (항목 수)
- stat-capacity (용량)
- stat-loadfactor (로드 팩터)
- loadfactor-bar (시각화 막대)

메시지 영역
- message-area (클래스: message success/error/info/warning)

시각화 영역
- hash-table-canvas (1000x600)

---

## 6. CSS 클래스 설계

기본 스타일
- body: 배경색, 폰트
- container: 최대 폭 1200px, 중앙 정렬
- button: 기본 스타일
- input: 기본 스타일

메시지 스타일
- .message.success: 녹색
- .message.error: 빨강
- .message.info: 파랑
- .message.warning: 주황색
- .hidden: display none

로드 팩터 막대
- #loadfactor-bar: 너비는 로드 팩터에 따라 변함
- 색상: loadFactor <= 0.5 ? 녹색 : 0.5-0.75 ? 주황색 : 빨강

---

## 7. 초기화 순서

DOMContentLoaded 이벤트 처리:

1. HTML 요소 선택
2. HashTable 인스턴스 생성 (capacity=16, threshold=0.75)
3. ViewRenderer 인스턴스 생성 (canvas 선택자 전달)
4. AnimationManager 인스턴스 생성
5. UIController 인스턴스 생성
6. 이벤트 리스너 등록
7. 초기 통계 업데이트 (size=0, capacity=16, loadFactor=0)

---

## 8. 설정 상수 정의

DEFAULT_CAPACITY = 16
DEFAULT_LOAD_FACTOR_THRESHOLD = 0.75

ANIMATION_DURATION = 600  // ms
ANIMATION_EASING = 'easeInOutQuad'

COLORS = {
  bucketBg: '#f0f0f0',
  bucketBorder: '#333',
  bucketActive: '#ffeb3b',
  itemBg: '#2196f3',
  itemText: '#fff',
  itemFound: '#4caf50',
  itemError: '#f44336'
}

MAX_MESSAGE_DURATION = 3000  // ms

---

## 파일 저장 위치
설계 청크 1: `/c/Users/Admin/Desktop/bash/.claude/step_archive/outputs/step19_설계_chunk1.md`
