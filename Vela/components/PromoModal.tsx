"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PROMO_KEY = "vela-promo-dismissed";
const PROMO_ID = "launch-2026-04"; // 프로모션 변경 시 ID만 바꾸면 다시 표시
const PROMO_TODAY_KEY = "vela-promo-today";

export default function PromoModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 영구 닫기 체크
    const dismissed = localStorage.getItem(PROMO_KEY);
    if (dismissed === PROMO_ID) return;
    // 오늘 하루 안보기 체크
    const todayDismissed = localStorage.getItem(PROMO_TODAY_KEY);
    if (todayDismissed === new Date().toISOString().slice(0, 10)) return;
    // 페이지 로드 후 0.5초 뒤 표시 (자연스러운 진입)
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(PROMO_KEY, PROMO_ID);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4" onClick={dismiss}>
      <div
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn 0.3s ease-out" }}
      >
        {/* 상단 그라데이션 */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 pt-8 pb-6 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-extrabold text-white leading-tight">
            출시 기념 이벤트
          </h2>
          <p className="text-blue-200 text-sm mt-2">지금 가입하면 모든 기능이 무료!</p>
        </div>

        {/* 본문 */}
        <div className="px-6 py-6 space-y-4">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-center">
            <p className="text-lg font-extrabold text-amber-700">스탠다드 플랜 1개월 무료</p>
            <p className="text-xs text-amber-600 mt-1">회원가입만 하면 자동 적용 · 카드 등록 없음</p>
          </div>

          <div className="space-y-2">
            {[
              "수익 시뮬레이터 무제한",
              "AI 브리핑 & 전략 추천 무제한",
              "AI 도구 (SNS · 리뷰 · 상권) 무제한",
              "POS 분석 · 손익계산서 PDF",
              "대시보드 · 월별 매출 관리",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="text-blue-500 text-base">✓</span>
                {f}
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400">
            이벤트 기간: 2026.04.04 ~ 2026.05.04
          </p>

          <Link
            href="/signup"
            onClick={dismiss}
            className="block w-full rounded-2xl bg-blue-600 py-4 text-center text-base font-bold text-white hover:bg-blue-700 transition"
          >
            지금 무료로 시작하기 →
          </Link>

          <button
            onClick={() => {
              localStorage.setItem(PROMO_TODAY_KEY, new Date().toISOString().slice(0, 10));
              setShow(false);
            }}
            className="block w-full text-center text-sm text-slate-400 hover:text-slate-600 py-1"
          >
            오늘 하루 안 보기
          </button>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={dismiss}
          aria-label="닫기"
          className="absolute top-4 right-4 text-white/70 hover:text-white text-xl leading-none"
        >
          &times;
        </button>

        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
