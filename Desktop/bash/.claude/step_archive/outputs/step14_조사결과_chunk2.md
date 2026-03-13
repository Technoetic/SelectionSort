# Step 14: 전화번호부 앱 UX/UI 조사 (Playwright 기반)

## 1. Material Design 컴포넌트 체계

### 주요 컴포넌트 카테고리
Material Design 3는 다음 6가지 카테고리로 컴포넌트를 조직:
- **Action**: 버튼, FAB(Floating Action Button), 아이콘 버튼
- **Containment**: 카드, 시트(Bottom sheets, Side sheets)
- **Communication**: 배지, 다이얼로그, 스낵바, 툴팁
- **Navigation**: 네비게이션 바, 드로어, 레일, 탭
- **Selection**: 체크박스, 라디오 버튼, 스위치, 세그먼트 버튼
- **Text Input**: 텍스트 필드, 검색, 칩

## 2. 전화번호부/연락처 앱에 적합한 UI 패턴

### 필수 컴포넌트

#### 상단 네비게이션
- **App Bar**: 제목, 검색 버튼, 액션 메뉴 배치
- 검색: "Search lets people enter a keyword or phrase to get relevant information"

#### 연락처 목록 표시
- **Lists**: "Lists are continuous, vertical indexes of text and images"
  - 연락처명, 전화번호 또는 첫 글자 아바타 표시에 최적
- **Dividers**: "Dividers are thin lines that group content in lists or other containers"
  - 연락처 항목 간 구분선

#### 신규 연락처 추가
- **FAB (Floating Action Button)**: "help people take primary actions"
  - 우측 하단 위치의 '+' 버튼
- **Extended FAB**: 텍스트 라벨이 포함된 확장형 FAB

#### 상세 보기/편집
- **Bottom Sheets**: "show secondary content anchored to the bottom of the screen"
  - 연락처 상세정보 또는 편집 모달 표시
- **Dialogs**: "provide important prompts in a user flow"
  - 삭제 확인 등 중요한 액션 처리

### 상호작용 요소

#### 데이터 입력
- **Text Fields**: "let users enter text into a UI"
  - 이름, 전화번호, 이메일, 주소 입력
- **Chips**: "help people enter information, make selections, filter content"
  - 전화번호 유형 선택 (휴대폰, 집, 회사)

#### 필터링/정렬
- **Segmented Buttons**: "help people select options, switch views, or sort elements"
  - 최근 연락처 / 자주 연락하는 연락처 / 전체 필터
- **Menus**: "display a list of choices on a temporary surface"
  - 정렬 옵션 (이름순, 추가순, 자주 쓰인순)

#### 상태 표시
- **Badges**: "show notifications, counts, or status information"
  - 즐겨찾기 표시, 그룹 카운트
- **Icons with Badge**: 전화/메시지 미답 카운트

## 3. 해시테이블 튜토리얼 UI 설계 전략

### 데이터 구조 시각화
- **Cards**: 각 연락처를 개별 카드로 표현
- **Lists**: 해시 버킷을 시각적 그룹으로 표현
- **Carousel**: "show a collection of items that can be scrolled"
  - 해시 함수 결과(버킷)에 따른 분류 표시

### 상호작용 학습 흐름
1. **검색 입력** (Text Field) →
2. **해시 함수 시각화** (Progress Indicator) →
3. **버킷 위치 강조** (Badge) →
4. **결과 표시** (Card)

### 성능 피드백
- **Progress Indicators**: "show the status of a process in real time"
  - 검색 중 진행 상태 표시
- **Loading Indicators**: "show the progress of a process for a short wait time"
  - 데이터 로드 중 표시

## 4. Material Design 3 주요 특징

### 기본 원칙
- **적응형 레이아웃**: 모바일에서 데스크톱까지 반응형 지원
- **명확한 시각 계층**: 색상, 크기, 간격으로 정보 우선순위 표현
- **일관된 상호작용**: 버튼 상태(기본, 호버, 누름, 비활성화) 제공

### 컴포넌트 특성
- 아이콘 통합: 각 컴포넌트에 Material Icons 사용 가능
- 리플 효과: 터치 피드백 제공
- 애니메이션: 부드러운 전환 효과

## 5. 구현 권장사항

### 연락처 앱 MVP 구조
```
Top App Bar (검색 + 메뉴)
├─ Navigation Drawer / Tabs (탭: 최근, 즐겨찾기, 전체)
├─ List (연락처 목록)
│  ├─ ListItem (이름 + 첫글자 아바타)
│  ├─ Divider
├─ FAB (신규 추가)
└─ Bottom Sheet (상세보기 / 편집)
```

### 해시테이블 시각화 컴포넌트
- 버킷 표현: Card 또는 Chip 그룹
- 충돌 표시: Badge로 충돌 수량 표시
- 로드 팩터: Progress Indicator로 테이블 포화도 시각화

## 결론

Material Design 3는 전화번호부 앱을 위한 완벽한 컴포넌트 라이브러리를 제공합니다.
특히 Lists, App Bar, FAB, Cards는 필수 요소이며,
이들을 활용하면 해시테이블 개념을 직관적으로 학습할 수 있는 인터페이스 구현이 가능합니다.
