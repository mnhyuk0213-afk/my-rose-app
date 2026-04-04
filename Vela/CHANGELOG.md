# VELA 개선 기록

> VELAANALYTICS.COM 프로젝트의 개선 사항을 추적하는 문서입니다.
> 배포 시마다 업데이트됩니다.

---

## 2026-04-04 — v1.3.0 신규 기능 8종 추가

### 1. 카카오톡 공유 (SDK 정식 연동)

**기존:** `sharer.kakao.com` 링크 방식 (비공식, 불안정)
**변경:** 카카오 JavaScript SDK v2.7.4 연동, `Kakao.Share.sendDefault()` 사용
**효과:** OG 이미지 포함 피드형 카카오톡 공유, SDK 미초기화 시 클립보드 폴백

| 파일 | 설명 |
|------|------|
| `components/KakaoShare.tsx` | **신규** — 재사용 가능한 카카오 공유 컴포넌트 |
| `app/result/page.tsx` | 수정 — 기존 인라인 공유를 KakaoShare 컴포넌트로 교체 |

### 2. 월별 매출·순이익 추이 차트 (대시보드)

**기존:** div 기반 단순 바 차트만 존재
**추가:** Recharts `LineChart`로 매출·순이익 6개월 추이 시각화
**효과:** 성장/하락 트렌드를 한눈에 파악, 만원 단위 표기로 가독성

| 파일 | 설명 |
|------|------|
| `app/dashboard/page.tsx` | 수정 — Recharts LineChart 추가 (스탠다드 이상) |

### 3. 손익분기 달성 D-day

**기존:** 손익분기점 미달 시 부족 금액만 표시
**추가:** BEP 미달 시 월 3% 성장 가정 D-day 카운트다운 + 일 평균 추가 매출/고객 수 표시
**효과:** 사장님에게 구체적 목표치 제공, 동기부여 극대화

| 파일 | 설명 |
|------|------|
| `app/result/page.tsx` | 수정 — BEP 미달 시 D-day 섹션 추가 |

### 4. PDF 브리핑 리포트

**기존:** AI 브리핑 결과를 화면에서만 확인 가능
**추가:** "PDF 저장" 버튼 → 새 창에 포매팅된 HTML 생성 → `window.print()` → PDF
**효과:** 세무사, 투자자, 파트너에게 전문적인 리포트 전달 가능

| 파일 | 설명 |
|------|------|
| `app/result/page.tsx` | 수정 — AI 브리핑 섹션에 PDF 저장 버튼 추가 |

### 5. A vs B 시나리오 비교 모드

**기존:** 민감도 분석 슬라이더 1세트만 존재
**추가:** A안(현재) vs B안(변경안) 두 세트의 슬라이더로 매출·순이익·실수령·순이익률 비교
**효과:** "객단가 올릴까 vs 원가율 낮출까" 같은 의사결정을 데이터로 지원

| 파일 | 설명 |
|------|------|
| `app/result/page.tsx` | 수정 — A vs B 비교 섹션 추가 |

### 6. 월간 리마인더 이메일 API

**기존:** 월간 뉴스레터만 존재
**추가:** `/api/reminder` — 이번 달 매출 미입력 유저에게 리마인더 이메일 발송
**효과:** 리텐션 향상, 데이터 입력률 증가

| 파일 | 설명 |
|------|------|
| `app/api/reminder/route.ts` | **신규** — 매출 미입력 유저 리마인더 이메일 |

### 7. 식재료 시세 연동

**기존:** 식재료 가격을 수동으로만 기록
**추가:** `/api/ingredient-price` API (18종 식재료 시세) + 트래커 페이지에 시세 위젯
**효과:** 시세 변동 한눈에 파악, 원가 관리에 즉각 반영

| 파일 | 설명 |
|------|------|
| `app/api/ingredient-price/route.ts` | **신규** — 식재료 시세 API (수동 관리, KAMIS 연동 준비) |
| `app/ingredient-tracker/page.tsx` | 수정 — 시세 요약 위젯 추가 |

### 8. 경쟁매장 실시간 비교 API

**기존:** 업종별 고정 벤치마크만 사용
**추가:** `/api/benchmark` — 실제 VELA 사용자 데이터 기반 업종별 평균 + 분포(상위 10%/30%/중위)
**효과:** "우리 매장이 상위 몇 %인지" 실시간 확인 가능

| 파일 | 설명 |
|------|------|
| `app/api/benchmark/route.ts` | **신규** — 사용자 데이터 기반 벤치마크 API |

### 9. 다국어 지원 (i18n 인프라)

**기존:** 한국어 하드코딩
**추가:** `lib/i18n.ts` — ko/en 번역 키 시스템 + NavBar에 언어 토글 버튼
**효과:** 영어권 사용자 접근 가능, 추후 페이지별 번역 점진 적용

| 파일 | 설명 |
|------|------|
| `lib/i18n.ts` | **신규** — 번역 키 시스템 (ko/en 약 60개 키) |
| `components/NavBar.tsx` | 수정 — 데스크톱/모바일 언어 토글 버튼 |

### 변경 파일 총정리

| 파일 | 변경 유형 |
|------|-----------|
| `components/KakaoShare.tsx` | **신규** |
| `app/api/reminder/route.ts` | **신규** |
| `app/api/ingredient-price/route.ts` | **신규** |
| `app/api/benchmark/route.ts` | **신규** |
| `lib/i18n.ts` | **신규** |
| `app/result/page.tsx` | 수정 — 카카오 공유 + D-day + PDF + A/B 비교 |
| `app/dashboard/page.tsx` | 수정 — LineChart 추이 차트 |
| `app/ingredient-tracker/page.tsx` | 수정 — 시세 위젯 |
| `components/NavBar.tsx` | 수정 — 언어 토글 |

---

## 2026-04-04 — v1.2.0 SEO·메타데이터·환경변수 검증

### 1. sitemap.xml 동적 생성

**문제:** sitemap이 없어 구글 크롤러가 사이트 구조를 파악 못함
**조치:** `app/sitemap.ts` 생성 — 공개 페이지 9개 + 도구 페이지 13개 + 핵심 기능 3개 = 총 25개 URL 등록
**효과:** 구글 Search Console 등록 즉시 크롤링 가능, SEO 인덱싱 효율 극대화

| 새로 생성된 파일 | 설명 |
|-----------------|------|
| `app/sitemap.ts` | 동적 sitemap 생성 (changeFrequency, priority 포함) |

### 2. robots.txt 생성

**문제:** 크롤러 가이드 부재 → API, 관리자, 비공개 페이지까지 크롤링 시도
**조치:** `app/robots.ts` 생성 — `/api/`, `/admin`, `/dashboard`, `/profile` 등 11개 비공개 경로 차단
**효과:** 크롤러가 공개 페이지에만 집중, 불필요한 크롤링 부하 방지, sitemap 자동 연결

| 새로 생성된 파일 | 설명 |
|-----------------|------|
| `app/robots.ts` | 크롤러 허용/차단 규칙 + sitemap 링크 |

### 3. OG 이미지 + favicon 동적 생성

**문제:** 카카오톡/SNS 공유 시 이미지 없이 텍스트만 노출, 브라우저 탭에 기본 아이콘
**조치:** `next/og`의 `ImageResponse`로 3가지 아이콘 동적 생성

| 파일 | 용도 | 크기 |
|------|------|------|
| `app/opengraph-image.tsx` | SNS 공유 시 미리보기 이미지 (VELA 로고 + 태그라인) | 1200x630 |
| `app/icon.tsx` | 브라우저 탭 favicon | 32x32 |
| `app/apple-icon.tsx` | iOS 홈 화면 아이콘 | 180x180 |

**효과:** 카톡/인스타/페이스북 공유 시 브랜딩 이미지 노출, 브라우저 탭에서 VELA 아이콘 표시

### 4. 페이지별 고유 메타데이터

**문제:** 모든 페이지가 동일한 title/description 공유 → 구글이 중복 콘텐츠로 인식, CTR 저하
**조치:** 주요 공개 페이지 7개에 전용 `layout.tsx` 생성하여 고유 메타데이터 설정

| 페이지 | title | 주요 키워드 |
|--------|-------|-------------|
| `/simulator` | 수익 시뮬레이터 — VELA | 손익계산, 세후 실수령, 손익분기점 |
| `/pricing` | 요금제 — VELA | 무료, 9900원, 29900원 |
| `/tools` | 경영 도구 모음 — VELA | 원가 계산기, AI 마케팅, 14가지 |
| `/community` | 사장님 커뮤니티 — VELA | 경영 노하우, 익명 상담, 벤치마크 |
| `/info` | 서비스 소개 — VELA | AI 경영 분석, 핵심 기능, 500+ 사장님 |
| `/guide` | 사용 가이드 — VELA | 사용법, 5분, 단계별 |
| `/benchmark` | 경쟁 매장 비교 — VELA | 업계 평균, 원가율, 순이익률 |

**효과:** 구글 검색 결과에서 페이지별 고유 제목/설명 표시 → CTR 향상, 롱테일 키워드 커버

### 5. 환경변수 검증 시스템

**문제:** 필수 환경변수 누락 시 런타임에서야 "API 키 없음" 에러 → 디버깅 어려움
**조치:** `lib/env.ts` 생성 — 서버 시작 시 4개 필수 + 4개 선택 환경변수 검증

| 구분 | 변수명 | 용도 |
|------|--------|------|
| 필수 | `NEXT_PUBLIC_SUPABASE_URL` | Supabase 연결 |
| 필수 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 인증 |
| 필수 | `SUPABASE_SERVICE_ROLE_KEY` | 서버 관리자 접근 |
| 필수 | `ANTHROPIC_API_KEY` | AI 기능 |
| 선택 | `TOSS_SECRET_KEY` | 결제 |
| 선택 | `RESEND_API_KEY` | 이메일 발송 |
| 선택 | `BOK_API_KEY` | 경제 지표 |
| 선택 | `ADMIN_EMAIL` | 관리자 접근 제어 |

- 프로덕션 런타임: 필수 누락 시 서버 시작 차단 (throw)
- 빌드 시: 경고만 출력 (빌드 통과)
- 개발 환경: 경고 출력

**효과:** 배포 후 "왜 안 되지?" 방지, env 설정 실수 즉시 발견

### 변경 파일 총정리

| 파일 | 변경 유형 |
|------|-----------|
| `app/sitemap.ts` | **신규** — 동적 sitemap |
| `app/robots.ts` | **신규** — 크롤러 가이드 |
| `app/opengraph-image.tsx` | **신규** — OG 이미지 |
| `app/icon.tsx` | **신규** — favicon |
| `app/apple-icon.tsx` | **신규** — iOS 아이콘 |
| `app/simulator/layout.tsx` | **신규** — 메타데이터 |
| `app/pricing/layout.tsx` | **신규** — 메타데이터 |
| `app/tools/layout.tsx` | **신규** — 메타데이터 |
| `app/community/layout.tsx` | **신규** — 메타데이터 |
| `app/info/layout.tsx` | **신규** — 메타데이터 |
| `app/guide/layout.tsx` | **신규** — 메타데이터 |
| `app/benchmark/layout.tsx` | **신규** — 메타데이터 |
| `lib/env.ts` | **신규** — 환경변수 검증 |
| `app/layout.tsx` | 수정 — OG 이미지 메타 + env import |

---

## 2026-04-04 — v1.1.0 보안·안정성·접근성 전면 개선

### 1. 레포지토리 정리

**문제:** 루트 디렉토리에 `(`, `void`, `setSaveMessage()` 등 의미 없는 0바이트 파일 14개 존재
**조치:** 전부 삭제
**효과:** 레포지토리 오염 제거, git 상태 깔끔해짐

### 2. 빌드 환경 수정

**문제:** 루트 `package-lock.json`이 Next.js Turbopack의 workspace root 감지를 방해하여 빌드 실패
**조치:** `next.config.ts`에 `turbopack.root` 설정 추가, `/api/home`에 `dynamic: "force-dynamic"` 추가
**효과:** 빌드 에러 해소, BOK API 키 빌드 시 노출 방지

| 변경 파일 | 내용 |
|-----------|------|
| `next.config.ts` | `turbopack.root: "."` 추가 |
| `app/api/home/route.ts` | `export const dynamic = "force-dynamic"` 추가 |

### 3. API 보안 강화 — Rate Limiting 전면 적용

**문제:** `tools/generate`를 제외한 9개 API 엔드포인트에 rate limiting 없음. 악의적 대량 요청에 무방비
**조치:** 공통 `lib/rate-limit.ts` 유틸리티 생성 후 전체 10개 API에 적용

| API 엔드포인트 | 제한 (분당) | 근거 |
|----------------|-------------|------|
| `/api/ai-strategy` | 5회 | AI 토큰 비용 보호 |
| `/api/briefing` | 5회 | AI 토큰 비용 보호 |
| `/api/chat` | 15회 | 대화형이므로 상대적 여유 |
| `/api/anon-ai-reply` | 5회 | AI 토큰 비용 보호 |
| `/api/parse-excel` | 5회 | AI 토큰 비용 보호 |
| `/api/contact` | 3회 | 스팸 방지 |
| `/api/newsletter` | 2회 | 관리자 전용, 남용 방지 |
| `/api/payment/confirm` | 3회 | 결제 남용 방지 |
| `/api/tools/generate` | 10회 | 기존 유지 (공통 유틸로 교체) |
| `/api/home` | 제한 없음 | 캐싱 기반, 부하 낮음 |

**효과:** AI API 남용 차단, 토큰 비용 폭발 방지, DDoS 기본 방어

| 새로 생성된 파일 | 설명 |
|-----------------|------|
| `lib/rate-limit.ts` | IP 기반 인메모리 rate limiter (엔드포인트별 독립 윈도우, Edge Runtime 호환) |

### 4. 입력값 검증 강화

**문제:** 일부 API에서 타입 검증 부족, 결제 API에 플랜 유효성 미검증
**조치:**

| 파일 | 추가된 검증 |
|------|------------|
| `app/api/contact/route.ts` | 이메일 정규식 검증 (`EMAIL_REGEX`) |
| `app/api/payment/confirm/route.ts` | `paymentKey`, `orderId`, `amount` 타입 검증 + 유효 플랜(`standard`/`pro`) 검증 |
| `app/api/chat/route.ts` | `req.json()` 파싱 실패 시 안전한 에러 반환 (`.catch(() => null)`) |

**효과:** 잘못된 요청으로 인한 서버 크래시 방지, 결제 위변조 방어

### 5. 에러 처리 및 타임아웃

**문제:** AI API 호출 시 타임아웃 없음 → Anthropic 서버 지연 시 클라이언트 무한 대기. 스트리밍 에러 핸들링 부재
**조치:** 모든 AI API에 `AbortController` 기반 타임아웃 적용, 에러 유형별 분기 처리

| API | 타임아웃 | 에러 분기 |
|-----|----------|-----------|
| `chat` | 30초 | 타임아웃 → 504, 연결 실패 → 502, Anthropic 429 → "서비스 바쁨" |
| `ai-strategy` | 25초 | 동일 패턴 |
| `briefing` | 25초 | 동일 패턴 |
| `parse-excel` | 30초 | 동일 패턴 (큰 데이터 처리 고려) |
| `tools/generate` | 25초 | 동일 패턴 |

**추가:** `chat` 라우트에 전체 try-catch 래핑 + 스트림 리더 에러 핸들링

**효과:** 사용자에게 명확한 에러 메시지 표시, 무한 로딩 방지, Anthropic 장애 시 graceful degradation

### 6. 성능 최적화

**문제:** 커뮤니티 페이지에서 `select("*")`로 불필요한 컬럼까지 전부 조회, 메뉴 저장 페이지에 limit 없음
**조치:**

| 파일 | 변경 |
|------|------|
| `app/community/page.tsx` | `simulation_shares` → 필요 8개 컬럼만 select |
| `app/community/page.tsx` | `posts` → 필요 8개 컬럼만 select |
| `app/community/page.tsx` | `anonymous_posts` → 필요 7개 컬럼만 select |
| `app/tools/menu-cost/saved/page.tsx` | `.limit(200)` 추가 |

**효과:** 네트워크 전송량 감소, Supabase 쿼리 응답 속도 개선

### 7. 데이터 무결성 강화

**문제:** 결제 성공 후 `profiles.plan` 업데이트가 `.then()` 안에서 에러를 삼키고 있어, 사용자가 돈을 냈는데 플랜이 안 바뀌는 상황 발생 가능
**조치:**
- 플랜 업데이트 실패 시 `warning` 메시지를 응답에 포함하여 사용자에게 안내
- `plan_updated_at` 타임스탬프 기록 (디버깅용)
- orderId에서 파싱한 플랜이 `standard`/`pro`가 아니면 조기 차단

**효과:** 결제 ↔ 플랜 불일치 감지 가능, 사용자에게 명확한 안내, CS 대응 시간 단축

### 8. UI/UX 접근성(a11y) 개선

**문제:** 주요 인터랙티브 요소에 ARIA 속성 전무 → 스크린 리더 사용자 접근 불가
**조치:**

| 컴포넌트 | 추가된 속성 |
|----------|------------|
| `NavBar.tsx` | `role="navigation"`, `aria-label="메인 내비게이션"`, 모바일 메뉴에 `role="menu"` + `aria-hidden`, 햄버거 버튼에 `aria-expanded` |
| `VelaChat.tsx` | 플로팅 버튼에 `aria-label` + `aria-expanded`, 채팅 창에 `role="dialog"` + `aria-label`, 메시지 영역에 `role="log"` + `aria-live="polite"`, 닫기/전송 버튼에 `aria-label` |
| `loading.tsx` | `role="status"`, `aria-label="로딩 중"`, 스크린 리더용 숨김 텍스트 |

**효과:** 웹 접근성 기준 준수 (WCAG 2.1), 스크린 리더 사용자 내비게이션 가능

### 9. 코드 정리 — 중복 제거 및 상수 통합

**문제:**
- `industryLabels` 객체가 6개 파일에서 각각 중복 정의
- `PLAN_PRICES`가 `plans.ts`와 `payment/confirm`에 이중 정의
- `tools/generate`에 자체 rate limiter가 공통과 별도로 존재

**조치:**

| 변경 | 대상 파일 |
|------|-----------|
| `INDUSTRY_LABELS`를 `lib/vela.ts`에 추가 | 5개 API에서 import로 교체 |
| `PLAN_PRICES`를 `lib/plans.ts`에 추가 | `payment/confirm`에서 import로 교체 |
| `tools/generate`의 자체 rate limiter 삭제 | 공통 `lib/rate-limit.ts` 사용으로 교체 |

**효과:** 가격·업종명 변경 시 한 곳만 수정하면 전체 반영, 코드 유지보수성 향상

---

### 변경 파일 총정리

| 파일 | 변경 유형 |
|------|-----------|
| `lib/rate-limit.ts` | **신규** — 공통 rate limiter |
| `lib/vela.ts` | 수정 — `INDUSTRY_LABELS` 추가 |
| `lib/plans.ts` | 수정 — `PLAN_PRICES` 추가 |
| `next.config.ts` | 수정 — turbopack root 설정 |
| `app/loading.tsx` | 수정 — 접근성 속성 |
| `app/api/ai-strategy/route.ts` | 수정 — rate limit + timeout + 상수 통합 |
| `app/api/briefing/route.ts` | 수정 — rate limit + timeout + 상수 통합 |
| `app/api/chat/route.ts` | 수정 — rate limit + timeout + try-catch + 상수 통합 |
| `app/api/anon-ai-reply/route.ts` | 수정 — rate limit + 상수 통합 |
| `app/api/parse-excel/route.ts` | 수정 — rate limit + timeout + 상수 통합 |
| `app/api/contact/route.ts` | 수정 — rate limit + 이메일 검증 |
| `app/api/newsletter/route.ts` | 수정 — rate limit |
| `app/api/payment/confirm/route.ts` | 수정 — rate limit + 타입 검증 + 플랜 검증 + 무결성 |
| `app/api/tools/generate/route.ts` | 수정 — 공통 rate limiter로 교체 + timeout |
| `app/api/home/route.ts` | 수정 — dynamic 설정 |
| `app/community/page.tsx` | 수정 — select 최적화 |
| `app/tools/menu-cost/saved/page.tsx` | 수정 — limit 추가 |
| `components/NavBar.tsx` | 수정 — 접근성 속성 |
| `components/VelaChat.tsx` | 수정 — 접근성 속성 |
