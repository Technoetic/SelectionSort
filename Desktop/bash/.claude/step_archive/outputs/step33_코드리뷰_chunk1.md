# Step 33: 코드 분석 - jscpd 코드 중복 분석

## 개요
`jscpd` (JavaScript Copy Paste Detector) 도구를 사용하여 코드 중복을 분석했습니다.

## 분석 결과 요약

### 전체 통계
- **총 분석 파일 수**: 19개
- **검출된 중복 코드**: 0개
- **중복 라인**: 0줄
- **중복 토큰**: 0개
- **중복 비율**: 0%

**결론: 코드 중복이 없습니다!** ✅

### 언어별 분석 상세

#### JavaScript 분석 (10개 파일)
- **총 라인**: 1,523줄
- **총 토큰**: 12,139개
- **검출된 클론**: 0개
- **중복 라인**: 0줄

분석 파일:
1. `src/js/App.js`: 226줄 코드
2. `src/classes/ViewRenderer.js`: 279줄 코드
3. `src/classes/HashTable.js`: 305줄 코드
4. `src/js/TutorialManager.js`: 156줄 코드
5. `src/js/Visualizer.js`: 152줄 코드
6. `src/js/AnimationEngine.js`: 127줄 코드
7. `src/js/HashTable.js`: 115줄 코드
8. `src/utils/constants.js`: 77줄 코드
9. `src/js/ContactBook.js`: 48줄 코드
10. `src/App.jsx`: 0줄

#### CSS 분석 (6개 파일)
- **총 라인**: 1,282줄
- **총 토큰**: 7,087개
- **검출된 클론**: 0개
- **중복 라인**: 0줄

분석 파일:
1. `src/css/tutorial.css`: 379줄
2. `src/css/visualizer.css`: 321줄
3. `src/css/main.css`: 337줄
4. `src/css/animations.css`: 196줄
5. `src/styles/index.css`: 33줄
6. `src/styles/App.css`: 16줄

#### JSX 분석 (2개 파일)
- **총 라인**: 23줄
- **총 토큰**: 184개
- **검출된 클론**: 0개

#### Markup/HTML 분석 (1개 파일)
- **총 라인**: 85줄
- **총 토큰**: 1,051개
- **검출된 클론**: 0개

## 주요 발견사항

### 긍정적 평가
1. **완벽한 코드 중복 제거**: 전체 코드베이스에서 중복이 전혀 없음
2. **깨끗한 아키텍처**: 각 모듈이 독립적으로 설계됨
3. **유지보수성 우수**: 중복 제거를 통한 리팩토링 불필요

### 주의할 점
- HashTable 구현이 두 위치에 존재 (`src/js/HashTable.js` 115줄, `src/classes/HashTable.js` 305줄)
  - 이는 의도적인 설계로 보임 (다른 버전 또는 리팩토링 중)
  - jscpd에서 감지되지 않은 것은 파일 내용이 다르다는 의미

## 권장 조치
- 현재 상태 유지 - 코드 중복이 없어 추가 개선 불필요
- 정기적으로 jscpd 검사 계속 수행 (CI/CD 통합 권장)
- HashTable의 두 버전이 목적이 다르다면, 코드 컨벤션 문서에 명시

## 분석 설정
- **감지 임계값**: 기본값 (약 50 토큰)
- **언어**: JavaScript, CSS, JSX, HTML 모두 포함
- **분석 방식**: 토큰 기반 중복 감지

## 분석 데이터 소스
- 분석 도구: jscpd v3+
- 분석 일시: 2026-03-13
- 검출 시간: 199.71ms
- 결과 파일: `.claude/jscpd-review/jscpd-report.json`
