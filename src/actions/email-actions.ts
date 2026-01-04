"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Invoice from "@/models/invoice-model";
import Settings from "@/models/settings-model";
import nodemailer from "nodemailer";

export async function sendInvoiceEmail(invoiceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await connectDB();

    // ১. ইনভয়েস এবং সেটিংস ডাটা আনা
    const invoice = await Invoice.findById(invoiceId).populate("clientId");
    const settings = await Settings.findOne({ userId: session.user.id });

    if (!invoice || !invoice.clientId) return { error: "Invoice or Client not found" };

    const businessName = settings?.businessName || "QuickInvoice User";
    const currency = settings?.currency || "BDT";
    const clientEmail = invoice.clientId.email;

    if (!clientEmail) return { error: "Client does not have an email address." };

    // ২. ইমেইল ট্রান্সপোর্টার কনফিগারেশন
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // ৩. সুন্দর HTML টেমপ্লেট তৈরি
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333;">Invoice from ${businessName}</h2>
        <p>Hi <strong>${invoice.clientId.name}</strong>,</p>
        <p>Please find the invoice details below. We appreciate your business!</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Invoice No:</strong> ${invoice.invoiceName}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(invoice.date).toDateString()}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> ${currency} ${invoice.totalAmount}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${invoice.status === 'paid' ? 'green' : 'orange'}">${invoice.status.toUpperCase()}</span></p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #eee; text-align: left;">
              <th style="padding: 10px; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item: any) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.description}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 20px;">
          <h3>Total Due: ${currency} ${(invoice.totalAmount - invoice.paidAmount).toFixed(2)}</h3>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #888;">Sent via QuickInvoice</p>
      </div>
    `;

    // ৪. ইমেইল পাঠানো
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