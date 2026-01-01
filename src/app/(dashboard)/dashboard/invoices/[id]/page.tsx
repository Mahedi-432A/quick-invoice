import { getInvoiceById } from "@/actions/invoice-actions";
import { getSettings } from "@/actions/settings-actions";
import { auth } from "@/auth";
import { InvoicePDF } from "@/components/modules/invoice-pdf";
import { PaymentModal } from "@/components/modules/payment-modal"; // নতুন ইমপোর্ট
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function InvoiceViewPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect("/login");
  
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  const settings = await getSettings();

  if (!invoice) {
    return <div className="p-10 text-center">Invoice not found!</div>;
  }

  // ক্যালকুলেশন
  const paidAmount = invoice.paidAmount || 0;
  const dueAmount = invoice.totalAmount - paidAmount;
  const isFullyPaid = paidAmount >= invoice.totalAmount;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">View Invoice</h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-sm text-gray-500">#{invoice.invoiceName}</span>
               <Badge variant={isFullyPaid ? "default" : "secondary"} className={!isFullyPaid ? "bg-orange-100 text-orange-700 hover:bg-orange-100" : "bg-green-600 hover:bg-green-700"}>
                 {isFullyPaid ? "PAID" : "PENDING / DUE"}
               </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* যদি টাকা বাকি থাকে, তবেই Payment বাটন দেখাবো */}
          {!isFullyPaid && (
            <PaymentModal invoiceId={invoice._id} dueAmount={dueAmount} />
          )}
        </div>
      </div>

      {/* Payment Summary Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded border shadow-sm">
           <p className="text-sm text-gray-500">Total Amount</p>
           <p className="text-2xl font-bold">{settings?.currency} {invoice.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
           <p className="text-sm text-gray-500">Total Paid</p>
           <p className="text-2xl font-bold text-green-600">{settings?.currency} {paidAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
           <p className="text-sm text-gray-500">Amount Due</p>
           <p className="text-2xl font-bold text-orange-600">{settings?.currency} {dueAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* PDF View */}
      <InvoicePDF invoice={invoice} settings={settings} />
    </div>
  );
}