import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    invoiceName: {
      type: String, // যেমন: Invoice #001
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "paid", "overdue"],
      default: "draft",
    },
    // আইটেম লিস্ট (Array)
    items: [
      {
        description: String,
        quantity: Number,
        price: Number,
        total: Number, // quantity * price
      },
    ],
    subTotal: Number, // ট্যাক্সের আগে মোট দাম
    taxRate: {
      type: Number,
      default: 0,
    },
    taxAmount: Number,
    totalAmount: Number, // ফাইনাল দাম
    notes: String, // কাস্টমারকে দেওয়ার জন্য নোট
  },
  { timestamps: true }
);

const Invoice = mongoose.models?.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;