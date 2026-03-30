"use client";

import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function PrivacyPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-slate-50 pt-20 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200 p-8 md:p-12">

            <div className="mb-8">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Legal</p>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">개인정보처리방침</h1>
              <p className="text-sm text-slate-400">시행일: 2026년 04월 03일 · 최종 수정: 2026년 03월 30일</p>
            </div>

            <div className="space-y-8 text-sm text-slate-600 leading-relaxed">

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제1조 (개인정보의 처리 목적)</h2>
                <p>벨라솔루션(이하 "회사")은 다음의 목적을 위해 개인정보를 처리합니다.</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>회원가입 및 본인 확인</li>
                  <li>서비스 제공 및 맞춤형 분석 결과 제공</li>
                  <li>서비스 이용 관련 공지 및 고객 지원</li>
                  <li>서비스 개선 및 신규 기능 개발</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제2조 (수집하는 개인정보 항목)</h2>
                <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">필수 항목</p>
                    <p>이메일 주소, 비밀번호(암호화 저장), 이름(닉네임)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">선택 항목</p>
                    <p>매장명, 업종, 좌석 수, 지역, 운영 상태</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">자동 수집</p>
                    <p>서비스 이용 기록, 접속 로그, 쿠키, IP 주소</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제3조 (개인정보의 처리 및 보유 기간)</h2>
                <p>① 회원가입 시부터 탈퇴 시까지 개인정보를 보유합니다.</p>
                <p className="mt-2">② 관련 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>계약 또는 청약철회에 관한 기록: 5년</li>
                  <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년</li>
                  <li>접속 로그: 3개월</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제4조 (개인정보의 제3자 제공)</h2>
                <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 이용자가 사전에 동의한 경우 또는 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우에는 예외로 합니다.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제5조 (개인정보 처리 위탁)</h2>
                <div className="bg-slate-50 rounded-2xl p-5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-200">
                        <th className="text-left py-2 font-semibold">수탁업체</th>
                        <th className="text-left py-2 font-semibold">위탁 업무</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="py-2">Supabase Inc.</td><td className="py-2">회원 인증 및 데이터베이스 관리</td></tr>
                      <tr><td className="py-2">Vercel Inc.</td><td className="py-2">서비스 호스팅</td></tr>
                      <tr><td className="py-2">Anthropic, PBC</td><td className="py-2">AI 분석 서비스 제공</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제6조 (이용자의 권리)</h2>
                <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>개인정보 열람 요구</li>
                  <li>오류 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리정지 요구</li>
                </ul>
                <p className="mt-2">권리 행사는 <strong>mnhyuk0213@velaanalytics.com</strong> 으로 이메일 문의하시면 처리해드립니다.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제7조 (쿠키 사용)</h2>
                <p>회사는 서비스 개선을 위해 쿠키를 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 수집을 거부할 수 있으나, 이 경우 일부 서비스 이용이 제한될 수 있습니다.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제8조 (개인정보 보호책임자)</h2>
                <div className="bg-slate-50 rounded-2xl p-5 space-y-1.5">
                  <p><span className="font-semibold text-slate-700">성명:</span> 김민혁</p>
                  <p><span className="font-semibold text-slate-700">직책:</span> 대표</p>
                  <p><span className="font-semibold text-slate-700">이메일:</span> mnhyuk0213@velaanalytics.com</p>
                  <p><span className="font-semibold text-slate-700">주소:</span> 대전광역시 중구 당디로96번길 9, 204호(유천동)</p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제9조 (개인정보처리방침 변경)</h2>
                <p>이 방침은 2026년 4월 3일부터 시행됩니다. 내용이 변경되는 경우 변경 7일 전부터 서비스 공지사항을 통해 안내합니다.</p>
              </section>

            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
              <Link href="/terms" className="text-sm text-slate-400 hover:text-slate-700 transition underline underline-offset-2">
                이용약관 보기 →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
