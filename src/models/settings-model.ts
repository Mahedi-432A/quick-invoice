import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // একজন ইউজারের একটাই সেটিংস থাকবে
    },
    businessName: {
      type: String,
      required: true,
      default: "My Business",
    },
    businessAddress: {
      type: String,
    },
    logoUrl: {
      type: String, // আপাতত আমরা ইমেজের লিঙ্ক রাখব
    },
    currency: {
      type: String,
      default: "BDT", // ডিফল্ট টাকা
    },
    taxPercentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.models?.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;