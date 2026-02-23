# SMGM 기업 웹사이트

**주식회사 에스엠골드마인 (SMGM) 공식 웹사이트**

지속 가능한 지구의 내일을 설계하는 천연 기능성 광물질 규격화 소재 전문 기업

---

## 📋 프로젝트 개요

SMGM 웹사이트는 천연 기능성 광물질을 규격화(CORElite-G 시스템)하여 공급하는 소재 전문 기업의 공식 홈페이지입니다. 5가지 핵심 솔루션을 통해 맨발걷기길, 자전거 도로, 버스전용차로, 학교 운동장, 농업 토양개량 등 다양한 분야에 친환경 고기능성 소재를 제공합니다.

### 주요 기술 스택
- **HTML5**: 시맨틱 마크업
- **CSS3**: 반응형 디자인, CSS Variables
- **JavaScript (Vanilla)**: 인터랙션 및 모달 처리
- **Google Fonts**: Noto Sans KR

---

## ✅ 현재 완성된 기능

### 🏠 **메인 페이지 (index.html)**
- 히어로 섹션: SMK CORElite-G 브랜드 소개
- 5가지 솔루션 카드 (클릭 시 상세 페이지 이동)
- 회사 소개 섹션
- 제품 성능 데이터 (원적외선 방사율 0.93, 유지보수비 73% 절감 등)
- 최신 뉴스 카드 (더미 데이터)
- CTA 섹션 (CONTACT 모달 연동)

### 🏢 **COMPANY 페이지 (company.html)**
- 회사 슬로건: "Standardizing Earth Performance."
- 3가지 핵심 경쟁력:
  - Material: 천연 원석 기반 원자재
  - Supply: 채취 완료 물량 보유로 가격 경쟁력 확보
  - Standard: CORElite 표준 시스템
- 5가지 솔루션 링크 박스

### 🎨 **BRAND 페이지 (brand.html)**
- **섹션 1**: Brand Essence (CORE, EARTH, PROOF)
- **섹션 2**: Proof First (공인기관 인증, 성능 데이터, 현장 검증)
- **섹션 3**: Brand Signature (G, GE, 地 코드 설명)
- **섹션 4**: Solution Family (5가지 솔루션 패밀리)
- **섹션 5**: Public Fit (Eco, Tech, Geo 특징)

### 🔧 **SOLUTION 페이지 (solutions.html)**
- 5가지 솔루션 상세 소개:
  - SoilAroma-G: 맨발걷기길 (유지보수비 73% 절감, 원적외선 방사율 0.93)
  - EcoRide-G: 자전거 도로 (고내구성, 색상 유지력)
  - TechLane-G: 버스전용차로 (건설신기술 제998호, 내구수명 3배 향상)
  - EcoField-G: 학교 운동장 (PM 저감, 유지관리비 절감)
  - GaiaCure-G: 토양개량제 (작물 생육 촉진, 지속가능한 농업)
- 도입 프로세스 4단계 (문의·상담 → 제안서 제공 → 검토·승인 → 소재 공급)

### 📊 **PERFORMANCE 페이지 (performance.html)**
- **섹션 1**: 성능 개요 (K₂O 7.07%, Fe₂O₃ 8.66%, 원적외선 방사율 0.922)
- **섹션 2**: 성분 분석 (기본 성분 및 기능성 성분)
- **섹션 3**: Performance Test (원적외선 방사율, 전기 절연성)
- **섹션 4**: Safety Test (중금속 불검출, 항균·탈취 효과)

### 📰 **NEWS 페이지 (news.html)**
- 6개 뉴스 카드 (더미 데이터)
- 뉴스 항목: 친환경 소재 기술, 건설신기술 인증, 맨발걷기길 확대, 학교 운동장 개선, 자전거도로 완료, 농업 토양개량제 출시

### 🌱 **개별 솔루션 상세 페이지 (5개)**
1. **solution-soilaroma.html**: SoilAroma-G 맨발걷기길
2. **solution-ecoride.html**: EcoRide-G 자전거 도로
3. **solution-techlane.html**: TechLane-G 버스전용차로
4. **solution-ecofield.html**: EcoField-G 학교 운동장
5. **solution-gaiacure.html**: GaiaCure-G 토양개량제

각 페이지 구성:
- 히어로 섹션 (배경 이미지 포함)
- 4가지 핵심 특징
- 적용 분야 3가지
- CTA 섹션

### 🧩 **공통 컴포넌트**
- **헤더 네비게이션**:
  - 상단 고정 (sticky)
  - 드롭다운 메뉴 (SOLUTION 클릭 시 5개 솔루션 표시)
  - 모바일 햄버거 메뉴
  - CONTACT 버튼 (테라코타 배경)
- **CONTACT 모달**:
  - 이름/담당자, 이메일, 연락처, 관심 솔루션, 문의 내용 입력
  - 폼 제출 시 alert 메시지
  - ESC 키 또는 외부 클릭 시 닫기
- **Footer**:
  - SMGM 로고 (GM은 빨강색)
  - 태그라인: "SMGM의 CORElite-G(e)은 지속가능한 지구의 내일에 기여합니다."
  - 저작권 정보 및 사업자 정보

---

## 🗂️ 프로젝트 구조

```
smgm-website/
├── index.html                  # 메인 페이지
├── company.html                # 회사 소개
├── brand.html                  # 브랜드 페이지
├── solutions.html              # 솔루션 개요
├── performance.html            # 성능 분석
├── news.html                   # 뉴스
├── solution-soilaroma.html     # SoilAroma-G 상세
├── solution-ecoride.html       # EcoRide-G 상세
├── solution-techlane.html      # TechLane-G 상세
├── solution-ecofield.html      # EcoField-G 상세
├── solution-gaiacure.html      # GaiaCure-G 상세
├── css/
│   ├── style.css              # 기본 스타일 및 유틸리티
│   ├── components.css         # 네비게이션, Footer, 모달
│   └── pages.css              # 페이지별 스타일
├── js/
│   └── main.js                # JavaScript 로직
└── README.md                  # 프로젝트 문서
```

---

## 🎨 디자인 시스템

### 색상 팔레트
- **테라코타**: `#E07A5F` (배지, CTA 버튼, 강조)
- **빨강 (GM)**: `#E63946` (로고 GM 부분)
- **블랙**: `#1a1a1a` (본문 텍스트)
- **화이트**: `#ffffff` (배경)
- **그레이 라이트**: `#f5f5f5` (섹션 배경)

### 타이포그래피
- **폰트**: Noto Sans KR
- **본문**: 16px
- **H1**: 36px
- **H2**: 22px
- **H3**: 12px (배지용, 대문자)

### 레이아웃
- **최대 너비**: 1200px
- **헤더 높이**: 80px
- **섹션 간격**: 48px ~ 120px
- **반응형 브레이크포인트**: 1024px, 768px, 480px

---

## 🌐 페이지별 URI 및 주요 기능

### 메인 네비게이션 URI
| 페이지 | URI | 설명 |
|-------|-----|------|
| 메인 | `/index.html` | 랜딩 페이지, 솔루션 소개 |
| 회사 | `/company.html` | 회사 소개, 핵심 경쟁력 |
| 브랜드 | `/brand.html` | 브랜드 철학 및 시스템 |
| 솔루션 | `/solutions.html` | 5가지 솔루션 개요 |
| 성능 | `/performance.html` | 성능 데이터 및 시험 결과 |
| 뉴스 | `/news.html` | 최신 소식 및 프로젝트 |

### 솔루션 상세 페이지 URI
| 솔루션 | URI | 적용 분야 |
|-------|-----|----------|
| SoilAroma-G | `/solution-soilaroma.html` | 맨발걷기길, 놀이터, 산책로 |
| EcoRide-G | `/solution-ecoride.html` | 자전거 도로, 친환경 인프라 |
| TechLane-G | `/solution-techlane.html` | 버스전용차로, SCA 공법 |
| EcoField-G | `/solution-ecofield.html` | 학교 운동장, 체육시설 |
| GaiaCure-G | `/solution-gaiacure.html` | 토양 개량, 친환경 농업 |

---

## 🚧 향후 개발 권장사항

### 우선순위 높음
1. **실제 이미지 교체**
   - 현재: 더미 이미지 플레이스홀더
   - 필요: 맨발걷기길, 자전거 도로, 운동장, 농장 등 실제 프로젝트 사진
   - 제공된 이미지 URL 활용 (solution 페이지 히어로 배경에 일부 적용됨)

2. **뉴스 콘텐츠 업데이트**
   - 현재: 6개 더미 뉴스 데이터
   - 필요: 실제 보도자료, 프로젝트 사례, 블로그 콘텐츠

3. **프로젝트 사례 추가**
   - PERFORMANCE 페이지에 실제 시공 사례 사진 및 설명
   - 공공기관 프로젝트 포트폴리오

### 우선순위 중간
4. **시험성적서 PDF 다운로드**
   - PERFORMANCE 페이지에 시험성적서 PDF 다운로드 링크 추가

5. **다국어 지원**
   - 한글/영문 전환 기능
   - 글로벌 고객 대응

6. **SEO 최적화**
   - 메타 태그 강화
   - Open Graph, Twitter Card 추가
   - sitemap.xml 생성

### 우선순위 낮음
7. **애니메이션 강화**
   - 스크롤 애니메이션 (AOS 라이브러리 도입 검토)
   - 페이지 전환 효과

8. **CMS 연동**
   - 뉴스 관리 시스템
   - 프로젝트 관리 시스템

9. **채팅 상담**
   - 실시간 채팅 위젯 추가

---

## 💻 로컬 개발 가이드

### 실행 방법
1. 프로젝트 폴더를 로컬에 다운로드
2. `index.html`을 브라우저에서 열기
3. 또는 로컬 서버 실행:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (http-server)
   npx http-server -p 8000
   ```
4. 브라우저에서 `http://localhost:8000` 접속

### 수정 가이드
- **색상 변경**: `css/style.css`의 `:root` CSS Variables 수정
- **폰트 변경**: `<head>` 내 Google Fonts 링크 교체 및 CSS Variables 수정
- **콘텐츠 수정**: 각 HTML 파일에서 텍스트 직접 수정
- **이미지 추가**: `<img>` 태그 또는 `background-image` CSS 속성 수정

---

## 📱 반응형 디자인

모든 페이지는 다음 디바이스에 최적화되어 있습니다:
- **데스크톱**: 1920px 이상
- **태블릿**: 768px ~ 1024px
- **모바일**: 480px 이하

---

## 🔗 외부 링크 및 의존성

- **Google Fonts**: Noto Sans KR (CDN)
- **이미지**: 제공된 URL (GenSpark API)
- **의존성 없음**: jQuery, Bootstrap 등 외부 라이브러리 미사용

---

## 📄 라이선스

© 2025 주식회사 에스엠골드마인 (SMGM). All rights reserved.  
사업자등록번호: 702-86-03387 | 대표: 박수운

All content including text, images, design, and logos are protected by copyright law. Unauthorized reproduction, distribution, or derivative works are strictly prohibited.

---

## 📞 문의

웹사이트 관련 문의는 CONTACT 모달을 통해 전송하거나, 아래 정보를 참고해주세요.

**주식회사 에스엠골드마인 (SMGM)**  
대표: 박수운  
사업자등록번호: 702-86-03387

---

## ✅ 최종 체크리스트

- [x] 11개 페이지 완성
- [x] 반응형 디자인 적용
- [x] 네비게이션 드롭다운 구현
- [x] CONTACT 모달 구현
- [x] 모바일 햄버거 메뉴
- [x] 스크롤 시 헤더 고정
- [x] 솔루션 카드 클릭 네비게이션
- [x] CSS 변수 시스템
- [x] 접근성 고려 (시맨틱 HTML)
- [ ] 실제 이미지 교체 (향후 작업)
- [ ] 뉴스 콘텐츠 업데이트 (향후 작업)
- [ ] SEO 최적화 (향후 작업)

---

**제작 완료일**: 2026-02-21  
**버전**: 1.0.0  
**상태**: 프로덕션 준비 완료 ✅
