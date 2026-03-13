# Step 31 코드 리뷰 보고서 - Semgrep 보안/품질 분석

**분석 일시:** 2026-03-13
**도구:** Semgrep (Security & Quality Analysis)
**분석 대상:** src/ 디렉토리

---

## 실행 결과 요약

| 항목 | 결과 |
|------|------|
| 총 발견 사항 | 7건 |
| 스캔된 파일 | 17개 |
| 적용된 규칙 | 217개 |
| 심각도 분류 | ERROR: 7건 |

---

## 발견 사항 (Findings)

### 1. src/js/App.js (2건)

#### Issue #1
- **규칙:** insecure-document-method
- **줄 번호:** 215
- **심각도:** ERROR
- **취약점:** innerHTML/outerHTML 사용
- **설명:** User controlled data in methods like `innerHTML`, `outerHTML` or `document.write` is an anti-pattern that can lead to XSS vulnerabilities
- **CWE:** CWE-79: Improper Neutralization of Input During Web Page Generation (XSS)
- **OWASP:**
  - A07:2017 - Cross-Site Scripting (XSS)
  - A03:2021 - Injection
  - A05:2025 - Injection

#### Issue #2
- **규칙:** insecure-document-method
- **줄 번호:** 243
- **심각도:** ERROR
- **취약점:** innerHTML/outerHTML 사용
- **설명:** User controlled data in methods like `innerHTML`, `outerHTML` or `document.write` is an anti-pattern that can lead to XSS vulnerabilities
- **CWE:** CWE-79: Improper Neutralization of Input During Web Page Generation (XSS)
- **OWASP:**
  - A07:2017 - Cross-Site Scripting (XSS)
  - A03:2021 - Injection

### 2. src/js/TutorialManager.js (1건)

#### Issue #1
- **규칙:** insecure-document-method
- **줄 번호:** 126
- **심각도:** ERROR
- **취약점:** innerHTML/outerHTML 사용
- **설명:** User controlled data in methods like `innerHTML`, `outerHTML` or `document.write` is an anti-pattern that can lead to XSS vulnerabilities
- **CWE:** CWE-79: Improper Neutralization of Input During Web Page Generation (XSS)
- **OWASP:**
  - A07:2017 - Cross-Site Scripting (XSS)
  - A03:2021 - Injection

### 3. src/js/Visualizer.js (4건)

#### Issue #1
- **규칙:** insecure-document-method
- **줄 번호:** 18
- **심각도:** ERROR
- **취약점:** innerHTML/outerHTML 사용

#### Issue #2
- **규칙:** insecure-document-method
- **줄 번호:** 39
- **심각도:** ERROR
- **취약점:** innerHTML/outerHTML 사용

#### Issue #3
- **규칙:** insecure-document-method
- **줄 번호:** 54
- **심각도:** ERROR
- **취약점:** innerHTML/outerHTML 사용

#### Issue #4
- **규칙:** insecure-document-method
- **줄 번호:** 118
- **심각도:** ERROR
- **취약점:** innerHTML/outerHTML 사용

---

## 분석 결과

### 주요 취약점: XSS (Cross-Site Scripting)

**위험도:** 높음 (HIGH)

**발생 원인:**
- innerHTML, outerHTML, document.write() 메서드를 사용자 제어 데이터와 함께 사용
- DOM 조작 시 문자열 기반의 HTML 직접 삽입
- 입력 검증 및 살균 처리 부재

**영향 범위:**
- 3개 파일 (App.js, TutorialManager.js, Visualizer.js)
- 7개의 취약한 코드 지점

**잠재적 영향:**
- 악의적 스크립트 주입 가능
- 사용자 세션 정보 탈취 가능
- 피싱 공격 가능성
- DOM 조작을 통한 애플리케이션 손상

---

## 권장 조치 사항

### 1단계: 긴급 조치 (Immediate)
1. innerHTML/outerHTML 사용 코드 검토 및 식별
2. 사용자 입력 데이터 검증 규칙 수립
3. 보안 리뷰 프로세스 정립

### 2단계: 코드 리팩토링 (Short-term)
1. **텍스트만 필요한 경우:**
   ```javascript
   // Before (취약)
   element.innerHTML = userInput;

   // After (안전)
   element.textContent = userInput;
   ```

2. **HTML 구조가 필요한 경우:**
   ```javascript
   // Before (취약)
   element.innerHTML = `<div>${userInput}</div>`;

   // After (안전)
   const div = document.createElement('div');
   div.textContent = userInput;
   element.appendChild(div);
   ```

3. **DOMPurify 라이브러리 도입:**
   ```javascript
   import DOMPurify from 'dompurify';
   element.innerHTML = DOMPurify.sanitize(userInput);
   ```

### 3단계: 장기 전략 (Long-term)
1. React/Vue 등 최신 프레임워크 도입 검토 (자동 XSS 방어)
2. 템플릿 엔진 사용으로 DOM 조작 자동화
3. CSP (Content Security Policy) 헤더 설정
4. 정기적 보안 감시 (정적 분석) 자동화
5. 개발팀 보안 교육 강화

---

## 코드 품질 평가

| 항목 | 등급 | 설명 |
|------|------|------|
| 보안 (Security) | D | 7개 XSS 취약점 발견 |
| 코드 관리 | C | 일관된 DOM 조작 패턴 |
| 유지보수성 | C | 문자열 기반 HTML 생성으로 가독성 저하 |

---

## 체크리스트

- [ ] App.js 줄 215, 243 수정
- [ ] TutorialManager.js 줄 126 수정
- [ ] Visualizer.js 줄 18, 39, 54, 118 수정
- [ ] DOMPurify 또는 유사 라이브러리 도입 검토
- [ ] 수정 후 재검사 (semgrep 재실행)
- [ ] 보안 리뷰 완료

---

## 참고자료

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CWE-79: Improper Neutralization of Input During Web Page Generation](https://cwe.mitre.org/data/definitions/79.html)
- [Semgrep Rules - XSS Detection](https://semgrep.dev/r/javascript.browser.security.insecure-document-method)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)

---

**보고서 작성:** Step 31 Semgrep 자동 분석
**상태:** 완료
