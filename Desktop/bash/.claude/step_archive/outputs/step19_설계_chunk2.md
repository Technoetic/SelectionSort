# Step 19 - 설계 문서 (chunk 2) - 나머지 클래스 및 UI

## Visualizer 클래스 설계
```javascript
class Visualizer {
  #container;
  #animationEngine;
  #bucketElements;

  constructor(container, animationEngine) {
    this.#container = container;
    this.#animationEngine = animationEngine;
    this.#bucketElements = [];
  }

  renderBuckets(buckets) {
    // 버킷 배열을 DOM으로 렌더링
    // 각 버킷은 세로 슬롯으로 표현
    // 체인은 가로로 연결된 노드로 표현
  }

  async showHashComputation(key, hashSteps, finalIndex) {
    // 1. 키 문자열 표시
    // 2. 각 문자의 charCode 계산 애니메이션
    // 3. 합산 과정 표시
    // 4. mod 연산으로 최종 인덱스 도출
  }

  async highlightBucket(index, color) {
    // 특정 버킷에 색상 하이라이트 + 바운스 애니메이션
  }

  async showCollision(index, chain) {
    // 충돌 발생 시 빨간 테두리 + 흔들림 애니메이션
    // 체인에 새 노드가 추가되는 과정 시각화
  }
}
```

## AnimationEngine 클래스 설계
```javascript
class AnimationEngine {
  #speed;
  #queue;
  #isPlaying;

  constructor() {
    this.#speed = 1;
    this.#queue = [];
    this.#isPlaying = false;
  }

  setSpeed(speed) { this.#speed = speed; }

  async animate(element, keyframes, duration) {
    return element.animate(keyframes, {
      duration: duration / this.#speed,
      easing: 'ease-in-out',
      fill: 'forwards'
    }).finished;
  }

  queue(animationFn) { this.#queue.push(animationFn); }

  async playAll() {
    this.#isPlaying = true;
    for (const fn of this.#queue) {
      if (!this.#isPlaying) break;
      await fn();
    }
    this.#queue = [];
  }
}
```

## TutorialManager 설계
```javascript
const TUTORIAL_STEPS = [
  {
    title: "해시 함수란?",
    description: "이름을 숫자로 변환하는 마법의 함수입니다...",
    action: "demo-hash",
    highlight: ".hash-computation"
  },
  // ... 8개 단계
];
```

## 색상 팔레트 (다크 테마)
- 배경: #1a1a2e
- 패널: #16213e
- 강조: #0f3460
- 포인트: #e94560 (삽입), #00d2d3 (검색), #ff9f43 (삭제)
- 버킷 빈: #2d2d44
- 버킷 찬: #4ecdc4
- 충돌: #ff6b6b
- 텍스트: #eee

## 반응형 디자인
- 1200px+: 좌우 2컬럼
- 768px~1199px: 스택 레이아웃
- ~767px: 모바일 최적화
