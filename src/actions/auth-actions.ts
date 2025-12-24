"use server"; // এই লাইনটি খুব গুরুত্বপূর্ণ, এটি ফাংশনগুলোকে সার্ভারে রান করায়

import { signIn } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user-model";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signOut } from "@/auth";

// ১. রেজিস্ট্রেশন অ্যাকশন
export async function registerUser(formData: FormData) {
  // ফর্ম থেকে ডাটা নেওয়া
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  try {
    await connectDB();

    // চেক করা ইউজার আগে থেকেই আছে কি না
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    // পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // নতুন ইউজার তৈরি
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return { success: "Account created successfully! Please login." };
  } catch (error) {
    return { error: "Something went wrong during registration." };
  }
}

// ২. লগইন অ্যাকশন
export async function loginUser(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "All fields are required" };
  }

  try {
    // Auth.js এর signIn ফাংশন কল করা
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard", // লগইন সফল হলে ড্যাশবোর্ডে পাঠাবে
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error; // রিডাইরেক্ট এর জন্য এরর থ্রো করতে হয়
  }
}

// ৩. লগআউট অ্যাকশন
export async function logoutUser() {
  await signOut({
    redirectTo: "/login", // লগআউট হলে লগইন পেজে পাঠাবে
  });
}