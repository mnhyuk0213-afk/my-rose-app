"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import { fmt } from "@/lib/vela";
import type { User } from "@supabase/supabase-js";

type HistoryRow = {
  id: string;
  label: string;
  created_at: string;
  result: {
    totalSales: number;
    profit: number;
    netProfit: number;
    netMargin: number;
    bep: number;
    recoveryMonthsActual: number;
  };
  form: { industry: string };
};

const industryIcon: Record<string, string> = {
  cafe: "☕", restaurant: "🍽️", bar: "🍺", finedining: "✨",
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("simulation_history")
        .select("id, label, created_at, result, form")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      setHistory(data ?? []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function deleteHistory(id: string) {
    await supabase.from("simulation_history").delete().eq("id", id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <Link href="/simulator" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
            ← 시뮬레이터로
          </Link>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">VELA.</span>
        </div>

        {/* 프로필 카드 */}
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-slate-900 flex items-center justify-center text-white text-xl font-bold">
              {user?.user_metadata?.full_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">
                {user?.user_metadata?.full_name ?? "사용자"}
              </p>
              <p className="text-sm text-slate-400">{user?.email ?? user?.phone}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="ml-auto rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              로그아웃
            </button>
          </div>
        </section>

        {/* 히스토리 */}
        <section className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">시뮬레이션 히스토리</h2>
            <p className="text-sm text-slate-400 mt-1">저장된 분석 결과 최대 20개</p>
          </div>

          {history.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-3xl mb-3">📊</p>
              <p className="text-slate-500 text-sm">아직 저장된 시뮬레이션이 없습니다.</p>
              <Link href="/simulator" className="mt-4 inline-block rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
                시뮬레이터 시작
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {history.map((h) => (
                <li key={h.id} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition">
                  <span className="text-2xl">{industryIcon[h.form?.industry] ?? "📊"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{h.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(h.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <div className="flex gap-3 mt-2 flex-wrap">
                      <span className="text-xs text-slate-600">매출 <b>{fmt(h.result.totalSales)}원</b></span>
                      <span className={`text-xs font-semibold ${h.result.netProfit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        실수령 {fmt(h.result.netProfit)}원
                      </span>
                      <span className="text-xs text-slate-400">순이익률 {h.result.netMargin.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/result?historyId=${h.id}`}
                      className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                    >
                      보기
                    </Link>
                    <button
                      onClick={() => deleteHistory(h.id)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
