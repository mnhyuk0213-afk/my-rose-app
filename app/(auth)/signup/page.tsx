"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const supabase = createSupabaseBrowserClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("비밀번호는 8자 이상이어야 합니다."); return; }
    setLoading(true); setError("");

    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });

    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
  }

  if (done) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-6">📬</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">이메일을 확인해주세요</h1>
          <p className="text-slate-500 mb-6">
            <span className="font-semibold text-slate-700">{email}</span>로<br />
            인증 링크를 보내드렸습니다.
          </p>
          <Link href="/login" className="inline-block rounded-2xl bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white">
            로그인 페이지로
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-bold text-slate-900">VELA</span>
            <span className="font-serif text-3xl font-bold text-amber-600">.</span>
          </Link>
          <p className="mt-2 text-sm text-slate-500">무료로 시작하세요</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200 p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">이름</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="홍길동" required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">이메일</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">비밀번호</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상" required minLength={8}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white transition"
              />
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full rounded-2xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-semibold text-slate-700 underline underline-offset-2">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
