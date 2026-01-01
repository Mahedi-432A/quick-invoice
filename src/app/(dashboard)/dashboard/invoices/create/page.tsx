import { getClients } from "@/actions/client-actions";
import { getSettings } from "@/actions/settings-actions"; // ১. সেটিংস অ্যাকশন ইমপোর্ট
import { InvoiceForm } from "@/components/modules/invoice-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CreateInvoicePage() {
  const session = await auth();
  if (!session) redirect("/login");

  // ২. প্যারালাল ডাটা ফেচিং (Fast Performance)
  // আমরা একসাথে ক্লায়েন্ট এবং সেটিংস ডাটা আনছি
  const [clients, settings] = await Promise.all([
    getClients(),
    getSettings()
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Invoice</h1>
      </div>
      
      {/* ৩. settings থেকে taxPercentage ফর্মে পাঠাচ্ছি */}
      <InvoiceForm 
        clients={clients} 
        defaultTax={settings?.taxPercentage || 0} 
      />
    </div>
  );
}