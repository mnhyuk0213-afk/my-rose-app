"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

type Tab = "dashboard" | "mett" | "kpi" | "goal" | "task" | "aar";
type Mett = { id: string; mission: string; enemy: string; terrain: string; troops: string; time_constraint: string; civil: string; created_at: string };
type Metric = { id: string; date: string; revenue: number; users_count: number; conversion_rate: number; profit: number };
type Goal = { id: string; title: string; target_value: number; current_value: number; metric_type: string; start_date: string; end_date: string; status: string };
type Task = { id: string; goal_id: string | null; title: string; assignee: string; deadline: string; status: string; result: string };
type AAR = { id: string; date: string; goal: string; result: string; gap_reason: string; improvement: string };

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "dashboard", label: "현황", icon: "📋" },
  { key: "mett", label: "상황판단", icon: "🎯" },
  { key: "kpi", label: "KPI", icon: "📊" },
  { key: "goal", label: "목표", icon: "🏆" },
  { key: "task", label: "태스크", icon: "✅" },
  { key: "aar", label: "AAR", icon: "📝" },
];

const fmt = (n: number) => n.toLocaleString("ko-KR");
const ST: Record<string, { bg: string; label: string }> = {
  active: { bg: "bg-blue-100 text-blue-700", label: "진행" },
  completed: { bg: "bg-emerald-100 text-emerald-700", label: "완료" },
  failed: { bg: "bg-red-100 text-red-700", label: "실패" },
  pending: { bg: "bg-slate-100 text-slate-600", label: "대기" },
  in_progress: { bg: "bg-amber-100 text-amber-700", label: "진행" },
};

export default function HQPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [msg, setMsg] = useState("");

  const [metts, setMetts] = useState<Mett[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aars, setAars] = useState<AAR[]>([]);

  const [mettForm, setMettForm] = useState({ mission: "", enemy: "", terrain: "", troops: "", time_constraint: "", civil: "" });
  const [metricForm, setMetricForm] = useState({ date: new Date().toISOString().slice(0, 10), revenue: "", users_count: "", conversion_rate: "", profit: "" });
  const [goalForm, setGoalForm] = useState({ title: "", target_value: "", metric_type: "revenue", start_date: new Date().toISOString().slice(0, 10), end_date: "" });
  const [taskForm, setTaskForm] = useState({ title: "", assignee: "", deadline: "", goal_id: "" });
  const [aarForm, setAarForm] = useState({ date: new Date().toISOString().slice(0, 10), goal: "", result: "", gap_reason: "", improvement: "" });

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2000); };

  useEffect(() => {
    (async () => {
      try {
        const sb = createSupabaseBrowserClient();
        if (!sb) { setLoading(false); return; }
        const { data: { user } } = await sb.auth.getUser();
        if (!user) { setLoading(false); return; }
        setUserId(user.id);
        const adminEmails = ["mnhyuk@velaanalytics.com", "mnhyuk0213@gmail.com"];
        if (adminEmails.includes(user.email ?? "")) setAuthorized(true);

        const [m, met, g, t, a] = await Promise.all([
          sb.from("hq_mett").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
          sb.from("hq_metrics").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(30),
          sb.from("hq_goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
          sb.from("hq_tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30),
          sb.from("hq_aar").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(10),
        ]);
        setMetts((m.data ?? []) as Mett[]);
        setMetrics((met.data ?? []) as Metric[]);
        setGoals((g.data ?? []) as Goal[]);
        setTasks((t.data ?? []) as Task[]);
        setAars((a.data ?? []) as AAR[]);
      } catch (e) { console.error("HQ load error:", e); }
      setLoading(false);
    })();
  }, []);

  const sb = () => { try { return createSupabaseBrowserClient(); } catch { return null; } };

  // CRUD
  const saveMett = async () => {
    const s = sb(); if (!s || !userId || !mettForm.mission.trim()) return;
    const { data, error } = await s.from("hq_mett").insert({ user_id: userId, ...mettForm }).select().single();
    if (error) { flash("저장 실패: " + error.message); return; }
    if (data) { setMetts([data as Mett, ...metts]); flash("✓ 저장됨"); }
    setMettForm({ mission: "", enemy: "", terrain: "", troops: "", time_constraint: "", civil: "" });
  };
  const saveMetric = async () => {
    const s = sb(); if (!s || !userId) return;
    const payload = { user_id: userId, date: metricForm.date, revenue: Number(metricForm.revenue) || 0, users_count: Number(metricForm.users_count) || 0, conversion_rate: Number(metricForm.conversion_rate) || 0, profit: Number(metricForm.profit) || 0 };
    const { data, error } = await s.from("hq_metrics").upsert(payload, { onConflict: "user_id,date" }).select().single();
    if (error) { flash("저장 실패: " + error.message); return; }
    if (data) { setMetrics([data as Metric, ...metrics.filter(m => m.date !== metricForm.date)]); flash("✓ 저장됨"); }
    setMetricForm({ date: new Date().toISOString().slice(0, 10), revenue: "", users_count: "", conversion_rate: "", profit: "" });
  };
  const saveGoal = async () => {
    const s = sb(); if (!s || !userId || !goalForm.title.trim()) return;
    if (goals.filter(g => g.status === "active").length >= 2) { flash("활성 목표는 최대 2개"); return; }
    const { data, error } = await s.from("hq_goals").insert({ user_id: userId, title: goalForm.title, target_value: Number(goalForm.target_value) || 0, current_value: 0, metric_type: goalForm.metric_type, start_date: goalForm.start_date, end_date: goalForm.end_date || goalForm.start_date, status: "active" }).select().single();
    if (error) { flash("저장 실패: " + error.message); return; }
    if (data) { setGoals([data as Goal, ...goals]); flash("✓ 목표 추가됨"); }
    setGoalForm({ title: "", target_value: "", metric_type: "revenue", start_date: new Date().toISOString().slice(0, 10), end_date: "" });
  };
  const saveTask = async () => {
    const s = sb(); if (!s || !userId || !taskForm.title.trim()) return;
    const { data, error } = await s.from("hq_tasks").insert({ user_id: userId, title: taskForm.title, assignee: taskForm.assignee || null, deadline: taskForm.deadline || null, goal_id: taskForm.goal_id || null, status: "pending", result: null }).select().single();
    if (error) { flash("저장 실패: " + error.message); return; }
    if (data) { setTasks([data as Task, ...tasks]); flash("✓ 태스크 추가됨"); }
    setTaskForm({ title: "", assignee: "", deadline: "", goal_id: "" });
  };
  const saveAAR = async () => {
    const s = sb(); if (!s || !userId || !aarForm.goal.trim()) return;
    const { data, error } = await s.from("hq_aar").insert({ user_id: userId, ...aarForm }).select().single();
    if (error) { flash("저장 실패: " + error.message); return; }
    if (data) { setAars([data as AAR, ...aars]); flash("✓ AAR 저장됨"); }
    setAarForm({ date: new Date().toISOString().slice(0, 10), goal: "", result: "", gap_reason: "", improvement: "" });
  };
  const updateGoal = async (id: string, status: string) => { const s = sb(); if (!s) return; await s.from("hq_goals").update({ status }).eq("id", id); setGoals(goals.map(g => g.id === id ? { ...g, status } : g)); };
  const updateTask = async (id: string, status: string) => { const s = sb(); if (!s) return; await s.from("hq_tasks").update({ status }).eq("id", id); setTasks(tasks.map(t => t.id === id ? { ...t, status } : t)); };
  const del = async (table: string, id: string) => { if (!confirm("삭제?")) return; const s = sb(); if (!s) return; await s.from(table).delete().eq("id", id); };
  const delMett = async (id: string) => { await del("hq_mett", id); setMetts(metts.filter(m => m.id !== id)); };
  const delMetric = async (id: string) => { await del("hq_metrics", id); setMetrics(metrics.filter(m => m.id !== id)); };
  const delGoal = async (id: string) => { await del("hq_goals", id); setGoals(goals.filter(g => g.id !== id)); };
  const delTask = async (id: string) => { await del("hq_tasks", id); setTasks(tasks.filter(t => t.id !== id)); };
  const delAAR = async (id: string) => { await del("hq_aar", id); setAars(aars.filter(a => a.id !== id)); };

  if (loading) return <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center"><div className="w-8 h-8 border-3 border-slate-300 border-t-slate-700 rounded-full animate-spin" /></div>;
  if (!authorized) return (
    <main className="min-h-screen bg-[#f0f2f5] pt-20 pb-16 px-4 flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-4">🔒</div><h2 className="text-xl font-bold text-slate-900 mb-2">접근 권한 없음</h2><p className="text-sm text-slate-500 mb-4">HQ는 관리자 전용입니다.</p><Link href="/" className="rounded-lg bg-slate-900 text-white font-semibold px-5 py-2.5 text-sm">홈으로</Link></div>
    </main>
  );

  const I = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";
  const C = "bg-white border border-slate-200 rounded-lg p-4 mb-3 shadow-sm";
  const L = "block text-xs font-medium text-slate-600 mb-1";
  const B = "rounded-lg bg-blue-600 text-white font-semibold px-4 py-2 text-sm hover:bg-blue-700 transition";

  const activeGoals = goals.filter(g => g.status === "active");
  const pendingTasks = tasks.filter(t => t.status !== "completed" && t.status !== "failed");
  const completedTasks = tasks.filter(t => t.status === "completed");
  const latestMett = metts[0];
  const latestKpi = metrics[0];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* 인트라넷 헤더 */}
      <header className="bg-[#1a1a2e] text-white px-4 py-3 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">🏛️ VELA HQ</span>
            <span className="text-xs text-slate-400 hidden sm:inline">Internal Operations</span>
          </div>
          <div className="flex items-center gap-3">
            {msg && <span className="text-xs bg-emerald-600 px-2 py-1 rounded">{msg}</span>}
            <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white">고객 대시보드 →</Link>
          </div>
        </div>
      </header>

      {/* 탭 네비 */}
      <nav className="bg-white border-b border-slate-200 sticky top-[48px] z-40">
        <div className="max-w-5xl mx-auto flex overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-shrink-0 px-4 py-3 text-xs font-semibold border-b-2 transition ${tab === t.key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-5">

        {/* 대시보드 */}
        {tab === "dashboard" && (
          <div className="space-y-4">
            {/* KPI 카드 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { l: "매출", v: latestKpi ? fmt(latestKpi.revenue) + "원" : "—", c: "text-slate-900" },
                { l: "사용자", v: latestKpi ? fmt(latestKpi.users_count) : "—", c: "text-blue-600" },
                { l: "전환율", v: latestKpi ? latestKpi.conversion_rate + "%" : "—", c: "text-purple-600" },
                { l: "순이익", v: latestKpi ? fmt(latestKpi.profit) + "원" : "—", c: (latestKpi?.profit ?? 0) >= 0 ? "text-emerald-600" : "text-red-500" },
              ].map(s => (
                <div key={s.l} className={C}><p className="text-[11px] text-slate-400">{s.l}</p><p className={`text-lg font-bold ${s.c}`}>{s.v}</p></div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* 미션 */}
              <div className={C}>
                <div className="flex justify-between mb-2"><h3 className="text-sm font-bold">🎯 현재 미션</h3><button onClick={() => setTab("mett")} className="text-[11px] text-blue-600">수정 →</button></div>
                {latestMett ? <p className="text-sm font-semibold text-slate-900">{latestMett.mission}</p> : <p className="text-xs text-slate-400">METT-TC를 작성하세요</p>}
              </div>
              {/* 목표 */}
              <div className={C}>
                <div className="flex justify-between mb-2"><h3 className="text-sm font-bold">🏆 목표 ({activeGoals.length}/2)</h3><button onClick={() => setTab("goal")} className="text-[11px] text-blue-600">관리 →</button></div>
                {activeGoals.length === 0 ? <p className="text-xs text-slate-400">목표를 설정하세요</p> : activeGoals.map(g => (
                  <div key={g.id} className="mb-2"><div className="flex justify-between text-xs mb-1"><span>{g.title}</span><span className="text-slate-400">{g.target_value > 0 ? Math.round(g.current_value / g.target_value * 100) : 0}%</span></div><div className="h-1.5 bg-slate-100 rounded-full"><div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(g.target_value > 0 ? g.current_value / g.target_value * 100 : 0, 100)}%` }} /></div></div>
                ))}
              </div>
              {/* 태스크 */}
              <div className={C}>
                <div className="flex justify-between mb-2"><h3 className="text-sm font-bold">✅ 태스크 ({completedTasks.length}/{tasks.length})</h3><button onClick={() => setTab("task")} className="text-[11px] text-blue-600">관리 →</button></div>
                {pendingTasks.length === 0 ? <p className="text-xs text-emerald-600 font-semibold">모두 완료!</p> : pendingTasks.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-xs py-1"><span className={`w-1.5 h-1.5 rounded-full ${t.status === "in_progress" ? "bg-amber-400" : "bg-slate-300"}`} /><span className="truncate flex-1">{t.title}</span>{t.deadline && <span className="text-slate-400">{t.deadline.slice(5)}</span>}</div>
                ))}
              </div>
              {/* AAR */}
              <div className={C}>
                <div className="flex justify-between mb-2"><h3 className="text-sm font-bold">📝 최근 AAR</h3><button onClick={() => setTab("aar")} className="text-[11px] text-blue-600">작성 →</button></div>
                {aars[0] ? <div className="text-xs space-y-1"><p><b>목표:</b> {aars[0].goal}</p><p><b>결과:</b> {aars[0].result}</p>{aars[0].improvement && <p className="text-blue-600"><b>개선:</b> {aars[0].improvement}</p>}</div> : <p className="text-xs text-slate-400">AAR을 작성하세요</p>}
              </div>
            </div>

            {/* 운영 리듬 */}
            <div className={C}>
              <h3 className="text-sm font-bold mb-2">📅 운영 리듬</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-blue-50 rounded-lg p-2"><p className="font-bold text-blue-700 mb-1">일일</p><p className="text-blue-600">METT → KPI → Task → AAR</p></div>
                <div className="bg-purple-50 rounded-lg p-2"><p className="font-bold text-purple-700 mb-1">주간</p><p className="text-purple-600">월:목표 / 수:점검 / 금:AAR</p></div>
                <div className="bg-emerald-50 rounded-lg p-2"><p className="font-bold text-emerald-700 mb-1">월간</p><p className="text-emerald-600">KPI분석 / 전략수립</p></div>
              </div>
            </div>
          </div>
        )}

        {/* METT */}
        {tab === "mett" && (
          <div className="space-y-3">
            <div className={C}>
              <h3 className="text-sm font-bold mb-3">🎯 상황 판단 (METT-TC)</h3>
              <div className="space-y-2">
                {([["mission", "M — 목표"], ["enemy", "E — 문제/경쟁"], ["terrain", "T — 시장/환경"], ["troops", "T — 자원"], ["time_constraint", "T — 일정"], ["civil", "C — 고객 반응"]] as const).map(([k, l]) => (
                  <div key={k}><label className={L}>{l}</label><input className={I} value={mettForm[k]} onChange={e => setMettForm({ ...mettForm, [k]: e.target.value })} /></div>
                ))}
                <button onClick={saveMett} className={B}>저장</button>
              </div>
            </div>
            {metts.map(m => (
              <div key={m.id} className={C}>
                <div className="flex justify-between text-[11px] text-slate-400 mb-2"><span>{new Date(m.created_at).toLocaleDateString("ko-KR")}</span><button onClick={() => delMett(m.id)} className="text-red-400 hover:text-red-600">삭제</button></div>
                <p className="text-sm font-semibold mb-1">{m.mission}</p>
                <div className="text-xs text-slate-500 space-y-0.5">
                  {m.enemy && <p>문제: {m.enemy}</p>}{m.terrain && <p>환경: {m.terrain}</p>}{m.troops && <p>자원: {m.troops}</p>}{m.time_constraint && <p>일정: {m.time_constraint}</p>}{m.civil && <p>고객: {m.civil}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KPI */}
        {tab === "kpi" && (
          <div className="space-y-3">
            <div className={C}>
              <h3 className="text-sm font-bold mb-3">📊 KPI 입력</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div><label className={L}>날짜</label><input type="date" className={I} value={metricForm.date} onChange={e => setMetricForm({ ...metricForm, date: e.target.value })} /></div>
                <div><label className={L}>매출</label><input className={I} inputMode="numeric" value={metricForm.revenue} onChange={e => setMetricForm({ ...metricForm, revenue: e.target.value })} /></div>
                <div><label className={L}>사용자</label><input className={I} inputMode="numeric" value={metricForm.users_count} onChange={e => setMetricForm({ ...metricForm, users_count: e.target.value })} /></div>
                <div><label className={L}>전환율(%)</label><input className={I} inputMode="decimal" value={metricForm.conversion_rate} onChange={e => setMetricForm({ ...metricForm, conversion_rate: e.target.value })} /></div>
                <div><label className={L}>순이익</label><input className={I} inputMode="numeric" value={metricForm.profit} onChange={e => setMetricForm({ ...metricForm, profit: e.target.value })} /></div>
              </div>
              <button onClick={saveMetric} className={B}>저장</button>
            </div>
            {metrics.length > 0 && (
              <div className={C}>
                <table className="w-full text-xs"><thead><tr className="text-slate-400 border-b"><th className="py-1.5 text-left">날짜</th><th className="text-right">매출</th><th className="text-right">사용자</th><th className="text-right">전환율</th><th className="text-right">순이익</th><th className="w-6"></th></tr></thead>
                <tbody>{metrics.slice(0, 15).map(m => (
                  <tr key={m.id} className="border-b border-slate-50"><td className="py-1.5">{m.date}</td><td className="text-right">{fmt(m.revenue)}</td><td className="text-right">{m.users_count}</td><td className="text-right">{m.conversion_rate}%</td><td className={`text-right font-semibold ${m.profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>{fmt(m.profit)}</td><td><button onClick={() => delMetric(m.id)} className="text-red-400 text-[10px]">✕</button></td></tr>
                ))}</tbody></table>
              </div>
            )}
          </div>
        )}

        {/* Goal */}
        {tab === "goal" && (
          <div className="space-y-3">
            <div className={C}>
              <h3 className="text-sm font-bold mb-1">🏆 목표 추가</h3>
              <p className="text-[11px] text-slate-400 mb-2">활성 목표 최대 2개</p>
              <div className="space-y-2">
                <div><label className={L}>목표</label><input className={I} value={goalForm.title} onChange={e => setGoalForm({ ...goalForm, title: e.target.value })} placeholder="예: 전환율 8% 달성" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className={L}>목표 수치</label><input className={I} value={goalForm.target_value} onChange={e => setGoalForm({ ...goalForm, target_value: e.target.value })} /></div>
                  <div><label className={L}>지표</label><select className={I} value={goalForm.metric_type} onChange={e => setGoalForm({ ...goalForm, metric_type: e.target.value })}><option value="revenue">매출</option><option value="users">사용자</option><option value="conversion">전환율</option><option value="profit">순이익</option></select></div>
                  <div><label className={L}>시작일</label><input type="date" className={I} value={goalForm.start_date} onChange={e => setGoalForm({ ...goalForm, start_date: e.target.value })} /></div>
                  <div><label className={L}>마감일</label><input type="date" className={I} value={goalForm.end_date} onChange={e => setGoalForm({ ...goalForm, end_date: e.target.value })} /></div>
                </div>
                <button onClick={saveGoal} className={B}>추가</button>
              </div>
            </div>
            {goals.map(g => (
              <div key={g.id} className={C}>
                <div className="flex items-center justify-between mb-1"><h4 className="text-sm font-bold">{g.title}</h4><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ST[g.status]?.bg}`}>{ST[g.status]?.label}</span></div>
                <div className="text-xs text-slate-400 mb-2">{g.start_date} ~ {g.end_date} · 목표: {g.target_value}</div>
                <div className="h-1.5 bg-slate-100 rounded-full mb-2"><div className={`h-full rounded-full ${g.status === "completed" ? "bg-emerald-500" : "bg-blue-500"}`} style={{ width: `${Math.min(g.target_value > 0 ? g.current_value / g.target_value * 100 : 0, 100)}%` }} /></div>
                <div className="flex gap-2 text-[11px]">
                  {g.status === "active" && <><button onClick={() => updateGoal(g.id, "completed")} className="text-emerald-600 font-semibold">완료</button><button onClick={() => updateGoal(g.id, "failed")} className="text-red-500 font-semibold">실패</button></>}
                  <button onClick={() => delGoal(g.id)} className="text-red-400 ml-auto">삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Task */}
        {tab === "task" && (
          <div className="space-y-3">
            <div className={C}>
              <h3 className="text-sm font-bold mb-2">✅ 태스크 추가</h3>
              <div className="space-y-2">
                <div><label className={L}>할 일</label><input className={I} value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="구체적인 실행 항목" /></div>
                <div className="grid grid-cols-3 gap-2">
                  <div><label className={L}>담당</label><input className={I} value={taskForm.assignee} onChange={e => setTaskForm({ ...taskForm, assignee: e.target.value })} /></div>
                  <div><label className={L}>마감</label><input type="date" className={I} value={taskForm.deadline} onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })} /></div>
                  <div><label className={L}>목표 연결</label><select className={I} value={taskForm.goal_id} onChange={e => setTaskForm({ ...taskForm, goal_id: e.target.value })}><option value="">없음</option>{activeGoals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}</select></div>
                </div>
                <button onClick={saveTask} className={B}>추가</button>
              </div>
            </div>
            {tasks.map(t => (
              <div key={t.id} className={`${C} flex items-center gap-3`}>
                <button onClick={() => updateTask(t.id, t.status === "completed" ? "pending" : "completed")} className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-[10px] ${t.status === "completed" ? "bg-emerald-500 text-white" : "border border-slate-300"}`}>{t.status === "completed" ? "✓" : ""}</button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${t.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>{t.title}</p>
                  <div className="flex gap-2 text-[11px] text-slate-400">{t.assignee && <span>👤 {t.assignee}</span>}{t.deadline && <span>📅 {t.deadline.slice(5)}</span>}</div>
                </div>
                <button onClick={() => delTask(t.id)} className="text-[10px] text-red-400">✕</button>
              </div>
            ))}
          </div>
        )}

        {/* AAR */}
        {tab === "aar" && (
          <div className="space-y-3">
            <div className={C}>
              <h3 className="text-sm font-bold mb-1">📝 AAR 작성</h3>
              <p className="text-[11px] text-slate-400 mb-2">목표 → 결과 → 차이 → 개선</p>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div><label className={L}>날짜</label><input type="date" className={I} value={aarForm.date} onChange={e => setAarForm({ ...aarForm, date: e.target.value })} /></div>
                  <div><label className={L}>목표</label><input className={I} value={aarForm.goal} onChange={e => setAarForm({ ...aarForm, goal: e.target.value })} /></div>
                </div>
                <div><label className={L}>결과</label><input className={I} value={aarForm.result} onChange={e => setAarForm({ ...aarForm, result: e.target.value })} /></div>
                <div><label className={L}>차이 원인</label><textarea className={`${I} h-14`} value={aarForm.gap_reason} onChange={e => setAarForm({ ...aarForm, gap_reason: e.target.value })} /></div>
                <div><label className={L}>개선안</label><textarea className={`${I} h-14`} value={aarForm.improvement} onChange={e => setAarForm({ ...aarForm, improvement: e.target.value })} /></div>
                <button onClick={saveAAR} className={B}>저장</button>
              </div>
            </div>
            {aars.map(a => (
              <div key={a.id} className={C}>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1"><span>{a.date}</span><button onClick={() => delAAR(a.id)} className="text-red-400">삭제</button></div>
                <div className="text-xs space-y-0.5"><p><b>목표:</b> {a.goal}</p><p><b>결과:</b> {a.result}</p>{a.gap_reason && <p className="text-amber-600"><b>차이:</b> {a.gap_reason}</p>}{a.improvement && <p className="text-blue-600"><b>개선:</b> {a.improvement}</p>}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
