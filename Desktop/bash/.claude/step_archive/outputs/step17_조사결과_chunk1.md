# Step 17 - 참고 레포지토리 코드 분석

## 클론 현황

| 레포 | 경로 | 상태 |
|------|------|------|
| algorithm-visualizer | .claude/references/algorithm-visualizer/ | 성공 |
| dsa-visualization | .claude/references/dsa-visualization/ | 성공 |
| big-o-performance | .claude/references/big-o-performance/ | 성공 |
| LinearHashing | .claude/references/LinearHashing/ | 성공 |
| hash-table-visualized | .claude/references/hash-table-visualized/ | 성공 |

---

## 1. algorithm-visualizer (algorithm-visualizer/algorithm-visualizer)

### 프로젝트 개요
**Repository**: https://github.com/algorithm-visualizer/algorithm-visualizer
**Live Demo**: https://algorithm-visualizer.org/
**Language**: JavaScript/TypeScript
**Framework**: React + Redux

### 기술 스택
```
Frontend:
- React 18.x
- Redux (상태 관리)
- Webpack (번들러)
- ACE Editor (코드 에디터)
- SVG/Canvas (시각화)

Backend:
- Node.js
- Express.js (추정)

DevTools:
- TypeScript
- ESLint
- Babel
```

### 핵심 디렉토리 구조
```
algorithm-visualizer/
├── src/
│   ├── components/       # UI 컴포넌트
│   ├── containers/       # Redux 컨테이너
│   ├── actions/          # Redux 액션
│   ├── reducers/         # Redux 리듀서
│   ├── files/            # 알고리즘 코드/튜토리얼
│   ├── styles/           # CSS/스타일
│   └── index.tsx         # 진입점
├── public/
│   ├── index.html
│   └── manifest.json
├── config/               # 설정 파일
├── build/                # 빌드 출력
├── package.json
├── tsconfig.json
└── webpack.config.js
```

### 주요 패턴

#### 1. Redux 상태 관리
```javascript
// 상태 구조
{
  algorithm: {         // 선택된 알고리즘
    id: string,
    name: string,
    description: string
  },
  code: {              // 코드 에디터 상태
    source: string,
    language: string
  },
  visualization: {     // 시각화 상태
    frames: AnimationFrame[],
    currentFrame: number,
    speed: number
  },
  ui: {                // UI 상태
    selectedPanel: string,
    isPlaying: boolean
  }
}
```

#### 2. 컴포넌트 계층
```
App
├── Header              # 상단 네비게이션
├── Sidebar             # 알고리즘 목록
├── MainPanel
│   ├── CodeEditor      # ACE 에디터
│   ├── VisualizationCanvas  # 렌더링 영역
│   └── Controls        # Play/Pause/Speed
└── Footer              # 링크 및 정보
```

#### 3. 시각화 명령 API (Tracer)
```javascript
// 알고리즘 코드에서 사용되는 명령들
Tracer.createArray([...])       // 배열 생성
Tracer.setArrElement(i, val)   // 원소 설정
Tracer.step()                   // 다음 단계
Tracer.setVariable(name, val)  // 변수 설정
Tracer.log(message)             // 로그 출력
```

### 우리 프로젝트에 적용할 점
1. **Redux 상태 관리**: 해시테이블 상태를 Redux로 관리
2. **재사용 가능한 컴포넌트**: CodeEditor, VisualizationCanvas 분리
3. **플러그인 구조**: 알고리즘별 시각화 모듈 추가 가능
4. **Tracer API**: 시각화 명령 표준화

---

## 2. dsa-visualization (hamza9021/DSA-VISULZATION)

### 프로젝트 개요
**Repository**: https://github.com/hamza9021/DSA-VISULZATION
**Live Demo**: https://dsavisulzation.netlify.app/
**Language**: JavaScript
**Framework**: React 18.3

### 기술 스택
```
Frontend:
- React 18.3.1
- React Router DOM 6.28.0
- GSAP 3.12.5 (애니메이션)
- React Icons 5.3.0
- TailwindCSS 3.4.14

Build:
- Vite 5.4.10
- ESLint
- PostCSS
- Autoprefixer
```

### package.json 분석
```json
{
  "type": "module",     // ES 모듈 사용
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### 디렉토리 구조
```
dsa-visualization/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── DataStructureVisualizer.jsx
│   │   ├── Algorithm*.jsx      # 알고리즘별 컴포넌트
│   │   └── Canvas.jsx
│   ├── hooks/
│   │   └── Custom hooks
│   ├── utils/
│   │   ├── algorithms.js
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
├── package.json
└── netlify.toml        # Netlify 배포 설정
```

### 핵심 특징

#### 1. 지원하는 자료구조
- Array (배열)
- Linked List (링크드 리스트)
- Stack (스택)
- Queue (큐)
- Tree (트리)
- Graph (그래프)
- Heap (힙)
- Hash Table (해시테이블)

#### 2. GSAP를 이용한 애니메이션
```javascript
import gsap from 'gsap';

// 요소 애니메이션
gsap.to(element, {
  duration: 0.5,
  x: newPosition,
  opacity: 1,
  ease: "power2.out"
});
```

#### 3. React Router 사용
```javascript
// 자료구조별 라우트
<Routes>
  <Route path="/array" element={<ArrayVisualizer />} />
  <Route path="/hashtable" element={<HashTableVisualizer />} />
  <Route path="/tree" element={<TreeVisualizer />} />
  // ...
</Routes>
```

#### 4. Tailwind CSS 스타일링
```javascript
// 반응형 디자인
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="bg-gray-900 text-white rounded-lg p-6">
    {/* 시각화 */}
  </div>
  <div className="bg-gray-800 rounded-lg p-6">
    {/* 제어판 */}
  </div>
</div>
```

### 우리 프로젝트에 적용할 점
1. **Vite 빌드**: 빠른 개발 서버 및 빌드
2. **GSAP 애니메이션**: 부드러운 상태 전환
3. **React Router**: 다중 자료구조 지원
4. **Tailwind CSS**: 빠른 스타일링 및 반응형
5. **Netlify 배포**: 자동 배포 설정

---

## 3. big-o-performance (rramatchandran/big-o-performance-java)

### 프로젝트 개요
**Repository**: https://github.com/rramatchandran/big-o-performance-java
**Language**: JavaScript (Create React App)
**Stars**: 79

### 기술 스택
```
Frontend:
- React
- JavaScript
- CSS
- Create React App

Deployment:
- GitHub Pages
- Heroku
- Surge
```

### 핵심 개념
데이터 구조별 Big-O 성능 비교 시각화
- Array O(n) 탐색 vs Hash Table O(1)
- 다양한 연산의 시간 복잡도 표시
- 성능 메트릭 그래프

### 우리 프로젝트에 적용할 점
1. **Big-O 복잡도 표시**: 해시테이블 연산 복잡도 표시
2. **성능 비교**: Linear Probing vs Chaining 비교
3. **성능 메트릭**: 실행 시간, 메모리 사용량 표시

---

## 4. LinearHashing (rabinadk1/LinearHashing)

### 프로젝트 개요
**Technology**: p5.js (2D 그래픽)
**Status**: Archived
**Homepage**: https://rabinadk1.github.io/LinearHashing/

### 특징
- p5.js를 이용한 시각화
- Linear Probing 기법 시각화
- 충돌 처리 과정 단계별 표시
- GitHub Pages로 배포

### 우리 프로젝트에 적용할 점
1. **p5.js vs Canvas**: 그래픽 라이브러리 선택
2. **단계별 시각화**: 각 연산의 단계별 표현
3. **GitHub Pages 배포**: 정적 호스팅

---

## 5. 비교 분석

### 기술 스택 진화
```
2014-2018: Angular.js + 기본 JavaScript
    ↓
2019-2021: React + p5.js/Canvas
    ↓
2024-2026: React/Vite + GSAP + Tailwind
```

### 애니메이션 방식
```
p5.js: 저수준 그래픽 제어, 맞춤형 효과
Canvas: 표준 API, 성능 최적화
GSAP: 고수준 애니메이션, 복잡한 시퀀스
CSS: 간단한 전환, 상태 표시
```

### 배포 전략
```
GitHub Pages: 정적 사이트 (빠름)
Netlify: 자동 빌드 및 배포
Vercel: SSR 지원, Next.js 최적화
```

---

## 6. 권장 아키텍처 (해시테이블 튜토리얼)

```
Frontend Architecture:
┌─────────────────────────────────────┐
│        React (Vite)                 │
├─────────────────────────────────────┤
│  Components                         │
│  ├── HashTableVisualizer            │
│  │   ├── Canvas/SVG 렌더링          │
│  │   └── 상호작용 이벤트            │
│  ├── CodeEditor (ACE)               │
│  └── ControlPanel                   │
│      ├── Speed Control              │
│      └── Operation Buttons          │
├─────────────────────────────────────┤
│  State Management (Zustand/Redux)   │
│  ├── HashTableState                 │
│  ├── AnimationFrames                │
│  └── UserProgress                   │
├─────────────────────────────────────┤
│  Animation (GSAP)                   │
│  ├── Node transitions               │
│  ├── Color changes                  │
│  └── Text updates                   │
├─────────────────────────────────────┤
│  Styling (Tailwind CSS)             │
│  ├── 반응형 레이아웃               │
│  └── 다크 테마                      │
└─────────────────────────────────────┘
```

---

**분석 완료**: 2026-03-13T14:10:00Z
**분석 레포**: 5개
**기술 스택 범위**: Angular → React → React+Vite
**적용 권장 기술**: React 18 + Vite + GSAP + Tailwind

