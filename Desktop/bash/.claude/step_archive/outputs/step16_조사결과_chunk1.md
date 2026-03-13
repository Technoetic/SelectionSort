# Step 16 - API 계약 문서 조사 결과 (Chunk 1)

## 조사 정보
- **대상**: 프로젝트 내 API 계약 문서 및 참고 저장소
- **조사 시간**: 2026-03-13
- **수집 도구**: GitHub API, 파일 시스템 검사
- **원본 데이터**:
  - research-raw-api-1.json
  - research-raw-api-2.json
  - references/torus/frontend/lib/api.ts

---

## 1. 발견된 API 계약 문서

### 1.1 Torus API (Distributed Hash Table)
**파일**: `.claude/references/torus/frontend/lib/api.ts`

#### API 클래스: TorusAPI
```typescript
class TorusAPI {
  private baseURL: string;
  constructor(baseURL: string = API_BASE_URL)
}
```

**설정:**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
```

#### 구현된 메서드

**1) 노드 정보 조회**
```typescript
async getNodeInfo(): Promise<ChordNode>
  Endpoint: GET /api/node/info
  Response: { node: ChordNode }
```

**2) 후속 노드 조회 (Successors)**
```typescript
async getSuccessors(): Promise<ChordNode[]>
  Endpoint: GET /api/node/successors
  Response: { successors: ChordNode[] }
```

**3) 선행 노드 조회 (Predecessor)**
```typescript
async getPredecessor(): Promise<ChordNode | null>
  Endpoint: GET /api/node/predecessor
  Response: { predecessor: ChordNode | null }
```

**4) 핑 (Health Check)**
```typescript
async ping(): Promise<{ message: string; timestamp: string }>
  Endpoint: GET /api/node/ping
```

**5) 키 조회**
```typescript
async getKey(key: string): Promise<{ value: string; found: boolean }>
  Endpoint: GET /api/keys/{key}
  Note: key는 URL 인코딩됨
```

**6) 키 설정 (생성/업데이트)**
```typescript
async setKey(key: string, value: string, ttlSeconds: number = 0): 
  Promise<{ success: boolean }>
  
  Endpoint: POST /api/keys
  Headers: Content-Type: application/json
  Body: {
    key: string,
    value: string (Base64 encoded),
    ttl_seconds: number
  }
  TTL 기본값: 0 (무제한)
```

**7) 키 삭제**
```typescript
async deleteKey(key: string): Promise<{ success: boolean }>
  Endpoint: DELETE /api/keys/{key}
```

**8) 상태 확인**
```typescript
async healthCheck(): Promise<{ status: string }>
  Endpoint: GET /health
```

**9) 경로 조회 (Lookup Path)**
```typescript
async lookupPath(key: string): Promise<{
  key: string,
  keyHash: string,
  responsibleNode: ChordNode,
  path: ChordNode[],
  hops: number
}>
  Endpoint: GET /api/lookup/{key}
```

**10) 핑거 테이블 조회**
```typescript
async getFingerTable(): Promise<{
  start: string,
  node: ChordNode,
  index?: number
}[]>
  Endpoint: GET /api/node/fingers
  Response: { entries: [...] }
```

**11) 링 발견 (Ring Discovery)**
```typescript
async discoverRing(): Promise<ChordNode[]>
```
**특징:**
- 부트스트랩 노드에서 시작
- 후속 노드를 따라가며 전체 링 순회
- 최대 100개 노드 제한
- 실패한 노드는 대체 경로 시도
- HTTP 포트 기반 통신

#### ChordNode 타입 구조
```typescript
interface ChordNode {
  id: string,              // 노드 식별자
  host: string,            // 호스트명/IP
  httpPort: number,        // HTTP API 포트
  successor?: ChordNode,    // 다음 노드
  successors?: ChordNode[], // 후속 노드 목록
}
```

#### 에러 처리
- 모든 메서드에서 응답 상태 확인
- 실패 시 `Error` 예외 발생
- Ring Discovery에서는 대체 경로 시도 후 마지막 수단으로 중단

---

## 2. GitHub 참고 저장소 분석

### 2.1 Big-O Performance (Performance Visualization)
**출처**: rramatchandran/big-o-performance-java

#### 메타데이터
| 항목 | 값 |
|------|-----|
| **Repository** | rramatchandran/big-o-performance-java |
| **언어** | JavaScript |
| **Stars** | 79 |
| **Forks** | 45 |
| **라이선스** | MIT |
| **생성** | 2018-12-30 |
| **최근 푸시** | 2023-01-10 |

#### 목적
"데이터 구조의 성능 비용을 시연하는 간단한 HTML 앱"

#### 기술 스택
- Create React App (기반)
- React
- Node.js
- 배포: Now, Heroku, Surge, GitHub Pages

#### 주요 내용
- 대시보드 구조
- 폴더 구조: src/ (JavaScript, CSS), public/ (HTML, favicon, assets)
- Webpack 기반 빌드

**API 관련 섹션:**
- Proxying API Requests in Development
- CORS 설정 방법
- Environment Variables 활용

---

### 2.2 LinearHashing (Hash Table Visualization)
**출처**: rabinadk1/LinearHashing

#### 메타데이터
| 항목 | 값 |
|------|-----|
| **Repository** | rabinadk1/LinearHashing |
| **언어** | JavaScript |
| **Stars** | 1 |
| **Status** | Archived |
| **라이선스** | MIT |
| **생성** | 2019-08-04 |
| **최근 푸시** | 2021-07-28 |

#### 목적
"선형 프로빙을 통한 키 충돌 해결을 위한 해시테이블 시각화"

#### 특징
- p5.js 기반 시각화
- GitHub Pages 배포: https://rabinadk1.github.io/LinearHashing/
- Topics: data-structures, hashtable, javascript, p5js
- 아카이브됨 (유지보수 중단)

#### API 레이턴
- 데이터 구조 시각화에 외부 API 의존 없음
- 클라이언트 측 순수 구현

---

### 2.3 Hash Table Visualizer (Modern Implementation)
**출처**: mrexcelgodsown/hash-table-visualizer

#### 메타데이터
| 항목 | 값 |
|------|-----|
| **Repository** | mrexcelgodsown/hash-table-visualizer |
| **언어** | HTML |
| **라이선스** | MIT |
| **생성** | 2025-10-15 |
| **최근 푸시** | 2025-10-15 |
| **Status** | Active (최신) |

#### 목적
"Tailwind CSS와 JavaScript를 사용한 우아한 해시테이블 시각화 (체인 기반 충돌 해결)"

#### 특징
- 체인 분리(Chaining) 방식 구현
- 현대적 CSS 프레임워크 (Tailwind CSS) 사용
- 최신 프로젝트 (2025년)
- 작은 저장소 크기 (8 KB)

---

## 3. API 설계 패턴 분석

### 3.1 Torus API의 API 설계

**아키텍처 패턴:**
- **분산 해시 테이블** (Chord Protocol 기반)
- **Node 기반**: 각 노드가 독립적인 HTTP API 제공
- **환경 설정 기반**: NEXT_PUBLIC_API_URL 환경변수

**엔드포인트 분류:**

| 분류 | 엔드포인트 | 메서드 |
|------|-----------|--------|
| **노드 관리** | /api/node/info | GET |
| | /api/node/successors | GET |
| | /api/node/predecessor | GET |
| | /api/node/fingers | GET |
| **키-값 저장소** | /api/keys/{key} | GET |
| | /api/keys | POST |
| | /api/keys/{key} | DELETE |
| **조회 & 발견** | /api/lookup/{key} | GET |
| **헬스체크** | /api/node/ping | GET |
| | /health | GET |

**응답 형식:**
```typescript
// 성공 응답
{
  field: DataType,
  ...
}

// 조회 실패
{
  found: false,
  value: null
}
```

### 3.2 에러 처리 전략
```typescript
if (!response.ok) {
  throw new Error(`Failed to [operation]: ${response.statusText}`);
}
```

### 3.3 특수한 처리
- **URL 인코딩**: `encodeURIComponent(key)` 사용
- **Base64 인코딩**: value는 Base64로 인코딩
- **타임아웃**: TTL (Time-To-Live) 지원
- **링 발견**: 최대 100개 노드 탐색 제한

---

## 4. 해시테이블 프로젝트에의 시사점

### 4.1 참고할 기술 스택

**시각화 도구:**
- p5.js (LinearHashing 사례)
- Tailwind CSS (최신 사례)
- Canvas/SVG (가능한 대안)

**배포 플랫폼:**
- GitHub Pages (정적 사이트)
- Netlify
- Vercel (Next.js)
- Railway (현재 TimelyGPT MCP 서버 배포 중)

### 4.2 API 계약 설계 관찰

**Torus API의 특징:**
- RESTful API 원칙 준수
- JSON 요청/응답
- HTTP 메서드 명확 구분 (GET/POST/DELETE)
- 에러 처리 일관성

### 4.3 현 프로젝트에 적용 가능한 패턴

**해시테이블 시각화 API:**
```
GET /api/hashtable/state          // 현재 해시테이블 상태
POST /api/hashtable/insert        // 삽입 연산
POST /api/hashtable/search        // 검색 연산
POST /api/hashtable/delete        // 삭제 연산
POST /api/hashtable/rehash        // 리사이징
GET /api/hashtable/collision-stats // 충돌 통계
```

---

## 5. 데이터 수집 검증

### 5.1 수집 원본
- **research-raw-api-1.json**: GitHub Search API (Big-O Performance)
- **research-raw-api-2.json**: GitHub Search API (LinearHashing, Hash Table Visualizer)
- **api.ts**: Torus 프로젝트의 TypeScript API 클라이언트

### 5.2 신뢰성
모든 API 계약은 실제 구현 코드 또는 공식 GitHub 저장소에서 추출
