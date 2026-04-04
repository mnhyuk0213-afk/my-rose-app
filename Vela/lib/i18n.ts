/**
 * VELA i18n — 경량 다국어 지원
 *
 * 사용법:
 *   const t = useTranslation();
 *   t("nav.tools") → "도구" (ko) / "Tools" (en)
 */

export type Locale = "ko" | "en";

const translations: Record<Locale, Record<string, string>> = {
  ko: {
    // 네비게이션
    "nav.service": "서비스",
    "nav.tools": "도구",
    "nav.community": "커뮤니티",
    "nav.guide": "가이드",
    "nav.pricing": "요금제",
    "nav.login": "로그인",
    "nav.signup": "무료 시작",
    "nav.logout": "로그아웃",
    "nav.dashboard": "대시보드",
    "nav.simulator": "시뮬레이터 →",
    "nav.menu": "메뉴",

    // 공통
    "common.loading": "로딩 중...",
    "common.error": "오류가 발생했습니다",
    "common.retry": "다시 시도",
    "common.save": "저장",
    "common.cancel": "취소",
    "common.delete": "삭제",
    "common.edit": "수정",
    "common.close": "닫기",
    "common.confirm": "확인",
    "common.search": "검색",
    "common.won": "원",
    "common.month": "월",

    // 랜딩
    "landing.hero.title": "외식업 사장님을 위한\n숫자 경영 파트너",
    "landing.hero.subtitle": "매출·원가·인건비를 한 번에 시뮬레이션하고\nAI 맞춤 전략을 받아보세요",
    "landing.hero.cta": "무료로 시작하기",
    "landing.hero.demo": "3초 체험해보기",

    // 시뮬레이터
    "sim.title": "수익 시뮬레이터",
    "sim.step1": "매출 정보",
    "sim.step2": "비용 구조",
    "sim.step3": "초기 투자",
    "sim.seats": "좌석 수",
    "sim.avgSpend": "객단가",
    "sim.turnover": "회전율",
    "sim.calculate": "계산하기",

    // 결과
    "result.totalSales": "월 총 매출",
    "result.profit": "세전 순이익",
    "result.netProfit": "세후 실수령",
    "result.cashFlow": "현금흐름",
    "result.bep": "손익분기점",
    "result.recovery": "투자금 회수",

    // 요금제
    "pricing.free": "무료",
    "pricing.standard": "스탠다드",
    "pricing.pro": "프로",
    "pricing.perMonth": "원/월",
    "pricing.startFree": "무료로 시작",
  },

  en: {
    // Navigation
    "nav.service": "Service",
    "nav.tools": "Tools",
    "nav.community": "Community",
    "nav.guide": "Guide",
    "nav.pricing": "Pricing",
    "nav.login": "Log in",
    "nav.signup": "Start Free",
    "nav.logout": "Log out",
    "nav.dashboard": "Dashboard",
    "nav.simulator": "Simulator →",
    "nav.menu": "Menu",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.retry": "Retry",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.confirm": "Confirm",
    "common.search": "Search",
    "common.won": "KRW",
    "common.month": "mo",

    // Landing
    "landing.hero.title": "Smart Business Partner\nfor Restaurant Owners",
    "landing.hero.subtitle": "Simulate revenue, costs & labor at once.\nGet AI-powered strategy recommendations.",
    "landing.hero.cta": "Start for Free",
    "landing.hero.demo": "Try in 3 seconds",

    // Simulator
    "sim.title": "Revenue Simulator",
    "sim.step1": "Revenue Info",
    "sim.step2": "Cost Structure",
    "sim.step3": "Initial Investment",
    "sim.seats": "Seats",
    "sim.avgSpend": "Avg. Spend",
    "sim.turnover": "Turnover Rate",
    "sim.calculate": "Calculate",

    // Results
    "result.totalSales": "Monthly Revenue",
    "result.profit": "Pre-tax Profit",
    "result.netProfit": "After-tax Income",
    "result.cashFlow": "Cash Flow",
    "result.bep": "Break-even Point",
    "result.recovery": "Payback Period",

    // Pricing
    "pricing.free": "Free",
    "pricing.standard": "Standard",
    "pricing.pro": "Pro",
    "pricing.perMonth": "/mo",
    "pricing.startFree": "Start Free",
  },
};

const LOCALE_KEY = "vela-locale";

export function getLocale(): Locale {
  if (typeof window === "undefined") return "ko";
  return (localStorage.getItem(LOCALE_KEY) as Locale) ?? "ko";
}

export function setLocale(locale: Locale) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCALE_KEY, locale);
    window.location.reload();
  }
}

export function t(key: string, locale?: Locale): string {
  const l = locale ?? getLocale();
  return translations[l]?.[key] ?? translations.ko[key] ?? key;
}

/** React hook for translations */
export function useTranslation() {
  const locale = typeof window !== "undefined" ? getLocale() : "ko";
  return (key: string) => t(key, locale);
}
