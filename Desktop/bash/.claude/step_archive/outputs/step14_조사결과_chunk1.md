# Step 14 - UX/UI 조사 결과 (Chunk 1)

## 조사 정보
- **조사 대상**: 3개 주요 인터랙티브 러닝/데이터구조 시각화 플랫폼
- **수집 시간**: 2026-03-13
- **수집 도구**: Playwright (3개 스크립트 병렬 실행)
- **스크린샷**:
  - research-uxui-visualgo-hashtable.png
  - research-uxui-brilliant-hashtable.png
  - research-uxui-mdn-datastructures.png
- **원본 데이터**:
  - research-raw-uxui-visualgo.txt
  - research-raw-uxui-brilliant.txt
  - research-raw-uxui-mdn.txt

---

## 1. VisuAlgo - 데이터 구조 시각화 플랫폼

### 개요
VisuAlgo는 알고리즘 및 데이터구조를 인터랙티브하게 시각화하는 교육 플랫폼으로, 해시테이블의 모든 주요 기법을 다룬다.

**URL**: https://visualgo.net/en/hashtable

### UX/UI 특징

#### 1. 인터랙티브 요소
- **탭 기반 네비게이션**: LP (Linear Probing), QP (Quadratic Probing), DH (Double Hashing), SEPARATE CHAINING
- **입력/선택 컨트롤**: 8개
  - 버킷 수 (M) 지정
  - 항목 수 (N) 지정
  - 로드 팩터 (α) 표시
- **실행 속도 조절**: 0.5x, 1x 등으로 재생 속도 제어
- **애니메이션 기반 학습**: 단계별 시각화

#### 2. e-Lecture 모드
- 첫 방문자 또는 로그인하지 않은 사용자를 위한 설명 모드
- NUS (National University of Singapore) 학생 전용 고급 기능
- 상세한 학습 경로 제공

#### 3. 강구조화된 학습 커리큘럼
VisuAlgo의 학습 구조는 다음과 같이 11개 섹션으로 구성:

```
1. Hash Table (개요)
2. Motivation (동기부여)
3. Hashing: Ideas (해싱 개념)
4. Hash Functions (해시함수)
5. Collision Resolution (충돌 해결)
6. Visualization (시각화)
7. Separate Chaining (체인 분리)
8. Linear Probing (선형 프로빙)
9. Quadratic Probing (2차 프로빙)
10. Double Hashing (이중 해싱)
11. Extras (추가 내용)
```

#### 4. 주요 연산 시각화
- **Create(M, N)**: M개 버킷으로 N개 항목을 저장
- **Search(v)**: 특정 값 v 검색
- **Insert(v)**: 값 삽입
- **Remove(v)**: 값 삭제

---

## 2. Brilliant.org - 수학 & 과학 인터랙티브 위키

### 개요
Brilliant.org는 인터랙티브 수학, 과학, 프로그래밍 학습 플랫폼으로 해시테이블의 실무적 구현을 중심으로 다룬다.

**URL**: https://brilliant.org/wiki/hash-tables/

### UX/UI 특징

#### 1. 페이지 구조
- **섹션 수**: 4개
- **다이어그램/이미지**: 3개
  - "해시테이블 삽입 시각화" 애니메이션
  - "로드 팩터에 따른 버킷 길이" 그래프
  - 기타 설명 도표

#### 2. 콘텐츠 구조
```
Hash Tables
├─ 개요 및 정의
├─ Minimal Implementation (최소 구현)
├─ Asymptotic Complexity (시간복잡도)
└─ Sample Python Implementation
```

#### 3. 시각적 학습 요소

**로드 팩터 시각화:**
```
Load Factor = number of pairs / number of buckets
```
- 그래프: 로드 팩터 증가에 따른 성능 악화
- 극단적 예시: 버킷이 1개일 때 linked list 동작 (O(n) 성능)

**복잡도 표:**
| 연산 | 평균 | 최악 |
|------|------|------|
| Search | O(1) | O(n) |
| Insert | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Space | O(n) | O(n) |

#### 4. 실습 코드 제공
- **DJB2 해시함수 (xor variant)**: 실전 해싱 알고리즘
- **Linked List 기반 Bucket 구현**: 체인 분리 방식
- **Python 완전 구현**: 88줄의 실행 가능한 코드
- **대화형 코드 실행**: "Try it out" 섹션

#### 5. 디버깅 출력 예제
```
Bucket 0: Empty
Bucket 1: 'lion': 'yellow'
Bucket 2: 'tiger': 'orange'
          'elephant': 'grey'
          'moose': 'brown'
```

---

## 3. MDN 웹 문서 - JavaScript 데이터 구조

### 개요
Mozilla Developer Network (MDN)는 웹 표준 및 프로그래밍 언어 학습을 위한 공식 자료로, JavaScript 데이터 구조에 대한 종합 가이드를 제공한다.

**URL**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures

### UX/UI 특징

#### 1. 콘텐츠 풍부성
- **코드 예제**: 202개
- **섹션**: 2개
- **네비게이션 요소**: 4개
- **인터랙티브 컴포넌트**: 9개

#### 2. 목차 구조
```
1. Dynamic and weak typing
2. Primitive values
3. Objects
4. Type coercion
5. See also
```

#### 3. 학습 지원 요소
- **원시 타입별 설명**: null, undefined, boolean, number, bigint, string, symbol
- **타입 검사**: typeof 연산자 사용
- **함수 형식**: String/Array/Map methods
- **비교 연산**: === vs == 및 암시적 형변환

#### 4. 접근성 기능
- "Skip to main content" 링크
- 명확한 섹션 헤더
- 테이블 형식 타입 정보
- 명확한 포커스 표시

---

## 4. 3가지 플랫폼의 UX/UI 패턴 비교

### 학습 스타일 분류

| 플랫폼 | 강점 | 학습 스타일 | 대상 |
|--------|------|-----------|------|
| **VisuAlgo** | 시각화/애니메이션 | 단계별 진행 | 초급~중급 |
| **Brilliant** | 이론+실습 균형 | 읽기+코딩 | 중급 |
| **MDN** | 언어 기반 학습 | 참고 자료 | 중~상급 |

### 공통 UX/UI 요소

1. **명확한 목차/네비게이션**: 모든 플랫폼이 구조화된 학습 경로 제공
2. **시각적 표현**: 다이어그램, 애니메이션, 테이블, 그래프
3. **실습 기회**: 애니메이션, 코드 실행 환경, 코드 예제
4. **단계별 학습**: 기본 개념부터 고급 기법으로 진행
5. **다중 포맷**: 텍스트, 코드, 그래프, 이미지 혼합

### 차별화된 UX 접근

**VisuAlgo의 차별성:**
- e-Lecture 모드: 맞춤형 학습 경로
- 속도 조절: 학습자의 이해도에 맞춘 진행
- 11단계 커리큘럼: 매우 체계적

**Brilliant의 차별성:**
- Python 실행 환경: 손으로 직접 코딩
- 디버그 출력: 해시테이블 내부 상태 명확히 표현
- 부분 구현 코드: 학생이 완성하는 형식 가능

**MDN의 차별성:**
- 브라우저 문서로서의 접근성
- 다국어 지원
- 웹 표준 기반 신뢰성
- 빠른 참고용 적합

---

## 5. 해시테이블 인터랙티브 튜토리얼을 위한 설계 시사점

### 권장 UX/UI 요소

#### 1. 비주얼 계층
```
개념 설명 (텍스트)
    ↓
다이어그램 (정적 이미지)
    ↓
인터랙티브 시각화 (애니메이션)
    ↓
실행 가능한 코드 (JavaScript)
```

#### 2. 사용자 제어 요소
- **속도 조절**: 0.5x, 1x, 2x 재생 속도
- **단계 진행**: "다음 단계", "이전 단계" 버튼
- **파라미터 입력**: 버킷 크기(M), 항목 수(N)
- **연산 선택**: Insert, Search, Delete, Create 등

#### 3. 피드백 메커니즘
- 색상 변화로 상태 표시 (진행 중/완료/오류)
- 숫자 변화 (로드 팩터, 충돌 수)
- 텍스트 설명: 현재 단계가 무엇인지 실시간 표시

#### 4. 정보 아키텍처
```
단계 1: 왜 해시테이블이 필요한가? (동기부여)
단계 2: 기본 개념 (정의, 시간복잡도)
단계 3: 해시함수 (구현 방식)
단계 4: 충돌 해결 (체인/오픈 주소)
단계 5: 실습 (코드 작성)
```

#### 5. 접근성
- 키보드 네비게이션
- 스크린 리더 지원
- 높은 대비 색상
- 명확한 포커스 표시

---

## 6. 수집된 원본 데이터

### 파일 목록
1. **research-raw-uxui-visualgo.txt**: VisuAlgo 페이지 구조와 내용 분석
2. **research-raw-uxui-brilliant.txt**: Brilliant.org 콘텐츠 분석
3. **research-raw-uxui-mdn.txt**: MDN 웹 문서 분석

---

## 검증

### 수집 방식 검증
- **Playwright 사용**: 동적 렌더링 컨텐츠 캡처
- **병렬 실행**: 3개 스크립트 동시 실행
- **스크린샷 확보**: 시각적 레이아웃 기록
- **텍스트 추출**: 접근성 분석 가능

### 데이터 신뢰성
모든 정보는 실제 웹 플랫폼에서 수집된 라이브 데이터를 기반으로 함.
