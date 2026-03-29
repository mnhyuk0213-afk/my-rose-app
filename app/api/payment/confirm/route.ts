// app/api/payment/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await req.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: "필수 파라미터 누락" }, { status: 400 });
    }

    // 토스페이먼츠 결제 승인 API 호출
    const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Toss 결제 승인 실패:", data);
      return NextResponse.json({ error: data.message ?? "결제 승인 실패" }, { status: 400 });
    }

    // TODO: DB에 구독 정보 저장 (Supabase)
    // const supabase = createServerClient(...);
    // await supabase.from("subscriptions").upsert({ user_id, plan, ... });

    return NextResponse.json({ ok: true, payment: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
