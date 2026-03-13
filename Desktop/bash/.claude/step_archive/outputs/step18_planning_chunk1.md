# Step 18 - 해시테이블 인터랙티브 튜토리얼 기획

## 프로젝트 개요

### 프로젝트명
**Hash Table Interactive Tutorial Platform**

### 목표
사용자가 해시테이블의 작동 원리를 시각적으로 이해하고, 다양한 충돌 해결 기법을 직접 실험할 수 있는 인터랙티브 학습 플랫폼 구축

### 대상 사용자
- 컴퓨터 공학 학생 (초급~중급)
- 알고리즘 면접 준비자
- 데이터 구조 학습자

### 핵심 가치 제안
1. 시각적 학습: 추상적인 해시 함수를 직관적으로 이해
2. 인터랙티브 실험: 파라미터 변경 시 즉각적인 피드백
3. 다중 기법 비교: LP, QP, DH, Chaining 동시 비교
4. 성능 분석: Big-O 복잡도 및 충돌률 시각화

---

## 기술 스택

### Frontend
```
Core Framework: React 18.3
Build Tool: Vite 5.4
Styling: Tailwind CSS 3.4
Animation: GSAP 3.12
Code Editor: ACE Editor
Routing: React Router v6
Icons: React Icons
State: Zustand 또는 Redux
```

### Backend (Optional Phase 2)
```
Framework: Node.js + Express
Database: MongoDB/PostgreSQL
Authentication: JWT
WebSocket: Socket.io (실시간)
```

### DevTools
```
Linting: ESLint 9
Type Checking: TypeScript 5.9
Testing: Vitest + React Testing Library
Build: Vite
Deployment: Netlify / Vercel
```

---

## 아키텍처 설계

### 클래스 구조 (Frontend)

#### 1. HashTable 클래스
```javascript
class HashTable {
  constructor(size, collisionStrategy) {
    this.size = size
    this.buckets = Array(size).fill(null)
    this.collisionStrategy = collisionStrategy // 'LP', 'QP', 'DH', 'CHAIN'
    this.collisions = 0
    this.accesses = 0
    this.operationHistory = []
  }
  
  insert(key, value) {
    // 반환: { success, index, collisionCount, loadFactor }
  }
  
  search(key) {
    // 반환: { found, value, accessPath, accesses }
  }
  
  delete(key) {
    // 반환: { success, index }
  }
  
  getState() {
    // 현재 테이블 상태 반환
  }
}
```

#### 2. HashFunction 클래스
```javascript
class HashFunction {
  constructor(algorithm = 'DJB2') {
    this.algorithm = algorithm
  }
  
  hash(key, tableSize) {
    // DJB2 또는 Simple Modulo 해시
    // 반환: number (0 ~ tableSize-1)
  }
  
  getDistribution() {
    // 해시 분포 분석
  }
}
```

#### 3. CollisionResolver 클래스
```javascript
class CollisionResolver {
  constructor(strategy) {
    this.strategy = strategy // 'LINEAR', 'QUADRATIC', 'DOUBLE', 'CHAINING'
  }
  
  resolve(hashValue, tableSize, key) {
    // 충돌 해결 로직
    // 반환: { finalIndex, probeSequence }
  }
}
```

#### 4. AnimationManager 클래스
```javascript
class AnimationManager {
  constructor(gsap) {
    this.gsap = gsap
    this.activeAnimations = []
  }
  
  highlightBucket(index, duration) {
    // 버킷 강조 애니메이션
  }
  
  animateInsertion(fromIndex, toIndex) {
    // 삽입 애니메이션
  }
  
  showCollision(indices) {
    // 충돌 표시 애니메이션
  }
}
```

#### 5. StateManager 클래스 (Zustand)
```javascript
const useHashTableStore = create((set) => ({
  hashTable: null,
  currentOperation: null,
  animationFrames: [],
  
  initTable: (size, strategy) => set({
    hashTable: new HashTable(size, strategy)
  }),
  
  executeOperation: (operation) => {
    // 연산 실행 및 상태 업데이트
  },
  
  setAnimationFrames: (frames) => set({ animationFrames: frames })
}))
```

#### 6. VisualizationEngine 클래스
```javascript
class VisualizationEngine {
  constructor(canvasRef) {
    this.canvas = canvasRef
    this.ctx = canvasRef.getContext('2d')
    this.state = null
  }
  
  render(tableState) {
    // 캔버스에 해시 테이블 렌더링
    this.drawBuckets()
    this.drawItems()
    this.drawLabels()
  }
  
  drawBuckets() {
    // 각 버킷 그리기 (빈칸/점유/삭제)
  }
  
  drawProbeSequence(sequence) {
    // 프로브 수열 경로 표시
  }
}
```

---

## 컴포넌트 계층 구조

```
App
├── Header
│   ├── Logo
│   ├── Navigation
│   └── UserProfile (Phase 2)
├── MainLayout
│   ├── Sidebar
│   │   ├── TutorialList
│   │   ├── DifficultySelector
│   │   └── QuickStart
│   ├── MainContent
│   │   ├── VisualizationPanel
│   │   │   ├── Canvas
│   │   │   ├── Legend
│   │   │   └── Statistics
│   │   ├── ControlPanel
│   │   │   ├── ParameterInput
│   │   │   ├── OperationButtons
│   │   │   ├── SpeedControl
│   │   │   └── StepControls
│   │   └── EditorPanel
│   │       ├── CodeEditor (ACE)
│   │       ├── ExecuteButton
│   │       └── ConsoleOutput
│   ├── RightSidebar
│   │   ├── ExplanationPanel
│   │   ├── ComplexityChart
│   │   └── HintPanel
│   └── Footer
└── Modal (Dialogs)
    ├── HelpDialog
    ├── SettingsDialog
    └── ShareDialog
```

---

## UI/UX 설계

### 색상 스킴
```
배경: #1a1a1a (진짜 검정)
표면: #2d2d2d (진회색)
강조: #00E676 (초록 - 활성/성공)
경고: #F27772 (빨강 - 오류/충돌)
정보: #64B5F6 (파랑 - 정보)
텍스트: #CCCCCC (밝은 회색)
```

### 레이아웃
```
┌─────────────────────────────────────────────────┐
│ Header: Logo | Nav | Settings                   │
├──────────┬──────────────────────┬───────────────┤
│ Sidebar  │ Visualization Panel  │ Right Panel   │
│          │                      │               │
│ (Tutorial│ [Canvas Area]        │ Explanation  │
│  List)   │                      │ Complexity   │
│          │ ┌──────────────────┐ │ Chart        │
│          │ │ Hash Table Grid  │ │               │
│          │ │ [Buckets]        │ │ Hints        │
│          │ └──────────────────┘ │               │
│          │                      │               │
│ ┌────────┼──────────────────────┼───────────────┤
│ │Control Panel  | Editor Panel   │
│ │ - Params      | - Code Editor  │
│ │ - Buttons     | - Console      │
│ ├──────────────────────────────────────────────┤
│ │ Status Bar: Collisions | Load Factor | Stats │
│ └──────────────────────────────────────────────┘
```

---

## 학습 경로 (Curriculum)

### Level 1: 기초 (Beginner)
```
1.1 What is a Hash Table?
    - 정의 및 목적
    - 배열 vs Hash Table 비교
    
1.2 Hash Function Basics
    - 해시 함수의 역할
    - Simple Modulo 해시
    
1.3 Perfect Hashing
    - 충돌이 없는 경우 시뮬레이션
    
1.4 Load Factor
    - α = n/m 개념
    - Load Factor 영향
```

### Level 2: 중급 (Intermediate)
```
2.1 Collision Detection
    - 충돌 발생 시각화
    - 충돌률 계산
    
2.2 Open Addressing
    - Linear Probing
    - Quadratic Probing
    - Double Hashing
    
2.3 Separate Chaining
    - Linked List 기반 충돌 해결
    - 체인 길이 분석
```

### Level 3: 고급 (Advanced)
```
3.1 Hash Function Quality
    - DJB2, MurmurHash 등
    - 분포 분석
    
3.2 Dynamic Resizing
    - 테이블 확장 (리해싱)
    - 성능 영향 분석
    
3.3 Performance Comparison
    - 기법별 Big-O 비교
    - 실측 성능 데이터
    
3.4 Real-world Applications
    - JavaScript Map/Set
    - Database Index
    - Cache System
```

---

## 기능 명세

### 핵심 기능
```
1. 시각화
   - 버킷 상태 표시 (빈칸/점유/삭제)
   - 프로브 수열 경로
   - 색상으로 상태 표시

2. 인터랙션
   - Insert / Search / Delete 버튼
   - 파라미터 입력 (테이블 크기, 항목 수)
   - 속도 조절 (0.5x, 1x, 2x)

3. 분석
   - 충돌 수 카운트
   - Load Factor 계산
   - 접근 횟수 표시
   - Big-O 복잡도 표시

4. 코드
   - ACE Editor에서 직접 작성
   - 실시간 컴파일
   - 시각화 연동
```

### 확장 기능 (Phase 2)
```
1. 사용자 계정 및 진행률 추적
2. 퀴즈 및 실습 문제
3. 리더보드 (최고 기록)
4. 공동 학습 (라이브 세션)
5. 코드 스니펫 저장 및 공유
```

---

**문서 작성**: 2026-03-13
**계획 범위**: Phase 1 (MVP)
**예상 일정**: 2-3주
**팀 규모**: 1-2명

