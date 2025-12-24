import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Client name is required"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    image: {
      type: String, // ফিউচার ইউজ (যদি ক্লায়েন্টের লোগো থাকে)
    },
  },
  { timestamps: true }
);

// মডেল কম্পাইলেশন চেক
const Client = mongoose.models?.Client || mongoose.model("Client", clientSchema);

export default Client;