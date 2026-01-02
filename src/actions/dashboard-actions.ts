"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Client from "@/models/client-model";
import Invoice from "@/models/invoice-model";
import { Types } from "mongoose";
import { subMonths, startOfMonth, format } from "date-fns";

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectDB();
  const userId = session.user.id;

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id");
  }

  const userObjectId = new Types.ObjectId(userId);

  // --- নতুন লজিক: গত ১২ মাসের রেঞ্জ বের করা ---
  const today = new Date();
  const startDate = startOfMonth(subMonths(today, 11));

  // ১. মোট ক্লায়েন্ট সংখ্যা
  const totalClients = await Client.countDocuments({ userId });

  // ২. মোট ইনভয়েস সংখ্যা
  const totalInvoices = await Invoice.countDocuments({ userId });

  // ৩. মোট আয় (Total Revenue) - শুধুমাত্র 'paid' ইনভয়েসগুলো যোগ করা হবে
  const revenueResult = await Invoice.aggregate([
    { $match: { userId: userObjectId, status: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // ৪. পেন্ডিং বা ডিউ অ্যামাউন্ট
  const dueResult = await Invoice.aggregate([
    {
      $match: { userId: userObjectId, status: { $in: ["pending", "overdue"] } },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: { $subtract: ["$totalAmount", "$paidAmount"] },
        },
      },
    },
  ]);
  const totalDue = dueResult[0]?.total || 0;

  // ৫. গ্রাফ ডাটা (Monthly Revenue - Last 12 Months)
  // এটি একটু অ্যাডভান্সড কুয়েরি যা মাস অনুযায়ী ডাটা গ্রুপ করবে
  const monthlyRevenue = await Invoice.aggregate([
    {
      $match: {
        userId: userObjectId,
        status: "paid",
        date: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
        total: { $sum: "$totalAmount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // ডাটা ফরম্যাটিং: ডাটাবেসে কোনো মাসের ডাটা না থাকলে সেটা ০ দিয়ে ফিল করা
  const graphData = [];
  
  for (let i = 11; i >= 0; i--) {
    const dateCalc = subMonths(today, i);
    const monthNum = dateCalc.getMonth() + 1; // JS month 0-11, MongoDB 1-12
    const yearNum = dateCalc.getFullYear();

    // ডাটাবেস রেজাল্ট থেকে এই মাস ও বছরের ডাটা খোঁজা
    const foundData = monthlyRevenue.find(
      (d) => d._id.year === yearNum && d._id.month === monthNum
    );

    graphData.push({
      name: format(dateCalc, "MMM"), // শুধু মাসের নাম (Jan, Feb) অথবা চাইলে "MMM yy" (Jan 25) দিতে পারেন
      total: foundData ? foundData.total : 0,
    });
  }

  // ৬. রিসেন্ট সেলস (শেষ ৫টি ইনভয়েস)
  const recentInvoices = await Invoice.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("clientId", "name email")
    .lean(); // .lean() ব্যবহার করলে প্লেইন জেসন অবজেক্ট পাওয়া যায়

  // ডাটা রিটার্ন
  return {
    totalClients,
    totalInvoices,
    totalRevenue,
    totalDue,
    graphData,
    recentSales: JSON.parse(JSON.stringify(recentInvoices)),
  };
}
