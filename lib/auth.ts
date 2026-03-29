import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    {
      id: "kakao",
      name: "카카오",
      type: "oauth",
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      authorization: {
        url: "https://kauth.kakao.com/oauth/authorize",
        params: { scope: "profile_nickname profile_image account_email" },
      },
      token: "https://kauth.kakao.com/oauth/token",
      userinfo: "https://kapi.kakao.com/v2/user/me",
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.kakao_account?.profile?.nickname ?? "카카오 사용자",
          email: profile.kakao_account?.email ?? null,
          image: profile.kakao_account?.profile?.profile_image_url ?? null,
        };
      },
    },
    {
      id: "naver",
      name: "네이버",
      type: "oauth",
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      authorization: "https://nid.naver.com/oauth2.0/authorize",
      token: "https://nid.naver.com/oauth2.0/token",
      userinfo: "https://openapi.naver.com/v1/nid/me",
      profile(profile) {
        return {
          id: profile.response.id,
          name: profile.response.name ?? "네이버 사용자",
          email: profile.response.email ?? null,
          image: profile.response.profile_image ?? null,
        };
      },
    },
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = ["/simulator", "/profile", "/result"].some((p) =>
        nextUrl.pathname.startsWith(p)
      );
      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
    jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
  },
  session: { strategy: "jwt" },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
