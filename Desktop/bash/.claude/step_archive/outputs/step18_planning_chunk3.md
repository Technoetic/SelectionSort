# Step 18 - 기획 (Planning Chunk 3)
## 개발 일정 및 체크리스트

작성 날짜: 2026-03-13

---

## 15. 개발 단계별 작업 계획

### Phase 1: 기본 구조 구현 (Step 19-22)
1. **HashTable 클래스 구현**
   - insert(), search(), delete() 핵심 메서드
   - 간단한 해시 함수
   - Chaining 방식 충돌 해결

2. **ViewRenderer 클래스 구현**
   - Canvas 초기화
   - 기본 버킷 렌더링
   - 통계 정보 표시

3. **기본 HTML/CSS**
   - 입력 필드
   - 버튼
   - Canvas 영역

### Phase 2: 상호작용 구현 (Step 23-25)
1. **UIController 클래스**
   - 입력 검증
   - 이벤트 핸들링

2. **기본 애니메이션**
   - 버킷 하이라이트
   - 항목 추가/제거 표시

### Phase 3: 고급 기능 (Step 26-28)
1. **애니메이션 개선**
   - 부드러운 transitions
   - 해시 함수 시뮬레이션 애니메이션

2. **리해싱 구현**
   - 자동 리해싱
   - 리해싱 애니메이션

3. **Open Addressing 지원** (선택사항)

### Phase 4: 테스트 및 최적화 (Step 29-31)
1. **단위 테스트**
2. **통합 테스트**
3. **성능 최적화**
4. **크로스 브라우저 테스트**

---

## 16. 의존성 및 라이브러리

### 16.1 외부 라이브러리 (없음)
- Vanilla JavaScript만 사용
- 외부 CDN 불필요

### 16.2 내부 모듈
- HashTable.js (클래스)
- AnimationManager.js (클래스)
- ViewRenderer.js (클래스)
- UIController.js (클래스)

### 16.3 폴리필 고려사항
- Promise: ES2015 표준, 모던 브라우저 지원
- Array.find(): IE 11에서 미지원 (필요시 polyfill)

---

## 17. 코딩 스타일 가이드

### 17.1 네이밍 컨벤션
```javascript
// 클래스명: PascalCase
class HashTable { }
class UIController { }

// 메서드명: camelCase
insert(key, value)
handleInsert(key, value)

// 상수: UPPER_SNAKE_CASE
const DEFAULT_CAPACITY = 16;

// Private 필드: #prefix
#buckets = [];
#hash(key) { }
```

### 17.2 주석 스타일
```javascript
// 메서드 설명: JSDoc 형식
/**
 * HashTable에 키-값 쌍을 삽입합니다.
 * @param {string|number} key - 삽입할 키
 * @param {any} value - 삽입할 값
 * @returns {{success: boolean, index: number}}
 */
insert(key, value) { ... }

// 복잡한 로직: 인라인 주석
const index = (startIndex + i) % this.#capacity;  // Linear Probing
```

### 17.3 에러 처리
```javascript
// 검증 오류: 사용자 입력 오류
if (!key || key.trim() === '') {
  return {success: false, error: 'Invalid key'};
}

// 런타임 에러: try-catch
try {
  this.#rehash();
} catch (error) {
  console.error('Rehashing failed:', error);
  throw new Error('Capacity exceeded');
}
```

---

## 18. 각 단계별 완료 조건

### Step 19: HashTable 클래스 구현
**완료 조건**:
- ✓ constructor() 정상 작동
- ✓ insert() 기본 동작 (충돌 없음)
- ✓ search() 찾기/못 찾기 작동
- ✓ delete() 제거 작동
- ✓ hash() 함수 구현
- ✓ getSize(), getCapacity(), getLoadFactor() 작동

### Step 20: ViewRenderer 클래스 구현
**완료 조건**:
- ✓ Canvas 초기화
- ✓ 버킷 기본 렌더링
- ✓ 통계 정보 업데이트
- ✓ 메시지 표시 기능

### Step 21: 기본 UI 및 스타일
**완료 조건**:
- ✓ HTML 구조 완성
- ✓ CSS 스타일 적용
- ✓ 반응형 레이아웃
- ✓ Canvas 적절한 크기

### Step 22: UIController 클래스 구현
**완료 조건**:
- ✓ 이벤트 리스너 등록
- ✓ handleInsert() 작동
- ✓ handleSearch() 작동
- ✓ handleDelete() 작동
- ✓ 입력 검증

### Step 23: 기본 애니메이션
**완료 조건**:
- ✓ AnimationManager 기본 구조
- ✓ Promise 기반 비동기 처리
- ✓ requestAnimationFrame 사용
- ✓ 간단한 하이라이트 애니메이션

### Step 24: 통합 테스트
**완료 조건**:
- ✓ Insert → Search → Delete 워크플로우
- ✓ 여러 항목 처리
- ✓ 충돌 상황 처리
- ✓ UI 업데이트 동기화

### Step 25: 고급 애니메이션
**완료 조건**:
- ✓ 해시 함수 시뮬레이션
- ✓ 부드러운 transitions
- ✓ 애니메이션 큐 처리

### Step 26: 리해싱 구현
**완료 조건**:
- ✓ 자동 리해싱 로직
- ✓ 리해싱 애니메이션
- ✓ 새 용량으로 모든 항목 재배치

### Step 27: 최적화
**완료 조건**:
- ✓ DOM 캐싱
- ✓ 렌더링 성능 개선
- ✓ 메모리 사용 최적화

### Step 28: 테스트 및 버그 수정
**완료 조건**:
- ✓ 단위 테스트 작성
- ✓ 모든 테스트 통과
- ✓ 엣지 케이스 처리

---

## 19. 참고 레포로부터의 학습 사항 적용

### 19.1 LinearHashing에서의 학습
- **해시 함수**: (key + i) % tableSize (Linear Probing)
- **에러 처리**: Exception 기반 (우리는 return status 사용)
- **정수 키**: parseInt 사용 (우리는 문자열도 지원)

**적용 계획**:
- Linear Probing을 Open Addressing 옵션으로 구현
- 에러는 객체로 반환하되 필요시 Exception도 지원

### 19.2 hash-table-visualizer에서의 학습
- **Tailwind CSS**: 현대적 스타일링
- **Chaining 시각화**: 각 버킷 아래 항목들 표시
- **동적 DOM 조작**: 버킷과 항목을 JavaScript로 생성

**적용 계획**:
- 기본 CSS는 직접 작성하되 Tailwind 구조 참고
- Chaining 시각화: Canvas 또는 DOM으로 체인 표시

### 19.3 big-o-performance에서의 학습
- **React 컴포넌트 구조**: 모듈화된 설계
- **성능 측정**: Big-O 분석 (실제 시간 측정)
- **차트 시각화**: Chart.js 사용

**적용 계획**:
- Vanilla JS로 React 스타일의 클래스 기반 구조 구현
- 부가 기능: 성능 통계 표시 (insert/search/delete 시간)

---

## 20. 확장 가능성

### 20.1 향후 추가 기능
1. **튜토리얼 모드**: 단계별 가이드
2. **다양한 충돌 해결**: Open Addressing (Linear/Quadratic/Double Hashing)
3. **성능 통계**: 평균 접근 시간, 충돌 발생 횟수
4. **복수 언어 지원**: 영어, 한국어
5. **다크 모드**: 라이트/다크 테마

### 20.2 성능 개선 아이디어
1. **WebWorker**: 복잡한 계산을 별도 스레드에서 수행
2. **IndexedDB**: 대용량 해시테이블 저장/로드
3. **PWA**: 오프라인 지원

### 20.3 교육 확장
1. **코드 에디터**: 해시 함수를 직접 수정해보기
2. **시뮬레이션 모드**: 자동 연산 시현
3. **퀴즈**: 이해도 확인

---

## 21. 배포 및 호스팅

### 21.1 파일 구조 (배포)
```
index.html (단일 파일, 모든 코드 포함)
```

### 21.2 배포 방법
- GitHub Pages: 저장소의 index.html 커밋
- Netlify: 단일 HTML 드래그앤드롭
- Surge: 간단한 정적 호스팅

### 21.3 성능 체크
- Lighthouse 점수: 90점 이상 목표
- 페이지 로드 시간: < 2초

---

## 22. 체크리스트 (최종)

### 개발
- [ ] HashTable 클래스 완성
- [ ] AnimationManager 클래스 완성
- [ ] ViewRenderer 클래스 완성
- [ ] UIController 클래스 완성
- [ ] HTML/CSS 완성

### 테스트
- [ ] 모든 메서드 동작 확인
- [ ] 엣지 케이스 테스트
- [ ] 크로스 브라우저 테스트

### 문서화
- [ ] 코드 주석 완성
- [ ] README.md 작성
- [ ] 사용자 가이드 (선택사항)

### 최적화
- [ ] 성능 최적화
- [ ] Lighthouse 점수 확인
- [ ] 접근성 검사

### 배포
- [ ] GitHub 커밋
- [ ] 호스팅 배포
- [ ] 테스트 (배포된 버전에서)

---

## 파일 저장 위치
- 기획 청크 3: `/c/Users/Admin/Desktop/bash/.claude/step_archive/outputs/step18_planning_chunk3.md`
