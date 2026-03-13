# Step 13 - 해시테이블 실제 사용 사례 조사 (chunk 3)

## 데이터 출처
- **Playwright 스크립트**: .claude/playwright-research-3.js
- **스크린샷**: .claude/screenshots/research-3-assoc-array.png
- **원본 데이터**: .claude/research-raw-3.txt
- **출처**: https://en.wikipedia.org/wiki/Associative_array
- **수집 시각**: 2026-03-13 22:50

## 수집된 내용 요약

### 해시테이블(연관 배열)의 정의
- key/value 쌍을 저장하는 추상 자료형
- 각 키는 컬렉션에서 최대 한 번만 나타남
- 핵심 연산: Insert(put), Remove(delete), Lookup(find/get)

### 해시테이블의 실제 사용 사례

1. **전화번호부/연락처 앱** (Contact Book)
   - 이름(키) → 전화번호(값) 매핑
   - 가장 직관적인 해시테이블 사례
   - 빠른 검색: O(1) 평균 시간

2. **DNS 캐시** (DNS Cache)
   - 도메인명(키) → IP 주소(값) 매핑
   - 브라우저, OS 레벨에서 사용

3. **브라우저 캐시** (Browser Cache)
   - URL(키) → 캐시된 리소스(값) 매핑

4. **데이터베이스 인덱싱** (Database Indexing)
   - 인덱스 키 → 레코드 위치 매핑

5. **프로그래밍 언어의 심볼 테이블** (Symbol Table)
   - 변수명(키) → 메모리 주소/값(값) 매핑
   - 컴파일러, 인터프리터에서 사용

6. **메모이제이션** (Memoization)
   - 함수 인자(키) → 계산 결과(값) 캐싱

7. **데코레이터 패턴** (Decorator Pattern)
   - 객체에 동적으로 속성을 추가하는 패턴

### 튜토리얼로 적합한 사례 분석

| 사례 | 직관성 | 인터랙티브 가능성 | 교육 효과 | 총점 |
|------|--------|-------------------|-----------|------|
| 전화번호부 | ★★★★★ | ★★★★★ | ★★★★★ | 15 |
| DNS 캐시 | ★★★ | ★★★ | ★★★★ | 10 |
| 브라우저 캐시 | ★★★ | ★★★ | ★★★ | 9 |
| 심볼 테이블 | ★★ | ★★★ | ★★★★ | 9 |
| 메모이제이션 | ★★ | ★★ | ★★★ | 7 |

### 결론: 전화번호부 앱이 가장 적합

**선정 이유:**
1. 누구나 이해할 수 있는 직관적 개념
2. CRUD 연산이 해시테이블 연산과 1:1 매핑
3. 충돌(같은 이름) 시나리오를 자연스럽게 시연 가능
4. 해시 함수의 동작을 시각적으로 보여주기 용이
5. 실제 앱과 동일한 UX 경험 제공 가능

### 프로그래밍 언어별 해시테이블 구현
- Python: dict, defaultdict
- JavaScript: Object, Map
- Java: HashMap, Hashtable
- C++: unordered_map
- Go: map
