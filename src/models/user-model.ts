import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"], // SaaS সাবস্ক্রিপশন প্ল্যান
      default: "free",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
    image: {
      type: String, // প্রোফাইল পিকচার বা Google Image
    },
    provider: {
      type: String, // 'credentials' অথবা 'google'
      default: "credentials",
    },
  },
  { timestamps: true }
);

// Next.js এ মডেল রিকম্পাইলেশন এরর এড়াতে এই চেকটি জরুরি
const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;