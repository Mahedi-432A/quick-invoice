"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Client from "@/models/client-model";
import { revalidatePath } from "next/cache";

// ১. সব ক্লায়েন্ট নিয়ে আসা (Get All Clients)
export async function getClients() {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectDB();

  // শুধু লগইন করা ইউজারের ক্লায়েন্টগুলো আনবে এবং নতুনগুলো আগে দেখাবে
  const clients = await Client.find({ userId: session.user.id })
    .sort({ createdAt: -1 });

  // MongoDB অবজেক্টকে প্লেইন জেসন-এ কনভার্ট করা (ওয়ার্নিং এড়াতে)
  return JSON.parse(JSON.stringify(clients));
}

// ২. নতুন ক্লায়েন্ট তৈরি করা (Create Client)
export async function createClient(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  if (!name) {
    return { error: "Client name is required" };
  }

  try {
    await connectDB();

    await Client.create({
      userId: session.user.id, // খুব গুরুত্বপূর্ণ: ক্লায়েন্টকে ইউজারের সাথে লিঙ্ক করা
      name,
      email,
      phone,
      address,
    });

    // পেজ রিফ্রেশ করা যাতে টেবিলে নতুন ডাটা সাথে সাথে দেখা যায়
    revalidatePath("/dashboard/clients");

    return { success: "Client added successfully!" };
  } catch (error) {
    return { error: "Failed to create client" };
  }
}

// ৩. ক্লায়েন্ট ডিলিট করা (Delete Client)
export async function deleteClient(clientId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    // চেক করছি ক্লায়েন্টটি আসলেই এই ইউজারের কি না (সিকিউরিটি)
    const client = await Client.findOneAndDelete({
      _id: clientId,
      userId: session.user.id,
    });

    if (!client) {
      return { error: "Client not found or unauthorized" };
    }

    revalidatePath("/dashboard/clients");
    return { success: "Client deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete client" };
  }
}