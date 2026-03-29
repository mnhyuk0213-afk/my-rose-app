"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

function num(v: string) { const n = Number(v.replace(/,/g, "")); return isNaN(n) ? 0 : n; }
function fmt(v: number) { return v.toLocaleString("ko-KR"); }

// ─── 세금 계산 로직 ───────────────────────────────────────────────────────────

function calcVat(annualSales: number, isSimplified: boolean) {
  if (isSimplified) {
    // 간이과세자: 업종별 부가가치율 × 10% (음식점 40%)
    const vatRate = 0.04; // 40% × 10%
    const vatDue = annualSales * vatRate;
    return { vatDue, type: "간이과세", note: "연 매출 8,000만원 미만 적용 가능" };
  }
  // 일반과세자: 매출세액 - 매입세액 (매입세액 약 30% 가정)
  const salesTax = annualSales * 0.1 / 1.1; // 공급가액의 10%
  const inputTax = salesTax * 0.35; // 매입세액 공제 (식재료+인건비 제외 비용)
  const vatDue = Math.max(0, salesTax - inputTax);
  return { vatDue, salesTax, inputTax, type: "일반과세", note: "연 8,000만원 이상 또는 선택" };
}

// 종합소득세 세율 (2024년 기준)
const INCOME_TAX_BRACKETS = [
  { limit: 14_000_000, rate: 0.06, deduction: 0 },
  { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { limit: 500_000_000, rate: 0.40, deduction: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { limit: Infinity, rate: 0.45, deduction: 65_940_000 },
];

function calcIncomeTax(annualProfit: number, deductions: number) {
  const taxableIncome = Math.max(0, annualProfit - deductions);
  const bracket = INCOME_TAX_BRACKETS.find(b => taxableIncome <= b.limit) ?? INCOME_TAX_BRACKETS[INCOME_TAX_BRACKETS.length - 1];
  const tax = Math.max(0, taxableIncome * bracket.rate - bracket.deduction);
  const localTax = tax * 0.1; // 지방소득세 10%
  return { taxableIncome, tax, localTax, total: tax + localTax, rate: bracket.rate * 100 };
}

// 종합소득세 기본공제 추정
function calcDeductions(hasDependents: number, isBlueReturn: boolean) {
  let d = 1_500_000; // 기본공제 본인
  d += hasDependents * 1_500_000; // 부양가족
  d += 700_000; // 표준세액공제
  if (isBlueReturn) d += 2_000_000; // 성실신고 추가
  return d;
}

export default function TaxPage() {
  const [annualSales, setAnnualSales] = useState("120000000");
  const [annualProfit, setAnnualProfit] = useState("24000000");
  const [isSimplified, setIsSimplified] = useState(false);
  const [dependents, setDependents] = useState("0");
  const [isBlueReturn, setIsBlueReturn] = useState(false);

  const sales = num(annualSales);
  const profit = num(annualProfit);
  const deps = parseInt(dependents) || 0;

  const vatResult = calcVat(sales, isSimplified);
  const deductions = calcDeductions(deps, isBlueReturn);
  const incomeTaxResult = calcIncomeTax(profit, deductions);

  const totalTax = vatResult.vatDue + incomeTaxResult.total;
  const effectiveRate = profit > 0 ? (totalTax / profit) * 100 : 0;

  // 월 납부 추정
  const monthlyTaxReserve = totalTax / 12;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap');
        body{font-family:'Pretendard',-apple-system,sans-serif}
      `}</style>
      <NavBar />
      <main className="min-h-screen bg-slate-50 pt-20 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-8 mt-4">
            <Link href="/tools" className="text-sm text-slate-400 hover:text-slate-700 transition">← 도구 목록</Link>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <span>🧾</span> 세금 계산기
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">세금 계산기</h1>
            <p className="text-slate-500 text-sm">연 매출과 순이익을 입력하면 부가세·종합소득세 예상액을 계산합니다.</p>
          </div>

          {/* 경고 배너 */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 mb-6 text-xs text-amber-700 leading-relaxed">
            ⚠️ <strong>이 계산기는 참고용 추정치입니다.</strong> 실제 납세액은 공제 항목·사업 형태에 따라 달라질 수 있습니다. 정확한 신고는 세무사와 상담하세요.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 입력 */}
            <div className="space-y-5">
              <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-6 space-y-5">
                <h2 className="font-bold text-slate-900">매출·수익 정보</h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">연간 매출액</label>
                  <div className="relative">
                    <input
                      type="text" inputMode="numeric"
                      value={Number(annualSales).toLocaleString("ko-KR")}
                      onChange={(e) => setAnnualSales(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-right pr-8 outline-none focus:border-amber-400 focus:bg-white transition"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">원</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">연간 순이익 (세전)</label>
                  <div className="relative">
                    <input
                      type="text" inputMode="numeric"
                      value={Number(annualProfit).toLocaleString("ko-KR")}
                      onChange={(e) => setAnnualProfit(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-right pr-8 outline-none focus:border-amber-400 focus:bg-white transition"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">원</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">부가가치세 유형</label>
                  <div className="flex gap-2">
                    {[{ v: false, l: "일반과세자" }, { v: true, l: "간이과세자" }].map(({ v, l }) => (
                      <button
                        key={l}
                        onClick={() => setIsSimplified(v)}
                        className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                          isSimplified === v ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">{vatResult.note}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-6 space-y-4">
                <h2 className="font-bold text-slate-900">소득세 공제 설정</h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">부양가족 수</label>
                  <select
                    value={dependents}
                    onChange={(e) => setDependents(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-amber-400"
                  >
                    {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}명</option>)}
                  </select>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBlueReturn}
                    onChange={(e) => setIsBlueReturn(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-700">성실신고 확인 대상</span>
                    <p className="text-xs text-slate-400">추가 공제 200만원 적용</p>
                  </div>
                </label>
              </div>
            </div>

            {/* 결과 */}
            <div className="space-y-4">
              {/* 부가세 */}
              <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">부가가치세</h3>
                  <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-1 rounded-full">연 2회 신고</span>
                </div>
                <div className="space-y-3">
                  {!isSimplified && vatResult.salesTax !== undefined && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">매출세액</span>
                        <span className="font-semibold">{fmt(Math.round(vatResult.salesTax))}원</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">매입세액 공제</span>
                        <span className="font-semibold text-emerald-600">-{fmt(Math.round(vatResult.inputTax ?? 0))}원</span>
                      </div>
                      <div className="border-t border-slate-100 pt-3" />
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">납부 예상액 (연)</span>
                    <span className="text-lg font-extrabold text-amber-600">{fmt(Math.round(vatResult.vatDue))}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">회당 납부 (상·하반기)</span>
                    <span className="font-semibold text-slate-700">{fmt(Math.round(vatResult.vatDue / 2))}원</span>
                  </div>
                </div>
              </div>

              {/* 종합소득세 */}
              <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">종합소득세</h3>
                  <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-1 rounded-full">5월 신고</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">세전 순이익</span>
                    <span className="font-semibold">{fmt(profit)}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">소득공제 합계</span>
                    <span className="font-semibold text-emerald-600">-{fmt(deductions)}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">과세표준</span>
                    <span className="font-semibold">{fmt(Math.max(0, incomeTaxResult.taxableIncome))}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">적용 세율</span>
                    <span className="font-semibold">{incomeTaxResult.rate.toFixed(0)}%</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3" />
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">소득세</span>
                    <span className="font-semibold">{fmt(Math.round(incomeTaxResult.tax))}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">지방소득세 (10%)</span>
                    <span className="font-semibold">{fmt(Math.round(incomeTaxResult.localTax))}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">납부 예상액 (연)</span>
                    <span className="text-lg font-extrabold text-purple-600">{fmt(Math.round(incomeTaxResult.total))}원</span>
                  </div>
                </div>
              </div>

              {/* 총합 */}
              <div className="rounded-3xl bg-slate-900 p-6">
                <p className="text-slate-400 text-sm mb-1">연간 총 세금 예상</p>
                <p className="text-3xl font-extrabold text-white mb-3">{fmt(Math.round(totalTax))}원</p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">실효세율</span>
                  <span className="text-white font-bold">{effectiveRate.toFixed(1)}%</span>
                </div>
                <div className="border-t border-slate-700 mt-4 pt-4">
                  <p className="text-slate-400 text-xs mb-1">💡 월별 세금 적립 권장액</p>
                  <p className="text-xl font-extrabold text-amber-400">{fmt(Math.round(monthlyTaxReserve))}원/월</p>
                </div>
              </div>
            </div>
          </div>

          {/* 세금 달력 */}
          <div className="mt-8 rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">📅 세금 납부 일정</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { month: "1월", label: "부가세 예정신고 (선택)", color: "#D97706" },
                { month: "4월", label: "부가세 예정신고 (선택)", color: "#D97706" },
                { month: "1월", label: "부가세 확정신고 (하반기)", color: "#EA580C" },
                { month: "7월", label: "부가세 확정신고 (상반기)", color: "#EA580C" },
                { month: "5월", label: "종합소득세 확정신고", color: "#7C3AED" },
                { month: "11월", label: "종합소득세 중간예납", color: "#6D28D9" },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl bg-slate-50 p-3">
                  <div className="text-lg font-extrabold" style={{ color: item.color }}>{item.month}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-100 px-5 py-4 text-xs text-slate-500 leading-relaxed">
            💡 <strong className="text-slate-700">Tip.</strong> 매출이 증가할수록 간이과세에서 일반과세로 전환하는 것이 유리할 수 있습니다. 신용카드·현금영수증 매출 비중이 높은 경우 세액공제 혜택도 확인하세요.
          </div>
        </div>
      </main>
    </>
  );
}
