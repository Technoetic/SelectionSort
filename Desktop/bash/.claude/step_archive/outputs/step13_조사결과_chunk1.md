# Step 13 - 해시테이블 조사 결과 (Chunk 1)

## 조사 정보
- **소스**: Wikipedia - Hash table
- **수집 시간**: 2026-03-13
- **수집 도구**: Playwright (playwright-research-hashtable.js)
- **스크린샷**: `.claude/screenshots/research-hashtable-wiki.png`
- **원본 데이터**: `.claude/research-raw-hashtable.txt`

---

## 1. 해시테이블의 정의 및 기본 개념

### 핵심 정의
해시테이블(Hash Table)은 **연관 배열(Associative Array)**을 구현하는 데이터 구조이며, **키(Key)를 값(Value)으로 매핑**한다. 해시테이블은 **해시 함수(Hash Function)**를 사용하여 인덱스(또는 해시 코드)를 계산하고, 버킷(Bucket) 또는 슬롯(Slot) 배열에서 원하는 값을 찾는다.

**주요 특징:**
- 타입: 순서 없는 연관 배열(Unordered Associative Array)
- 발명 연도: 1953 (Hans Peter Luhn의 IBM 내부 메모)
- 대안 이름: 딕셔너리(Dictionary), 맵(Map)

### 시간 복잡도

| 연산 | 평균 | 최악의 경우 |
|------|------|-----------|
| 검색 (Search) | Θ(1) | O(n) |
| 삽입 (Insert) | Θ(1) | O(n) |
| 삭제 (Delete) | Θ(1) | O(n) |
| 공간 (Space) | Θ(n) | O(n) |

---

## 2. 해시함수 (Hash Function)

### 해시함수의 역할
해시함수는 키의 우주(Universe U) 내의 모든 요소를 테이블의 인덱스 범위 {0, 1, ..., m-1}로 매핑한다.

**공식:** h: U → {0, 1, ..., m-1}

### 완벽 해시함수 (Perfect Hash Function)
- 주어진 집합 S에 대해 모든 요소가 서로 다른 값으로 매핑되면 완벽 해시함수라고 함
- 모든 키가 미리 알려진 경우에만 생성 가능

### 해시함수 구현 방식

#### 1. 나눗셈 방식 (Division Method)
```
h(x) = x mod m
```
가장 일반적으로 사용되는 방식

#### 2. 곱셈 방식 (Multiplication Method)
```
h(x) = ⌊m((xA) mod 1)⌋
```
- A: 0 < A < 1인 비정수 실수 상수
- 황금비율(Golden Ratio) 사용 권장 (Donald Knuth)
- m의 값이 중요하지 않다는 장점

#### 3. 문자열 해싱 (String Hashing)
- 부호 없는 정수를 초기화하고 각 문자값으로 비트 시프트 및 XOR 수행
- 다항식 롤링 해시(Polynomial Rolling Hash) 방식도 사용 가능

### 좋은 해시함수의 조건
- **균등 분포 (Uniform Distribution)**: 해시값이 균등하게 분산되어야 함
- **충돌 회피**: 비균등 분포는 충돌 수를 증가시키고 해결 비용을 높임
- **K-독립 해싱 (K-independent Hashing)**: 특정 해시테이블 유형에 대해 나쁜 키 집합이 없음을 증명

---

## 3. 해시 충돌 (Hash Collision)

### 충돌의 정의
해시 함수가 2개 이상의 서로 다른 키에 대해 같은 인덱스를 반환하는 경우를 충돌이라 한다.

**핵심 원리:** 완벽한 해시 함수는 실제로는 불가능하므로 충돌 처리 메커니즘이 필수

### 충돌 해결 전략

#### 1. 체인 분리 (Separate Chaining)

**동작 원리:**
- 각 버킷이 링크드 리스트(또는 배열)를 포함
- 충돌하는 항목들을 같은 슬롯의 리스트에 저장

**연산:**
```
Chained-Hash-Insert(T, k): k를 T[h(k)]의 링크드 리스트 헤드에 삽입
Chained-Hash-Search(T, k): T[h(k)]의 링크드 리스트에서 k를 검색
Chained-Hash-Delete(T, k): T[h(k)]의 링크드 리스트에서 k를 삭제
```

**최적화:**
- 리스트를 정렬 상태로 유지하면 실패한 검색이 더 빨리 종료됨
- 자가 균형 이진 탐색 트리 사용하면 최악의 경우 O(log n)으로 개선
- 동적 완벽 해싱으로 최악의 경우 O(1) 보장 가능

#### 2. 개방 주소 지정 (Open Addressing)

**동작 원리:**
- 모든 항목이 버킷 배열에 직접 저장됨
- 충돌 시 프로빙 수열(Probing Sequence)을 따라 다음 빈 슬롯을 찾음

**프로빙 수열:**
- **선형 프로빙 (Linear Probing)**: 고정 간격(보통 1)으로 다음 슬롯 검사
- **2차 프로빙 (Quadratic Probing)**: 2차 다항식 출력값을 더하며 진행
- **이중 해싱 (Double Hashing)**: 2차 해시 함수로 프로빙 간격 계산

**특징:**
- 로드 팩터가 1을 초과할 수 없음
- 로드 팩터가 1에 가까워지면 성능 급격히 악화
- 캐시 지역성이 좋아 선형 프로빙에서 CPU 캐시 활용 우수

#### 3. 기타 충돌 해결 기법

**합동 해싱 (Coalesced Hashing):**
- 체인 분리와 개방 주소 지정의 하이브리드
- 충돌 시 가장 큰 인덱스의 빈 슬롯에 삽입하고 버킷을 연결
- 고정 메모리 할당에 적합

**쿠쿠 해싱 (Cuckoo Hashing):**
- 두 개의 해시테이블과 각각의 해시 함수 사용
- 최악의 경우 O(1) 검색 보장
- 삽입은 상수 분할상환 시간

**홉스코치 해싱 (Hopscotch Hashing):**
- 쿠쿠 해싱, 선형 프로빙, 체인의 요소 결합
- 이웃 개념(Neighbourhood of Buckets)을 사용
- 로드 팩터 90% 이상에서 우수한 성능

**로빈 후드 해싱 (Robin Hood Hashing):**
- 가장 먼 요소(가장 긴 프로브 수열)의 이동을 선호
- 이름: "부자에게서 빼앗아 빈자에게 주는" 로빈 후드 전설에서 유래
- 분포의 분산을 크게 감소시킴

---

## 4. 로드 팩터 (Load Factor)

### 정의
로드 팩터(α)는 테이블의 성능을 나타내는 중요한 지표이다.

**공식:** α = n/m
- n: 테이블에 저장된 항목 수
- m: 버킷의 수

### 성능 영향
- 로드 팩터가 증가하면 해시테이블의 성능이 악화됨
- 이상적인 난수 해시함수 하에서 각 버킷은 λ = α인 포아송 분포를 따름

### 체인 분리에서의 로드 팩터
- 최적 αmax는 보통 1~3 사이
- 점진적인 성능 악화, 절대적인 리사이징 필요 지점 없음

### 개방 주소 지정에서의 로드 팩터
- 로드 팩터 > 1 불가능 (각 슬롯은 최대 1개 항목만 저장)
- 로드 팩터가 1에 접근하면 성능 급격히 악화
- αmax는 0.6~0.75 권장

---

## 5. 동적 리사이징 (Dynamic Resizing, Rehashing)

### 필요성
삽입으로 인한 항목 수 증가 시 로드 팩터 증가로 인한 성능 악화 방지

### 표준 리사이징
- 원본 테이블 크기의 2배인 새 테이블 할당
- 모든 항목을 새 테이블로 이동하며 해시값 재계산
- 간단하지만 계산 비용이 큼

### 점진적 리사이징
**실시간 시스템의 시간 초과 문제 해결:**
- 한 번에 하나의 버킷씩 리사이징 (선형 해싱)
- 두 해시함수 유지: hold와 hnew
- 접근 시 "청소(Cleaning)" 작업으로 항목을 새 함수로 점진적 변환

---

## 6. 해시테이블의 용도

### 주요 응용 분야
1. **연관 배열 (Associative Arrays)**: 키-값 쌍 저장 및 조회
2. **데이터베이스 인덱싱**: 디스크 기반 구조 (B-트리가 더 인기)
3. **캐시**: 느린 매체의 데이터 접근 속도 향상
4. **집합 (Set)**: 중복 없는 값 저장 및 멤버십 테스트
5. **전치 테이블 (Transposition Table)**: 게임 AI에서 검색된 상태 저장

---

## 7. 프로그래밍 언어별 구현

| 언어 | 구현 | 특징 |
|------|------|------|
| Python | dict | 해시테이블 기반 |
| Java | HashMap, HashSet | 제네릭 컬렉션 |
| C++ | unordered_map, unordered_set | STL 표준 라이브러리 |
| JavaScript | Object, Map | ES2015+ 지원 |
| Go | map | 보장은 아니지만 보통 해시테이블 |
| Ruby | Hash | Ruby 2.4+에서 개방 주소 지정 |
| Rust | HashMap, HashSet | 표준 라이브러리 |
| C# / VB.NET | HashSet, Dictionary | .NET 표준 라이브러리 |

---

## 8. 역사 및 발전

### 초기 개발 (1950년대)
- 1953년 1월: Hans Peter Luhn의 IBM 메모에서 체인 분리 방식 제안
- A. D. Linh: 개방 주소 지정 최초 제안
- IBM Research (Gene Amdahl, Elaine M. McGraw, Nathaniel Rochester, Arthur Samuel): IBM 701 어셈블러에서 구현

### 주요 기법 발전
- **선형 프로빙**: Gene Amdahl 기여 (Andrey Ershov와 독립적 발견)
- **"개방 주소 지정"** 용어: W. Wesley Peterson (1957년 논문)
- **체인 분리 출판**: Arnold Dumey (나머지 모듈로 프라임 해시함수 논의)
- **"해싱"** 용어: Robert Morris의 논문에서 최초 사용
- **선형 프로빙 이론 분석**: Konheim과 Weiss

---

## 9. 해시테이블 vs. 다른 자료구조

### 검색 성능 비교
- 해시테이블: 평균 O(1) (자가 균형 이진 탐색 트리보다 우수)
- 공간-시간 트레이드오프 (Space-Time Tradeoff)
  - 메모리가 무한하면: 키를 직접 인덱스로 사용 (1회 메모리 접근)
  - 시간이 무한하면: 이진 탐색 또는 선형 탐색 사용

---

## 연구 검증

### 수집된 데이터
- **스크린샷 확보**: research-hashtable-wiki.png
- **원본 텍스트**: research-raw-hashtable.txt (41,086자)
- **출처 검증**: Wikipedia Hash table 항목 전체 텍스트 추출
- **수집 방식**: Playwright 자동화로 웹 렌더링 후 텍스트 추출

### 데이터 신뢰성
모든 정보는 Wikipedia의 공식 해시테이블 문서에서 직접 수집된 데이터를 기반으로 작성됨.
