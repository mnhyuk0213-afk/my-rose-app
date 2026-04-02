import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 로그인 필요한 경로
const PROTECTED = [
  "/dashboard",
  "/simulator",
  "/result",
  "/tools",
  "/game",
  "/monthly-input",
  "/my-store",
  "/profile",
  "/community",
  "/payment",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 보호 대상 경로인지 확인
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!isProtected) return NextResponse.next();

  // Supabase 세션 쿠키 확인 (sb-{ref}-auth-token 패턴)
  const hasSession = req.cookies.getAll().some(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
