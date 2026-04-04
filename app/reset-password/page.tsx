"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Supabase는 리셋 링크 클릭 시 자동으로 세션을 설정함
  // URL에 access_token이 hash로 올 수도 있음
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    // hash fragment에서 토큰 처리 (Supabase 기본 동작)
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      // Supabase 클라이언트가 자동으로 세션을 처리함
    }
  }, []);

  const handleReset = async () => {
    if (!password || password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message === "Auth session missing!"
        ? "세션이 만료되었습니다. 비밀번호 재설정 이메일을 다시 요청해주세요."
        : error.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    setTimeout(() => router.push("/"), 2000);
  };

  if (done) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200 p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">비밀번호 변경 완료</h1>
          <p className="text-sm text-slate-500 mb-6">잠시 후 홈으로 이동합니다.</p>
          <Link href="/" className="text-sm text-blue-500 font-semibold">홈으로 가기 →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200 p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-900">비밀번호 재설정</h1>
          <p className="text-sm text-slate-500 mt-1">새 비밀번호를 입력해주세요.</p>
        </div>

        <div className="space-y-3">
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호 (6자 이상)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white transition"
          />
          <input
            type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            placeholder="비밀번호 확인"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white transition"
          />
          {error && <p className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
          <button
            onClick={handleReset} disabled={loading}
            className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          <Link href="/login" className="text-slate-600 underline">로그인으로 돌아가기</Link>
        </p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>;
}
