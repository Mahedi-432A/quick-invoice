"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Payment from "@/models/payment-model";
import { revalidatePath } from "next/cache";
import { MongoServerError } from "mongodb";
import mongoose from "mongoose";


export type ActionResult = {
  success?: string;
  error?: string;
};

interface PaymentData {
  _id: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  status: string;
  amount: number;
  createdAt: Date;
}

export async function submitPaymentRequest(
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized access. Please login." };
  }

  const method = formData.get("method")?.toString();
  const trxId = formData.get("trxId")?.toString().trim();
  const senderNumber = formData.get("senderNumber")?.toString().trim();

  if (!method || !["bkash", "nagad", "rocket"].includes(method)) {
    return { error: "Invalid payment method selected." };
  }
  if (!trxId || trxId.length < 5) {
    return { error: "Invalid Transaction ID." };
  }
  if (!senderNumber || senderNumber.length < 11) {
     return { error: "Invalid Sender Number." };
  }

  try {
    await connectDB();

    const existingPending = await Payment.findOne({
      userId: session.user.id,
      status: "pending",
    });

    if (existingPending) {
      return {
        error: "You already have a pending request. Please wait for admin approval.",
      };
    }

    await Payment.create({
      userId: session.user.id,
      amount: 500,
      paymentMethod: method,
      senderNumber: senderNumber,
      transactionId: trxId.toUpperCase(),
      status: "pending",
    });

    revalidatePath("/dashboard/subscription");

    return {
      success: "Payment submitted successfully! Wait for approval.",
    };
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return { error: "This Transaction ID has already been used." };
    }
    console.error("Payment Submission Error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function getPendingPayment() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    await connectDB();
    
    const payment = await Payment.findOne({
      userId: session.user.id,
      status: "pending",
    }).select("status createdAt amount userId").lean() as unknown as PaymentData | null;

    if(payment) {
        return {
            ...payment,
            _id: payment._id.toString(),
            userId: payment.userId.toString()
        }
    }
    return null;
  } catch (error) {
    console.error("Fetch Payment Error", error);
    return null;
  }
}