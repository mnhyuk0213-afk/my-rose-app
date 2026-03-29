"use client";

// app/payment/success/page.tsx

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      setMessage("결제 정보가 올바르지 않습니다.");
      return;
    }

    fetch("/api/payment/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setStatus("ok");
        else { setStatus("error"); setMessage(data.error ?? "결제 승인 중 오류가 발생했습니다."); }
      })
      .catch(() => { setStatus("error"); setMessage("네트워크 오류가 발생했습니다."); });
  }, [searchParams]);

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-3xl shadow-sm ring-1 ring-slate-200 text-center">
      {status === "loading" && (
        <>
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-slate-600">결제를 처리하고 있습니다...</p>
        </>
      )}
      {status === "ok" && (
        <>
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">결제 완료!</h1>
          <p className="text-slate-500 mb-8">구독이 활성화되었습니다. VELA를 마음껏 이용하세요.</p>
          <button onClick={() => router.push("/simulator")} className="w-full rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600">
            시작하기 →
          </button>
        </>
      )}
      {status === "error" && (
        <>
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 text-3xl">✕</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">결제 실패</h1>
          <p className="text-slate-500 mb-8">{message}</p>
          <button onClick={() => router.push("/pricing")} className="w-full rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            요금제로 돌아가기
          </button>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <Suspense fallback={
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-3xl shadow-sm ring-1 ring-slate-200 text-center">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-slate-600">로딩 중...</p>
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
}
