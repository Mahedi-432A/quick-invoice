import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/user-model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await connectDB();
        
        // পাসওয়ার্ড ফিল্ডটি explicitly সিলেক্ট করতে হবে কারণ মডেলে select: false দেওয়া আছে
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.password) {
          throw new Error("Please login with Google"); // যদি কেউ আগে গুগল দিয়ে একাউন্ট খুলে থাকে
        }

        // পাসওয়ার্ড ম্যাচ করানো
        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        // সফল হলে ইউজারের বেসিক তথ্য রিটার্ন করবে
        return { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email,
          role: user.role // আমরা সেশনে রোল পাঠাতে চাই
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // ডিফল্ট লগইন পেজের বদলে আমাদের কাস্টম পেজ দেখাবে
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // টোকেনে রোল সেভ করা
        token.sub = user.id; // নিশ্চিত করা হচ্ছে যে ID টোকেনে আছে
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.role = token.role; // সেশনে রোল অ্যাভেইলেবল করা
        session.user.id = token.sub; // সেশনে ইউজার আইডি অ্যাভেইলেবল করা
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});