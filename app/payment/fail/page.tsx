"use client";

// app/payment/fail/page.tsx

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message") ?? "결제가 취소되었거나 오류가 발생했습니다.";
  const code = searchParams.get("code");

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-3xl shadow-sm ring-1 ring-slate-200 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 text-3xl">✕</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">결제 실패</h1>
      <p className="text-slate-500 mb-2">{message}</p>
      {code && <p className="text-xs text-slate-400 mb-8">오류 코드: {code}</p>}
      <button
        onClick={() => router.push("/pricing")}
        className="w-full rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
      >
        요금제로 돌아가기
      </button>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <Suspense fallback={
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-3xl shadow-sm ring-1 ring-slate-200 text-center">
          <p className="text-slate-600">로딩 중...</p>
        </div>
      }>
        <PaymentFailContent />
      </Suspense>
    </main>
  );
}
