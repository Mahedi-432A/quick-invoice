"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Invoice from "@/models/invoice-model";
import Client from "@/models/client-model";
import { revalidatePath } from "next/cache";

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceData {
  clientId: string;
  invoiceName?: string;
  date: Date;
  dueDate: Date;
  status: string;
  items: InvoiceItem[];
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
}

export async function getInvoices() {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectDB();

  // --- নতুন লজিক শুরু (অটোমেটিক স্ট্যাটাস আপডেট) ---
  const now = new Date();
  
  // যেগুলোর ডিউ ডেট পার হয়ে গেছে এবং স্ট্যাটাস এখনো 'pending', সেগুলোকে 'overdue' করা হচ্ছে
  await Invoice.updateMany(
    {
      userId: session.user.id, // শুধু এই ইউজারের ডাটা চেক হবে
      status: "pending",
      dueDate: { $lt: now } // $lt মানে less than (বর্তমান সময়ের চেয়ে পুরনো)
    },
    {
      $set: { status: "overdue" }
    }
  );
  // --- নতুন লজিক শেষ ---

  const invoices = await Invoice.find({ userId: session.user.id })
    .populate({ 
      path: "clientId", 
      model: Client, 
      select: "name email" 
    })
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(invoices));
}

export async function createInvoice(data: InvoiceData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await connectDB();
    const invoiceName = `INV-${Date.now().toString().slice(-6)}`;

    // স্ট্যাটাস লজিক
    let calculatedStatus = "pending";
    if (data.paidAmount >= data.totalAmount) {
        calculatedStatus = "paid";
    }

    await Invoice.create({
      userId: session.user.id,
      invoiceName,
      ...data,
      status: calculatedStatus, // ফিক্স: এখানে ক্যালকুলেট করা স্ট্যাটাসটি ফোর্স করা হলো
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
    .populate("userId");

  if (!invoice) return null;

  return JSON.parse(JSON.stringify(invoice));
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await connectDB();
    
    await Invoice.findOneAndUpdate(
      { _id: invoiceId, userId: session.user.id },
      { status: status }
    );
    
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    revalidatePath("/dashboard/invoices");
    
    return { success: "Status updated" };
  } catch (error) {
    return { error: "Failed to update status" };
  }
}

export async function addPayment(invoiceId: string, amount: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await connectDB();
    
    const invoice = await Invoice.findOne({ _id: invoiceId, userId: session.user.id });
    if (!invoice) return { error: "Invoice not found" };

    const currentPaid = invoice.paidAmount || 0;
    const newPaidAmount = currentPaid + amount;

    let newStatus = "pending";
    if (newPaidAmount >= invoice.totalAmount) {
      newStatus = "paid";
    }

    invoice.paidAmount = newPaidAmount;
    invoice.status = newStatus;
    await invoice.save();

    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    return { success: "Payment added successfully" };
  } catch (error) {
    return { error: "Failed to add payment" };
  }
}