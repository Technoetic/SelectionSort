# Step 13 조사결과 - VisuAlgo 해시테이블 시각화 도구 분석 (Chunk 2)

**조사 방법:** Playwright 자동화 (playwright-research-2.js)
**조사 URL:** https://visualgo.net/en/hashtable
**조사 시간:** 2026-03-13
**스크린샷:** `.claude/screenshots/research-2-visualgo.png`
**원본 데이터:** `.claude/research-raw-2.txt`

---

## 1. 사이트 개요 및 핵심 정보

VisuAlgo.net의 해시테이블 시각화 도구는 **National University of Singapore (NUS)**에서 개발한 데이터 구조 교육용 인터랙티브 플랫폼이다.

### 1.1 기본 정의 및 목적

홈페이지의 첫 번째 슬라이드 내용:
- "Hash Table is a data structure to map key to values (also called Table or Map Abstract Data Type/ADT)"
- 해시 함수를 사용하여 큰 키를 작은 범위의 정수 인덱스 [0..hash_table_size-1]로 매핑
- "The probability of two distinct keys colliding into the same index is relatively high"
- 충돌 처리가 데이터 무결성 유지의 핵심

### 1.2 충돌 해결 전략

도구에서 다루는 5가지 주요 충돌 해결 기법:

1. **Open Addressing 기법:**
   - Linear Probing (LP)
   - Quadratic Probing (QP)
   - Double Hashing (DH)

2. **Closed Addressing 기법:**
   - Separate Chaining (SC)

---

## 2. UI/UX 구성 요소

### 2.1 상단 네비게이션 바

```
VISUALGO.net / en / /hashtable
```

- 다국어 지원: 영어(en), 중국어(zh), 인도네시아어(id)
- 각 해시테이블 구현 방식별 탭: LP | QP | DH | SEPARATE CHAINING
- 우측 상단: "e-Lecture Mode ▿" 드롭다운 + LOGIN 버튼

### 2.2 콘텐츠 영역 (중앙 패널)

**시각화 캔버스:**
- 동적 해시테이블 시뮬레이션 표시 영역
- 현재 상태: `N=64, M=31, α=2.1` (n개의 요소, m개의 버킷, 로드팩터)
- **Separate Chaining 방식 표현:** 각 버킷(H0~H30)에서 연결된 노드들이 체인 형태로 아래로 시각화됨
- 각 체인 노드는 검은색 동그란 점(●)으로 표현되고 값이 표시됨

### 2.3 왼쪽 사이드 패널 (조작 메뉴)

```
[Create(M, N)]
[Search(v)]
[Insert(v)]
[Remove(v)]
```

- 빨간색/어두운 배경의 컴팩트 버튼 스타일
- 각 작업 유형별 입력 필드
- 예: `Search(v)` - 드롭다운과 "Go" 버튼

### 2.4 슬라이드 표시 및 재생 컨트롤

**우측 상단:**
- "slide 1 (1%)" - 현재 슬라이드 표시
- ✍ (필기 아이콘) - 주석 추가
- ✘ (닫기 아이콘) - 닫기

**하단 재생 컨트롤:**
```
[0.5x] [______progress_bar______] [1x]
[|◀] [◀] [▶▶] [▶] [▶|]
```

- 재생 속도 조절: 0.5배속, 1배속
- 프로그레스 바
- 재생/일시정지/이전/다음/끝으로 가기 버튼

---

## 3. 강의 구조 (e-Lecture Mode)

스크래핑된 데이터에서 확인된 완전한 목차 구조:

1. **Hash Table** (개론)
2. **Motivation**
   - 2-1. Table ADT
   - 2-2. Direct Addressing Table (DAT)
   - 2-3. Example of DAT
   - 2-4. Example of DAT with Satellite Data
   - 2-5. The Answer
   - 2-6. DAT Limitations

3. **Hashing: Ideas**
   - 3-1. Phone Numbers Example
   - 3-2. Hash Table Preview
   - 3-3. Hash Table with Satellite Data
   - 3-4. Collision
   - 3-5. Probability of Collision
   - 3-6. The Calculation
   - 3-7. Two Important Issues

4. **Hash Functions**
   - 4-1. Preliminaries
   - 4-2. Example of a Bad Hash Function
   - 4-3. The Answer
   - 4-4. Perfect Hash Function
   - 4-5. Hashing Integer - Best Practice
   - 4-6. The Answer
   - 4-7. Hashing String - Best Practice
   - 4-8. The Answer

5. **Collision Resolution**
   - 5-1. Separate Chaining (SC)
   - 5-2. Open Addressing (OA)

6. **Visualization**
   - 6-1. Separate Chaining Version
   - 6-2. Open Addressing Version

7. **Separate Chaining (SC)**
   - 7-1. Search(35) and Remove(35)

8. **Linear Probing (LP)**
   - 8-1. Insert([18, 14, 21)
   - 8-2. Insert([1, 35])
   - 8-3. Search(35) and Search(8)
   - 8-4. Remove(v) - Preliminary
   - 8-5. The Answer
   - 8-6. Remove(21)
   - 8-7. Search(35) Again
   - 8-8. Insert(28) - Overwriting DEL
   - 8-9. Primary Clustering, Part 1
   - 8-10. Linear Probing Sequence
   - 8-11. Primary Clustering, Part 2

9. **Quadratic Probing (QP)**
   - 9-1. Insert(38)
   - 9-2. Remove(18) and Search(38) Again
   - 9-3. Better than Linear Probing?
   - 9-4. The Details
   - 9-5. A Theorem
   - 9-6. A Proof
   - 9-7. Better Quadratic Probing
   - 9-8. Secondary Clustering

10. **Double Hashing (DH)**
    - 10-1. Secondary Hash Function h2(v)
    - 10-2. Insert([35, 42])
    - 10-3. Remove(17) and Search(35) Again
    - 10-4. Good OA Collision Resolution Technique
    - 10-5. The (Current) Answer

11. **Extras**
    - 11-1. Rehash
    - 11-2. Hash Table Implementation
    - 11-3. Data Structure Combo?
    - 11-4. Alternative Data Structure for Table ADT
    - 11-5. Online Quiz
    - 11-6. Online Judge Exercises

---

## 4. 인터랙티브 요소 및 기능

### 4.1 기본 작업 (Operations)

사이드 패널에서 제공되는 4가지 핵심 작업:

| 작업 | 설명 | 입력 방식 |
|------|------|---------|
| **Create(M, N)** | 새 해시테이블 생성 (M: 버킷 크기, N: 요소 개수) | 숫자 입력 |
| **Search(v)** | 특정 값 검색 | 드롭다운 또는 직접 입력 |
| **Insert(v)** | 값 삽입 | 직접 입력 |
| **Remove(v)** | 값 제거 | 입력 필드 |

### 4.2 애니메이션 및 시각화

- **동적 단계 애니메이션:** 각 작업이 여러 단계로 분해되어 단계별 애니메이션 표시
- **색상 하이라이팅:** 현재 활성 요소(해시 함수 적용, 충돌 위치 등)를 시각적으로 강조
- **노드 연결:** Separate Chaining의 경우 해시 인덱스별로 연결된 리스트 구조 표현

### 4.3 재생/일시정지 컨트롤

- 속도 조절 (0.5배, 1배)
- 프레임 단위 제어 (이전/다음 단계)
- 처음/끝으로 이동
- 전체 애니메이션 프로그레스 표시

---

## 5. 모드 및 기능

### 5.1 e-Lecture Mode

- **대상:** 신규 방문자, 비로그인 사용자
- **특징:** 단계별 강의 슬라이드와 동시에 인터랙티브 시각화 제공
- **사용자 인증:** NUS 학생용 로그인 기능 제공 (향상된 기능 잠금 해제)

### 5.2 외부 자료 연결

페이지 하단에 제공:
- About
- Team
- Terms of use
- Privacy Policy

---

## 6. 알고리즘 시각화 특징

### 6.1 시각적 표현 (Separate Chaining 예시)

```
H0 → [62] → [93]
H1 → [1] → [63]
H2 → [64] → [95] → [33]
...
```

- 각 버킷을 "H" 레이블로 표시 (H0, H1, ... H30)
- 버킷 내 요소들을 체인 구조로 시각화
- 가계는 수직선으로 연결

### 6.2 매개변수 표시

- N (요소 개수): 전체 삽입할 요소의 개수
- M (버킷 크기): 해시테이블의 크기
- α (로드팩터): 평균 체인 길이 (N/M)

현재 예시: `N=64, M=31, α=2.1`

---

## 7. 주요 설계 원칙

### 7.1 교육 중심

- 복잡한 알고리즘을 **단계별로 분해**하여 이해 촉진
- 이론(슬라이드)과 실습(시각화)의 병행
- 선택 가능한 여러 충돌 해결 기법 제시

### 7.2 명확한 정보 계층

1. **상단:** 네비게이션 및 모드 선택
2. **중앙:** 주요 시각화 캔버스
3. **좌측:** 조작 컨트롤 (인풋)
4. **하단:** 재생 컨트롤 및 슬라이드 진행

### 7.3 반응형 설계

- 다양한 해시 함수 기법 선택 (탭 방식)
- 다국어 지원
- 로그인 기반 기능 구분

---

## 8. 기술적 특징

- **캔버스 기반 시각화:** SVG 또는 Canvas를 이용한 벡터 그래픽 렌더링
- **애니메이션 엔진:** 부드러운 단계별 애니메이션 재생
- **상호작용:** 실시간 입력 반응
- **성능 최적화:** 복잡한 데이터 구조도 부드럽게 렌더링

---

## 9. 사용자 피드백 및 학습 지원

- **슬라이드 진행률 표시:** "slide 1 (1%)" - 진행 상황 명확화
- **주석 기능:** ✍ 아이콘으로 학습 중 노트 추가 가능
- **예시 데이터:** "Search(7)" 같은 표준 예제 제시
- **팝업 설명:** 각 개념별 상세 설명 제공

---

## 10. 주요 UI/UX 패턴 정리

| 패턴 | 구현 방식 |
|------|---------|
| **탭 네비게이션** | LP \| QP \| DH \| SEPARATE CHAINING |
| **입력 폼** | 드롭다운 + 텍스트 입력 + "Go" 버튼 |
| **애니메이션 컨트롤** | 속도, 재생, 단계 제어 |
| **시각적 강조** | 색상, 위치 변화, 노드 연결 |
| **정보 제시** | 수식(N, M, α), 이미지, 텍스트 팝업 |
| **학습 보조** | 슬라이드 구조, 목차, 단계별 가이드 |

---

## 11. 결론

VisuAlgo의 해시테이블 시각화는 **다음과 같은 설계 철학**을 따른다:

1. **명확한 알고리즘 분해** - 복잡한 동작을 작은 단계로 나누어 표현
2. **이중 학습 경로** - 슬라이드(이론)와 시각화(실습)의 병행
3. **사용자 통제성** - 속도, 단계별 진행, 수동 조작 가능
4. **시각적 명확성** - 노드, 링크, 색상을 이용한 직관적 표현
5. **다양한 기법 지원** - 5가지 해시테이블 구현 방식 제시

이러한 설계는 **데이터 구조 학습에 최적화**되어 있으며, 교육용 튜토리얼 사이트 구현 시 벤치마크가 될 수 있다.
