import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Performance: userId দিয়ে সার্চ ফাস্ট হবে
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "rocket"],
      required: true,
    },
    senderNumber: {
      type: String,
      required: true,
      trim: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true, // Performance: status দিয়ে ফিল্টার ফাস্ট হবে
    },
  },
  { timestamps: true }
);

// Prevent overwriting model during hot reload in dev
const Payment = mongoose.models?.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;