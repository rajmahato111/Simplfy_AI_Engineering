import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Demo",
    credentials: {
      email: { label: "Email", type: "email", placeholder: "demo@simplify.ai" },
    },
    authorize(credentials) {
      if (credentials?.email === "demo@simplify.ai") {
        return { id: "demo", name: "Demo User", email: "demo@simplify.ai" };
      }
      return null;
    },
  }),
];

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.unshift(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers,
  pages: { signIn: "/login" },
});
