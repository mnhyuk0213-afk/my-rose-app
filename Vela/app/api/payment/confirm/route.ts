import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { PLAN_PRICES } from "@/lib/plans";

export const dynamic = "force-dynamic";

/** orderId 형식: VELA-{planId}-{timestamp} */
function parsePlan(orderId: string): string {
  const parts = orderId.split("-");
  return parts.length >= 2 ? parts[1] : "unknown";
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 분당 3회 (결제 남용 방지)
    const ip = getClientIp(req);
    const rl = checkRateLimit(ip, { key: "payment-confirm", limit: 3 });
    if (!rl.ok) return rateLimitResponse();

    const { paymentKey, orderId, amount } = await req.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
    }

    // 입력값 타입 검증
    if (typeof paymentKey !== "string" || typeof orderId !== "string" || typeof amount !== "number") {
      return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
    }

    /* ── 1. 토스 결제 승인 ── */
    const secretKey = process.env.TOSS_SECRET_KEY!;
    const encoded = Buffer.from(`${secretKey}:`).toString("base64");

    const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const tossData = await tossRes.json();

    const alreadyProcessed = !tossRes.ok && tossData.code === "ALREADY_PROCESSED_PAYMENT";

    if (!tossRes.ok && !alreadyProcessed) {
      console.error("Toss error:", tossData);
      return NextResponse.json(
        { error: tossData.message || "결제 승인 실패" },
        { status: tossRes.status }
      );
    }

    /* ── 2. 인증된 사용자 확인 (쿠키 기반) ── */
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error after payment:", authError);
      return NextResponse.json(
        { error: "사용자 인증 실패. 결제는 완료되었으나 플랜 반영에 실패했습니다." },
        { status: 401 }
      );
    }

    /* ── 3. 결제 금액 검증 ── */
    const plan = parsePlan(orderId);
    const VALID_PLANS = ["standard", "pro"] as const;
    if (!VALID_PLANS.includes(plan as typeof VALID_PLANS[number])) {
      return NextResponse.json({ error: "유효하지 않은 플랜입니다." }, { status: 400 });
    }
    const expectedPrice = PLAN_PRICES[plan];
    if (expectedPrice && Number(amount) !== expectedPrice) {
      console.error("Payment amount mismatch:", { plan, expected: expectedPrice, actual: amount });
      return NextResponse.json({ error: "결제 금액이 올바르지 않습니다." }, { status: 400 });
    }

    // 이미 저장된 결제인지 확인 (중복 방지)
    const { data: existing } = await supabase
      .from("payments")
      .select("id")
      .eq("user_id", user.id)
      .eq("plan", plan)
      .eq("status", "done")
      .limit(1);

    if (!existing || existing.length === 0) {
      const { error: insertError } = await supabase.from("payments").insert({
        user_id: user.id,
        plan,
        amount: Number(amount),
        status: "done",
        order_id: orderId,
        payment_key: paymentKey,
      });

      if (insertError) {
        console.error("Payment insert error:", JSON.stringify(insertError));
        return NextResponse.json({
          success: false,
          error: "결제는 완료되었으나 내역 저장에 실패했습니다. 고객센터에 문의해주세요.",
          detail: insertError.message,
        }, { status: 500 });
      }
    }

    /* ── 4. profiles 테이블의 plan 필드 업데이트 ── */
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ plan, plan_updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile plan update error:", JSON.stringify(updateError));
      // 결제는 성공했으므로 사용자에게 알리되 500은 아님
      return NextResponse.json({
        success: true,
        warning: "결제는 완료되었으나 플랜 반영이 지연될 수 있습니다. 새로고침 후에도 반영되지 않으면 고객센터에 문의해주세요.",
        payment: tossData,
      });
    }

    return NextResponse.json({ success: true, payment: tossData });
  } catch (e) {
    console.error("Payment confirm error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
