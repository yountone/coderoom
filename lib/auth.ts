import type { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { getSupabase } from "./supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "kakao") return false;

      const supabase = getSupabase();
      const kakaoId = String(account.providerAccountId);

      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("kakao_id", kakaoId)
        .single();

      if (!existing) {
        await supabase.from("users").insert({
          kakao_id: kakaoId,
          nickname: user.name || "뮤지컬러",
          profile_image: user.image || null,
        });
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account?.provider === "kakao") {
        const supabase = getSupabase();
        const kakaoId = String(account.providerAccountId);

        const { data } = await supabase
          .from("users")
          .select("id, role, tier, nickname, profile_image")
          .eq("kakao_id", kakaoId)
          .single();

        if (data) {
          token.userId = data.id;
          token.role = data.role;
          token.tier = data.tier;
          token.nickname = data.nickname;
          token.profileImage = data.profile_image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.userId;
        (session.user as Record<string, unknown>).role = token.role;
        (session.user as Record<string, unknown>).tier = token.tier;
        (session.user as Record<string, unknown>).nickname = token.nickname;
        (session.user as Record<string, unknown>).profileImage = token.profileImage;
      }
      return session;
    },
  },
};
