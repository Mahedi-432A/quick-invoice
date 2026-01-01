import { getInvoiceById } from "@/actions/invoice-actions";
import { getSettings } from "@/actions/settings-actions";
import { auth } from "@/auth";
import { InvoicePDF } from "@/components/modules/invoice-pdf"; // এই ফাইলটা আমরা পরের স্টেপে বানাবো
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { updateInvoiceStatus } from "@/actions/invoice-actions";

export default async function InvoiceViewPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session) redirect("/login");

  // Next.js 15 এ params একটি Promise, তাই await করতে হয়
  const { id } = await params;

  // ইনভয়েস এবং বিজনেস সেটিংস দুটোই আনছি
  const invoice = await getInvoiceById(id);
  const settings = await getSettings();

  if (!invoice) {
    return <div className="p-10 text-center">Invoice not found!</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">View Invoice</h1>
        </div>

        {/* স্ট্যাটাস বাটন (Server Action Form) */}
        <form
          action={async () => {
            "use server";
            // লজিক: Paid থাকলে Pending হবে, Pending থাকলে Paid হবে
            const newStatus = invoice.status === "paid" ? "pending" : "paid";
            await updateInvoiceStatus(invoice._id, newStatus);
          }}
        >
          <Button
            // স্ট্যাটাস অনুযায়ী বাটনের কালার চেঞ্জ হবে
            variant={invoice.status === "paid" ? "outline" : "default"}
            className={
              invoice.status === "paid"
                ? "text-green-600 border-green-600 hover:bg-green-50"
                : ""
            }
          >
            {invoice.status === "paid" ? "Mark as Pending" : "Mark as Paid"}
          </Button>
        </form>
      </div>

      {/* আমরা PDF ডিজাইনটি আলাদা কম্পোনেন্টে রাখছি যাতে রি-ইউজ করা যায় */}
      <InvoicePDF invoice={invoice} settings={settings} />
    </div>
  );
}
