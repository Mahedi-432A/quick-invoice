"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Payment from "@/models/payment-model";
import User from "@/models/user-model";
import { revalidatePath } from "next/cache";

// ১. সব পেমেন্ট লিস্ট নিয়ে আসা
export async function getAllPayments() {
  const session = await auth();
  
  // সিকিউরিটি চেক: শুধুমাত্র এডমিন অ্যাক্সেস করতে পারবে
  if (session?.user?.role !== "admin") return [];

  await connectDB();

  const payments = await Payment.find({})
    .populate("userId", "name email") // ইউজারের নাম ও ইমেইল সহ আনবে
    .sort({ createdAt: -1 }); // নতুন রিকোয়েস্ট আগে দেখাবে

  return JSON.parse(JSON.stringify(payments));
}

// ২. পেমেন্ট অ্যাপ্রুভ বা রিজেক্ট করা
export async function updatePaymentStatus(paymentId: string, status: "approved" | "rejected") {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Unauthorized" };

  try {
    await connectDB();

    // পেমেন্ট টি খুঁজে বের করা
    const payment = await Payment.findById(paymentId);
    if (!payment) return { error: "Payment not found" };

    // স্ট্যাটাস আপডেট করা
    payment.status = status;
    await payment.save();

    // যদি অ্যাপ্রুভ করা হয়, তাহলে ইউজারকে 'Pro' প্ল্যানে আপগ্রেড করা হবে
    if (status === "approved") {
      await User.findByIdAndUpdate(payment.userId, {
        plan: "pro",
        subscriptionStatus: "active",
      });
    }

    // যদি রিজেক্ট করা হয়, ইউজার আবার ফ্রি প্ল্যানেই থাকবে (কিছু করতে হবে না)

    revalidatePath("/admin");
    return { success: `Payment ${status} successfully!` };
  } catch (error) {
    return { error: "Failed to update status" };
  }
}