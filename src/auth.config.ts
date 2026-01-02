import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // লগইন না থাকলে ড্যাশবোর্ডে ঢুকতে দিবে না (Redirect to /login)
      } else if (isLoggedIn) {
        // লগইন থাকা অবস্থায় কেউ /login বা /register এ গেলে ড্যাশবোর্ডে পাঠাবে
        if (nextUrl.pathname === "/login" || nextUrl.pathname === "/register") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }
      return true;
    },
  },
  providers: [], // এখানে প্রোভাইডার ফাঁকা থাকবে, মূল auth.ts এ থাকবে
} satisfies NextAuthConfig;