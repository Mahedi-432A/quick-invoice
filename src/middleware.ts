import NextAuth from "next-auth";
import { authConfig } from "./auth.config"; // নোট: এই ফাইলটি আমাদের তৈরি করতে হবে

export default NextAuth(authConfig).auth;

export const config = {
  // এই রাউটগুলোতে মিডলওয়্যার কাজ করবে (ইমেজ বা স্ট্যাটিক ফাইল বাদে)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};