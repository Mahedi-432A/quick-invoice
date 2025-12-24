"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Settings from "@/models/settings-model";
import { revalidatePath } from "next/cache";

// ১. সেটিংস নিয়ে আসা (Fetch)
export async function getSettings() {
  const session = await auth();
  
  // যদি সেশন না থাকে, ক্রাশ না করে null রিটার্ন করো
  if (!session?.user?.id) {
    return null;
  }

  await connectDB();
  const settings = await Settings.findOne({ userId: session.user.id });
  
  return settings ? JSON.parse(JSON.stringify(settings)) : null;
}

// ২. সেটিংস আপডেট বা তৈরি করা (Update/Create)
export async function updateSettings(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const businessName = formData.get("businessName");
  const businessAddress = formData.get("businessAddress");
  const currency = formData.get("currency");
  const taxPercentage = formData.get("taxPercentage");

  try {
    await connectDB();

    // findOneAndUpdate: থাকলে আপডেট করবে, না থাকলে নতুন বানাবে (upsert: true)
    await Settings.findOneAndUpdate(
      { userId: session.user.id },
      {
        userId: session.user.id,
        businessName,
        businessAddress,
        currency,
        taxPercentage,
      },
      { upsert: true, new: true }
    );

    // পেজ রিফ্রেশ না করে ডাটা আপডেট দেখানোর জন্য
    revalidatePath("/dashboard/settings");
    
    return { success: "Settings updated successfully!" };
  } catch (error) {
    return { error: "Failed to update settings" };
  }
}