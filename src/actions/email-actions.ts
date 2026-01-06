"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Invoice from "@/models/invoice-model";
import Settings from "@/models/settings-model";
import nodemailer from "nodemailer";
import User from "@/models/user-model";

// ১. আইটেমের জন্য টাইপ ডিফাইন করা (Fix for 'any' warning)
interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export async function sendInvoiceEmail(invoiceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await connectDB();

    // ইনভয়েস এবং সেটিংস ডাটা আনা
    const invoice = await Invoice.findById(invoiceId).populate("clientId");
    const settings = await Settings.findOne({ userId: session.user.id });

    // ইউজারের প্ল্যান চেক করা (Watermark Logic এর জন্য)
    const user = await User.findById(session.user.id).select("plan");
    const isPro = user?.plan === "pro";

    if (!invoice || !invoice.clientId) return { error: "Invoice or Client not found" };

    const businessName = settings?.businessName || "QuickInvoice User";
    const currency = settings?.currency || "BDT";
    const clientEmail = invoice.clientId.email;

    if (!clientEmail) return { error: "Client does not have an email address." };

    // ইমেইল ট্রান্সপোর্টার কনফিগারেশন
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // ২. ব্র্যান্ডিং লজিক (যদি প্রো না হয়, তবেই দেখাবে)
    const brandingHtml = !isPro
      ? `
        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px dashed #eee;">
          <p style="font-size: 12px; color: #888; margin: 0;">
            Powered by <strong style="color: #000;">QuickInvoice</strong>
          </p>
          <p style="font-size: 10px; color: #aaa; margin: 5px 0 0 0;">
            Create your own professional invoices for free.
          </p>
        </div>
      `
      : "";

    // ৩. HTML টেমপ্লেট
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #ffffff;">
        
        <h2 style="color: #333; margin-top: 0;">Invoice from ${businessName}</h2>
        <p style="color: #555;">Hi <strong>${invoice.clientId.name}</strong>,</p>
        <p style="color: #555;">Please find the invoice details below. We appreciate your business!</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Invoice No:</strong> ${invoice.invoiceName}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(invoice.date).toDateString()}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> ${currency} ${invoice.totalAmount}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> 
            <span style="color: ${invoice.status === 'paid' ? 'green' : '#e67e22'}; font-weight: bold;">
              ${invoice.status.toUpperCase()}
            </span>
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #eee; text-align: left;">
              <th style="padding: 10px; border-bottom: 2px solid #ddd; color: #444;">Item</th>
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center; color: #444;">Qty</th>
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right; color: #444;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item: InvoiceItem) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #555;">${item.description}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; color: #555;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; color: #555;">${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 20px;">
          <h3 style="margin: 0; color: #333;">Total Due: ${currency} ${(invoice.totalAmount - invoice.paidAmount).toFixed(2)}</h3>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        
        <p style="font-size: 12px; color: #888;">Sent via ${businessName}</p>

        ${brandingHtml} 
      </div>
    `;

    // ইমেইল পাঠানো
    await transporter.sendMail({
      from: `"${businessName}" <${process.env.SMTP_EMAIL}>`,
      to: clientEmail,
      subject: `Invoice #${invoice.invoiceName} from ${businessName}`,
      html: emailHtml,
    });

    return { success: `Invoice sent to ${clientEmail}` };

  } catch (error) {
    console.error(error);
    return { error: "Failed to send email. Check SMTP settings." };
  }
}