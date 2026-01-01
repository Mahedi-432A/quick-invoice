"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Invoice from "@/models/invoice-model";
import Client from "@/models/client-model";
import { revalidatePath } from "next/cache";

// টাইপ ডেফিনিশন আপডেট (invoiceName এখন অপশনাল, কারণ সার্ভার এটি বানাবে)
interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceData {
  clientId: string;
  invoiceName?: string; // এটি এখন অপশনাল (?)
  date: Date;
  dueDate: Date;
  status: string;
  items: InvoiceItem[];
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
}

export async function getInvoices() {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectDB();
  const invoices = await Invoice.find({ userId: session.user.id })
    .populate({ 
      path: "clientId", 
      model: Client, // এই লাইনটি ম্যাজিক করবে
      select: "name email" // শুধু নাম আর ইমেইল আনবে
    })
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(invoices));
}

export async function createInvoice(data: InvoiceData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await connectDB();
    // ইনভয়েস নাম জেনারেট করছি সার্ভারে
    const invoiceName = `INV-${Date.now().toString().slice(-6)}`;

    await Invoice.create({
      userId: session.user.id,
      invoiceName, // জেনারেট করা নাম
      ...data,
    });

    revalidatePath("/dashboard/invoices");
    return { success: "Invoice created successfully!" };
  } catch (error) {
    console.log(error);
    return { error: "Failed to create invoice" };
  }
}

export async function deleteInvoice(invoiceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await connectDB();
    await Invoice.findOneAndDelete({ _id: invoiceId, userId: session.user.id });
    revalidatePath("/dashboard/invoices");
    return { success: "Deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete" };
  }
}

export async function getInvoiceById(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectDB();

  const invoice = await Invoice.findOne({ _id: id, userId: session.user.id })
    .populate("clientId")
    .populate("userId"); // ইউজারের বিজনেস ইনফো (লোগো, ঠিকানা) পাওয়ার জন্য

  if (!invoice) return null;

  return JSON.parse(JSON.stringify(invoice));
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await connectDB();
    
    // ডাটাবেসে স্ট্যাটাস আপডেট করা
    await Invoice.findOneAndUpdate(
      { _id: invoiceId, userId: session.user.id }, // সিকিউরিটি: শুধু নিজের ইনভয়েস আপডেট হবে
      { status: status }
    );
    
    // UI আপডেট করার জন্য ক্যাশ ক্লিয়ার করা
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    revalidatePath("/dashboard/invoices");
    
    return { success: "Status updated" };
  } catch (error) {
    return { error: "Failed to update status" };
  }
}