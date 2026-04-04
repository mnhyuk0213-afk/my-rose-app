// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "edge";

function esc(s: string) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 분당 3회 (스팸 방지)
    const ip = getClientIp(req);
    const rl = checkRateLimit(ip, { key: "contact", limit: 3 });
    if (!rl.ok) return rateLimitResponse();

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "필드를 모두 입력해 주세요." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(String(email))) {
      return NextResponse.json({ error: "올바른 이메일을 입력해 주세요." }, { status: 400 });
    }

    const safeName = esc(String(name).slice(0, 100));
    const safeEmail = esc(String(email).slice(0, 200));
    const safeMessage = esc(String(message).slice(0, 5000));

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "VELA 문의 <onboarding@resend.dev>",
        to: ["mnhyuk0213@gmail.com"],
        reply_to: email,
        subject: `[VELA 문의] ${safeName}님의 문의`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #3182F6; margin-bottom: 24px;">새 문의가 도착했습니다</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; width: 80px;">이름</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">이메일</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${safeEmail}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px 12px 0; color: #666; vertical-align: top;">문의</td>
                <td style="padding: 12px 0; white-space: pre-wrap;">${safeMessage}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; color: #999; font-size: 13px;">
              이 메일은 VELA 문의 폼을 통해 자동 발송되었습니다.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "이메일 발송 실패", detail: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
