"use client";

import { useState, useEffect } from "react";
import { useSimulatorData, type SimulatorSnapshot } from "@/lib/useSimulatorData";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

const fmt = (n: number) => Math.round(n).toLocaleString("ko-KR");
const INDUSTRY_LABEL: Record<string, string> = {
  cafe: "카페", restaurant: "음식점", bar: "술집/바", finedining: "파인다이닝", gogi: "고깃집",
};

export interface SimField {
  key: string;
  label: string;
  value: string;
  rawValue: number | string;
}

interface DataSource {
  id: string;
  label: string;
  sub: string;
  icon: string;
  snapshot: SimulatorSnapshot;
}

interface SimDataPickerProps {
  fields: (sim: SimulatorSnapshot) => SimField[];
  onApply: (selected: Record<string, number | string>) => void;
}

export default function SimDataPicker({ fields, onApply }: SimDataPickerProps) {
  const simData = useSimulatorData();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [sources, setSources] = useState<DataSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("current");
  const [loadingSources, setLoadingSources] = useState(false);

  // 데이터 소스 로드 (시뮬레이터 로컬 + Supabase 기록 + 월별 매출)
  const loadSources = async () => {
    setLoadingSources(true);
    const all: DataSource[] = [];

    // 1. 현재 시뮬레이터 로컬 데이터
    if (simData) {
      all.push({
        id: "current",
        label: "현재 시뮬레이션",
        sub: `${INDUSTRY_LABEL[simData.industry] ?? simData.industry} · 월매출 ${fmt(simData.totalSales)}원`,
        icon: "📊",
        snapshot: simData,
      });
    }

    // 2. Supabase 시뮬레이션 기록 + 월별 매출
    try {
      const sb = createSupabaseBrowserClient();
      if (sb) {
        const { data: { user } } = await sb.auth.getUser();
        if (user) {
          // 시뮬레이션 기록
          const { data: simRows } = await sb
            .from("simulation_history")
            .select("id, label, created_at, form, result")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);

          if (simRows) {
            for (const row of simRows) {
              const f = (row.form || {}) as Record<string, unknown>;
              const r = (row.result || {}) as Record<string, unknown>;
              const industry = String(f.industry || "restaurant");
              const totalSales = Number(r.totalSales || 0);
              const profit = Number(r.netProfit || r.profit || 0);
              const cogsRatio = Number(f.cogsRate || r.cogsRate || 30);
              const laborRatio = Number(r.laborRatio || 25);
              const avgSpend = Number(f.avgSpend || 0);
              const rent = Number(f.rent || 0);
              const seats = Number(f.seats || 0);
              if (totalSales === 0) continue;
              const date = new Date(row.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
              all.push({
                id: "sim-" + row.id,
                label: `☁️ ${row.label}`,
                sub: `${date} · ${INDUSTRY_LABEL[industry] ?? industry} · ${fmt(totalSales)}원`,
                icon: "📋",
                snapshot: {
                  industry, totalSales, profit, netProfit: profit,
                  netMargin: totalSales > 0 ? Math.round(profit / totalSales * 100 * 10) / 10 : 0,
                  bep: 0, laborRatio, cogsRatio, seats, avgSpend, rent,
                  deliveryEnabled: false,
                },
              });
            }
          }

          // 월별 매출 기록
          const { data: monthRows } = await sb
            .from("monthly_snapshots")
            .select("id, month, industry, total_sales, net_profit, cogs, labor_cost, rent, utilities, avg_spend, customer_count")
            .eq("user_id", user.id)
            .order("month", { ascending: false })
            .limit(6);

          if (monthRows) {
            for (const row of monthRows) {
              const totalSales = Number(row.total_sales || 0);
              const netProfit = Number(row.net_profit || 0);
              const cogsRatio = totalSales > 0 ? Math.round(Number(row.cogs || 0) / totalSales * 100) : 30;
              const laborRatio = totalSales > 0 ? Math.round(Number(row.labor_cost || 0) / totalSales * 100) : 25;
              const avgSpend = Number(row.avg_spend || (row.customer_count > 0 ? Math.round(totalSales / Number(row.customer_count)) : 0));
              if (totalSales === 0) continue;
              all.push({
                id: "month-" + row.id,
                label: `📈 ${row.month} 월별매출`,
                sub: `${INDUSTRY_LABEL[row.industry] ?? row.industry} · ${fmt(totalSales)}원`,
                icon: "📈",
                snapshot: {
                  industry: row.industry || "restaurant",
                  totalSales, profit: netProfit, netProfit,
                  netMargin: totalSales > 0 ? Math.round(netProfit / totalSales * 100 * 10) / 10 : 0,
                  bep: 0, laborRatio, cogsRatio,
                  seats: 0, avgSpend,
                  rent: Number(row.rent || 0),
                  deliveryEnabled: false,
                },
              });
            }
          }
        }
      }
    } catch { /* noop */ }

    setSources(all);
    if (all.length > 0) setSelectedSource(all[0].id);
    setLoadingSources(false);
  };

  const activeSource = sources.find(s => s.id === selectedSource);
  const fieldList = activeSource ? fields(activeSource.snapshot) : (simData ? fields(simData) : []);

  const toggleAll = (on: boolean) => {
    const next: Record<string, boolean> = {};
    fieldList.forEach(f => { next[f.key] = on; });
    setChecked(next);
  };

  const handleApply = () => {
    const selected: Record<string, number | string> = {};
    fieldList.forEach(f => {
      if (checked[f.key]) selected[f.key] = f.rawValue;
    });
    onApply(selected);
    setOpen(false);
  };

  const selectedCount = fieldList.filter(f => checked[f.key]).length;

  if (!simData && sources.length === 0 && !open) return null;

  if (!open) {
    return (
      <button
        onClick={() => { loadSources().then(() => { toggleAll(true); setOpen(true); }); }}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
      >
        🔗 데이터 연동 (시뮬레이터 · 월별매출)
      </button>
    );
  }

  return (
    <div className="mt-2 bg-blue-50 ring-1 ring-blue-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-slate-900">🔗 데이터 소스 선택</p>
        <button onClick={() => setOpen(false)} className="text-slate-400 text-xs hover:text-slate-600">✕ 닫기</button>
      </div>

      {/* 데이터 소스 선택 */}
      {loadingSources ? (
        <p className="text-xs text-slate-400 py-2">불러오는 중...</p>
      ) : (
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
          {sources.map(src => (
            <button
              key={src.id}
              onClick={() => { setSelectedSource(src.id); toggleAll(true); }}
              className={`flex-shrink-0 text-left px-3 py-2 rounded-xl text-xs transition ${
                selectedSource === src.id
                  ? "bg-white ring-1 ring-blue-400 text-blue-700"
                  : "bg-blue-50/50 text-slate-600 hover:bg-white"
              }`}
            >
              <p className="font-semibold">{src.label}</p>
              <p className="text-[10px] opacity-70 mt-0.5">{src.sub}</p>
            </button>
          ))}
          {sources.length === 0 && (
            <p className="text-xs text-slate-400">사용 가능한 데이터가 없습니다. 시뮬레이터를 먼저 실행하세요.</p>
          )}
        </div>
      )}

      {/* 필드 선택 */}
      {fieldList.length > 0 && (
        <>
          <div className="flex gap-2 mb-3">
            <button onClick={() => toggleAll(true)}
              className="text-[11px] font-semibold text-blue-600 bg-white ring-1 ring-blue-200 rounded-lg px-2.5 py-1 hover:bg-blue-50 transition">
              전체 선택
            </button>
            <button onClick={() => toggleAll(false)}
              className="text-[11px] font-semibold text-slate-500 bg-white ring-1 ring-slate-200 rounded-lg px-2.5 py-1 hover:bg-slate-50 transition">
              전체 해제
            </button>
          </div>

          <div className="space-y-1.5 mb-3">
            {fieldList.map(f => (
              <label key={f.key} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition ${checked[f.key] ? "bg-white ring-1 ring-blue-300" : "bg-blue-50/50 hover:bg-white"}`}>
                <input
                  type="checkbox"
                  checked={!!checked[f.key]}
                  onChange={e => setChecked(p => ({ ...p, [f.key]: e.target.checked }))}
                  className="accent-blue-600 w-4 h-4"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-700">{f.label}</span>
                </div>
                <span className="text-xs font-bold text-blue-600 flex-shrink-0">{f.value}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleApply}
            disabled={selectedCount === 0}
            className="w-full rounded-xl bg-blue-600 text-white font-semibold py-2.5 text-sm hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {selectedCount > 0 ? `선택한 ${selectedCount}개 항목 적용하기` : "항목을 선택하세요"}
          </button>
        </>
      )}
    </div>
  );
}
