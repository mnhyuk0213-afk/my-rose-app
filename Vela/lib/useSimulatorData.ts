// lib/useSimulatorData.ts
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "vela-form-v3";

export type SimulatorSnapshot = {
  industry: string;
  totalSales: number;
  profit: number;
  netProfit: number;
  netMargin: number;
  bep: number;
  laborRatio: number;
  cogsRatio: number;
  seats: number;
  avgSpend: number;
  rent: number;
  deliveryEnabled: boolean;
};

function parse(raw: string): SimulatorSnapshot | null {
  try {
    const f = JSON.parse(raw);
    const seats = Number(f.seats ?? 0);
    const avgSpend = Number(f.avgSpend ?? 0);
    const turnover = Number(f.turnover ?? 0);
    const weekdayDays = Number(f.weekdayDays ?? 0);
    const weekendDays = Number(f.weekendDays ?? 0);
    const weekendMultiplier = Number(f.weekendMultiplier ?? 1);
    const hallSales = seats * avgSpend * turnover * (weekdayDays + weekendDays * weekendMultiplier) * 4.345;
    const deliverySales = f.deliveryEnabled ? Number(f.deliverySales ?? 0) : 0;
    const deliveryNet = deliverySales * (1 - Number(f.deliveryFeeRate ?? 15) / 100);
    const totalSales = hallSales + deliveryNet;
    if (totalSales === 0) return null;
    const cogsRate = Number(f.cogsRate ?? 30) / 100;
    const cogs = totalSales * cogsRate;
    const labor = Number(f.labor ?? 0);
    const rent = Number(f.rent ?? 0);
    const cardFee = totalSales * (Number(f.cardFeeRate ?? 1.5) / 100);
    const totalCost = cogs + labor + rent + Number(f.utilities ?? 0) + Number(f.marketing ?? 0) + Number(f.etc ?? 0) + cardFee;
    const profit = totalSales - totalCost;
    const netProfit = profit * (1 - Number(f.incomeTaxRate ?? 15) / 100);
    const netMargin = (profit / totalSales) * 100;
    return {
      industry: f.industry ?? "restaurant",
      totalSales: Math.round(totalSales),
      profit: Math.round(profit),
      netProfit: Math.round(netProfit),
      netMargin: Math.round(netMargin * 10) / 10,
      bep: Math.round(totalCost / (1 - cogsRate)),
      laborRatio: Math.round((labor / totalSales) * 1000) / 10,
      cogsRatio: Number(f.cogsRate ?? 30),
      seats, avgSpend, rent,
      deliveryEnabled: !!f.deliveryEnabled,
    };
  } catch { return null; }
}

export function useSimulatorData(): SimulatorSnapshot | null {
  const [data, setData] = useState<SimulatorSnapshot | null>(null);

  useEffect(() => {
    // 초기 로드
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setData(parse(raw));

    // 다른 탭에서 변경 감지
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) setData(parse(e.newValue));
    };
    // 같은 탭에서 변경 감지 (커스텀 이벤트)
    const onUpdate = () => {
      const updated = localStorage.getItem(STORAGE_KEY);
      if (updated) setData(parse(updated));
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("vela-form-updated", onUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("vela-form-updated", onUpdate);
    };
  }, []);

  return data;
}
