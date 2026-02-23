# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 로컬 실행

빌드 스텝 없음. 파일을 직접 브라우저에서 열거나 로컬 서버 사용:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Non-negotiables

- Static HTML/CSS/Vanilla JS only — 프레임워크 금지.
- 기존 페이지 라우트 및 IA 유지.
- 빌드 스텝 금지 (파일을 그냥 열어서 동작해야 함).
- JS는 최소화. GSAP+ScrollTrigger만 허용. Three.js는 옵션(기본 OFF).
- `prefers-reduced-motion` 지원 필수(무거운 애니메이션 비활성).
- Unthrottled scroll handler 금지 — ScrollTrigger 우선.
- 애니메이션은 one-time trigger만 (반복 재생 금지, 명세에 명시된 경우 제외).

## 디자인 Source of Truth

- 디자인 지침: `SMGM 디자인지침서.pdf`
- 퍼블리싱/애니메이션 명세: `SMGM 웹사이트 퍼블리싱-기능명세 및 애니메이션 기획안.pdf`
- 카피는 위 PDFs 명시 값 우선.

## CSS 아키텍처 (3-file split)

| 파일 | 역할 |
|------|------|
| `css/style.css` | CSS Variables(`:root`), 리셋, 유틸리티, `.animate-on-scroll` fade-in |
| `css/components.css` | 헤더/GNB, Footer, Contact Modal, 공통 컴포넌트 |
| `css/pages.css` | 페이지별 고유 스타일 |

색상/스페이싱/타이포 변경은 반드시 `style.css`의 `:root` CSS Variables 수정.

**핵심 Variables:**
- `--color-terracotta: #E07A5F` (CTA, 배지)
- `--color-red: #E63946` (로고 GM)
- `--max-width: 1200px`, `--header-height: 80px`
- 반응형 브레이크포인트: `1024px`, `768px`, `480px`

## JS 아키텍처

- `js/main.js` — 기존 nav/modal/scroll 로직 전체 포함.
- `js/anim.js` — 애니메이션 전용 파일 (신규 구현 시 여기에 작성, 각 페이지에서 import).

**main.js 주요 패턴:**
- `.animate-on-scroll` 클래스 → IntersectionObserver로 `.fade-in` 추가 (one-time, `unobserve` 사용).
- 헤더: `scrollY > 50` 시 `.header` 에 `.scrolled` 클래스 토글.
- Contact Modal: `#contactModal`, 트리거는 `.open-contact-modal` 클래스 버튼.
- 솔루션 카드 클릭 네비게이션: `.solution-box`, `.solution-card` 에 `data-solution="solution-xxx.html"` 속성 사용.
- 카운트업 수치: `data-count="52.23"` 속성 패턴 사용.

## Must Implement (PDF 명세 기준)

1. **Frosted Glass GNB**: `scrollY > 50px` 시 blur/tint 전환 (0.3s).
2. **Sunlight Parallax**: 대각 그라디언트 광선 오버레이 — 스크롤 깊이에 따라 위치/각도 변화.
3. **Main Preloader**: 중앙 붉은 점 → 좌우 확장 → 화면 밝아짐 (짧게, 종료 후 DOM 제거).
4. **Hero Spotlight Text**: 단순 fade 금지 — 빛이 켜지듯 `text-shadow`/`brightness` 사용.
5. **Solutions Hover**: 텍스처 `scale(1.05)` + 테두리 하이라이트 sweep.
6. **Performance 카운트업**: 핵심 수치 카운트업 + 배경 화학 기호/분자 부유 애니메이션.

## 추가섹션 구성 작업 기획안

"추가섹션 구성 작업" 지시가 있을 때 아래 기획을 참조한다.

### 배경

각 솔루션 페이지에 실제 적용 권장 사항, 기존 실적, 시공 사례 사진을 추가하는 작업.

### 현재 솔루션 페이지 구조 (As-Is)

```
Hero → Problem → Solution → Benefits → Application → CTA
```

### 확장 후 구조 (To-Be)

```
Hero → Problem → Solution → Benefits → Application
→ [NEW] Specifications → [NEW] Track Record → [NEW] Case Studies → CTA
```

---

### Section A — Specifications (적용 권장 사항)

Badge: `"Specifications"` / 제목: `"권장 적용 기준"`

- **2열 레이아웃**: 좌(권장 대상: 기관 유형, 우선 시나리오, 비적합 사례) / 우(적용 조건: 면적 기준, 계절·환경, 병용 재료)
- **스펙 테이블**: 투입량(kg/m²) · 적용 두께(cm) · 혼합 비율(%) 등 항목별 기준값 표시, 가로 스크롤 대응
- CSS 클래스 네이밍 컨벤션: `.specs-table`, `.specs-grid`, `.specs-card`

**솔루션별 핵심 스펙 포인트:**

| 솔루션 | 주요 명시 항목 |
|--------|--------------|
| SoilAroma-G | 실내 마감재 평당 적용량, 공기질 기준치 |
| EcoRide-G | 노면 포장 두께, 하중 등급 |
| TechLane-G | 도로 등급별 배합 비율, 내구 년수 |
| EcoField-G | 운동장 면적 기준, PM 저감 수치 |
| GaiaCure-G | 작물별 투입량 표, 토양 pH 적정 범위 |

---

### Section B — Track Record (시공 실적)

Badge: `"Track Record"` / 제목: `"누적 시공 실적"`

- **카운트업 스탯 바**: performance 페이지의 `data-count` 패턴 재사용 — 납품 건수 · 총 시공 면적 · 적용 지역 수
- **클라이언트 섹션**: 로고 그리드(공개 가능 시) 또는 발주처 유형 태그(지자체 · 교육청 · 건설사 · 조경사 등)
- 실적 수치 미확보 시: "현재 파일럿 프로젝트 진행 중" 또는 "문의 시 레퍼런스 제공" 텍스트로 대체

---

### Section C — Case Studies (시공 사례)

Badge: `"Case Studies"` / 제목: `"시공 사례"`

**레이아웃 옵션 (우선순위 순):**

1. **카드 그리드 3열** — 기본, 구현 단순 / CSS 클래스: `.case-grid`, `.case-card`
2. **매거진 레이아웃** — 대표 사례 1개(넓음) + 서브 2개 / 시각적 임팩트 필요 시
3. **Before/After 슬라이더** — 드래그 핸들로 전후 비교 / 변화가 극적인 경우
4. **타임라인 형** — 시공 단계별 사진 순서가 중요한 경우

**케이스 카드 내 정보 구조:**
```
[시공 사진]
프로젝트명
위치: OO시 OO구 | 규모: 000 m²
적용량: 000 ton | 발주: OO기관
결과: 주요 성과 1줄
```

**시공 사진 유형 우선순위:**

| 유형 | 우선순위 |
|------|---------|
| 시공 중 현장 (투입→혼합→완성 과정) | 최우선 |
| 완공 후 전경 와이드샷 | 필수 |
| Before/After 동일 앵글 | 슬라이더 구현 시 필수 |
| 클로즈업 디테일 (질감·색상) | 중간 |
| 사용자 현장 사진 (학생·농부·작업자) | 스토리텔링용 |

---

### 전체 사이트 구조 확장 시나리오

| 옵션 | 조건 | 설명 |
|------|------|------|
| A. 기존 솔루션 페이지 확장 | 사례 수 적을 때 (권장) | 각 solution-xxx.html에 섹션 추가 |
| B. 전용 케이스 페이지 신설 | 사례 10건 이상 | cases.html 또는 projects.html, GNB에 "PROJECTS" 항목 추가, 솔루션별 필터 탭 |
| C. PERFORMANCE 페이지 확장 | 솔루션 구분 불필요 시 | performance.html에 Track Record + Case Studies 추가 |

### 구현 Phase

- **Phase 1**: Case Studies 카드 그리드 섹션 — 사진 플레이스홀더 포함 구조 먼저 잡기
- **Phase 2**: Track Record 카운트업 스탯 + Specifications 테이블
- **Phase 3**: 사례 수 증가 시 cases.html 전용 페이지 분리 + Before/After 슬라이더

---

## QA 체크리스트

- [ ] Console error 없음
- [ ] Nav 드롭다운 + Contact 모달 정상 동작
- [ ] 모바일 햄버거 메뉴 동작
- [ ] `prefers-reduced-motion` 시 무거운 애니메이션 비활성 확인
- [ ] 11개 페이지 모두 직접 파일 열기로 동작 확인
