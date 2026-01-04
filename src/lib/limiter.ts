import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Invoice from "@/models/invoice-model";
import User from "@/models/user-model";
import { startOfMonth, endOfMonth } from "date-fns";
import { MAX_FREE_INVOICES } from "./config";

export async function checkInvoiceLimit() {
  const session = await auth();
  if (!session?.user?.id) return false;

  await connectDB();
  
  // ১. ইউজারের বর্তমান প্ল্যান চেক করা
  const user = await User.findById(session.user.id).select("plan");
  
  // যদি ইউজার PRO হয়, তাহলে কোনো লিমিট নেই (Always True)
  if (user?.plan === "pro") return true;

  // ২. যদি FREE হয়, তবে চেক করো এই মাসে কয়টা বানিয়েছে
  const now = new Date();
  const firstDay = startOfMonth(now);
  const lastDay = endOfMonth(now);

  const count = await Invoice.countDocuments({
    userId: session.user.id,
    createdAt: { $gte: firstDay, $lte: lastDay }, // এই মাসের ১ তারিখ থেকে শেষ তারিখ পর্যন্ত
  });

  // ৩. যদি লিমিটের কম হয়, তবে সত্য (True), নাহলে মিথ্যা (False)
  if (count < MAX_FREE_INVOICES) {
    return true;
  } else {
    return false; // লিমিট শেষ
  }
}

// ইউজার কতটা ব্যবহার করেছে তা জানার জন্য
export async function getUserUsage() {
  const session = await auth();
  if (!session?.user?.id) return { count: 0, limit: 5, plan: "free" };

  await connectDB();
  const user = await User.findById(session.user.id).select("plan");
  
  const now = new Date();
  const count = await Invoice.countDocuments({
    userId: session.user.id,
    createdAt: { $gte: startOfMonth(now), $lte: endOfMonth(now) },
  });

  return {
    count,
    limit: user?.plan === "pro" ? 100000 : MAX_FREE_INVOICES,
    plan: user?.plan || "free",
  };
}