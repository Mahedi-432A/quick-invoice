import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // সেশন চেক করা (সার্ভার সাইড প্রটেকশন)
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-500">
        Welcome back, <span className="font-bold text-black">{session.user?.name}</span>
      </p>
      
      {/* স্ট্যাটাস কার্ড (আপাতত ডামি ডাটা) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">৳ 0.00</p>
        </div>
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Invoices</h3>
          <p className="text-2xl font-bold mt-2">+0</p>
        </div>
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Clients</h3>
          <p className="text-2xl font-bold mt-2">+0</p>
        </div>
      </div>
    </div>
  );
}