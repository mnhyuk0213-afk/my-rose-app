"use client";

import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-slate-50 pt-20 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200 p-8 md:p-12">

            <div className="mb-8">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Legal</p>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">이용약관</h1>
              <p className="text-sm text-slate-400">시행일: 2026년 04월 03일 · 최종 수정: 2026년 03월 30일</p>
            </div>

            <div className="prose prose-slate max-w-none space-y-8 text-sm text-slate-600 leading-relaxed">

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제1조 (목적)</h2>
                <p>이 약관은 벨라솔루션(이하 "회사")이 운영하는 VELA 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제2조 (사업자 정보)</h2>
                <div className="bg-slate-50 rounded-2xl p-5 space-y-1.5">
                  <p><span className="font-semibold text-slate-700">상호명:</span> 벨라솔루션</p>
                  <p><span className="font-semibold text-slate-700">대표자:</span> 김민혁</p>
                  <p><span className="font-semibold text-slate-700">사업자등록번호:</span> 777-17-02386</p>
                  <p><span className="font-semibold text-slate-700">사업장 주소:</span> 대전광역시 중구 당디로96번길 9, 204호(유천동)</p>
                  <p><span className="font-semibold text-slate-700">이메일:</span> mnhyuk0213@velaanalytics.com</p>
                  <p><span className="font-semibold text-slate-700">서비스 URL:</span> https://www.velaanalytics.com</p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제3조 (약관의 효력 및 변경)</h2>
                <p>① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</p>
                <p className="mt-2">② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 안내합니다.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제4조 (서비스의 내용)</h2>
                <p>회사는 다음과 같은 서비스를 제공합니다.</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>외식업 수익 시뮬레이터</li>
                  <li>AI 기반 경영 전략 컨설팅</li>
                  <li>메뉴별 원가 계산기</li>
                  <li>인건비·세금 계산 도구</li>
                  <li>창업 체크리스트</li>
                  <li>SNS 콘텐츠 생성, 리뷰 답변 생성 등 AI 마케팅 도구</li>
                  <li>월별 매출 현황 분석</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제5조 (회원가입 및 계정)</h2>
                <p>① 이용자는 회사가 정한 양식에 따라 회원 정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</p>
                <p className="mt-2">② 회원은 계정 정보를 제3자에게 양도하거나 대여할 수 없습니다.</p>
                <p className="mt-2">③ 회원은 계정 정보 변경 시 즉시 수정해야 하며, 미수정으로 인한 불이익은 회원이 부담합니다.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제6조 (요금제 및 결제)</h2>
                <p>① 서비스의 일부 기능은 유료로 제공되며, 요금 및 결제 조건은 서비스 내 요금제 페이지에 명시합니다.</p>
                <p className="mt-2">② 유료 서비스 결제 시 관련 법령에 따라 환불이 처리됩니다.</p>
                <p className="mt-2">③ 구독 서비스는 해지 신청 전까지 자동 갱신됩니다.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제7조 (이용자의 의무)</h2>
                <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>타인의 정보 도용</li>
                  <li>서비스의 운영을 방해하는 행위</li>
                  <li>서비스를 통해 얻은 정보를 무단으로 복제·배포하는 행위</li>
                  <li>기타 관련 법령에 위반되는 행위</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제8조 (면책조항)</h2>
                <p>① 회사는 천재지변, 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</p>
                <p className="mt-2">② 서비스에서 제공하는 분석 결과 및 AI 전략은 참고 목적으로만 활용되어야 하며, 실제 사업상 의사결정에 따른 결과에 대해 회사는 책임을 지지 않습니다.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">제9조 (분쟁해결)</h2>
                <p>이 약관과 관련된 분쟁은 대한민국 법률을 적용하며, 분쟁 발생 시 대전지방법원을 관할 법원으로 합니다.</p>
              </section>

            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-slate-700 transition underline underline-offset-2">
                개인정보처리방침 보기 →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
