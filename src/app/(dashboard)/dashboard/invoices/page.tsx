import { getInvoices, deleteInvoice } from "@/actions/invoice-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Plus, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// ইনভয়েস টাইপ ইন্টারফেস
interface Invoice {
  _id: string;
  invoiceName: string;
  clientId: {
    name: string;
    email: string;
  };
  totalAmount: number;
  status: string;
  date: string;
  dueDate: string;
}

export default async function InvoicesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const invoices: Invoice[] = await getInvoices();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Link href="/dashboard/invoices/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </Link>
      </div>

      {/* Invoice Table */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  No invoices found. Create your first invoice!
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceName}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{invoice.clientId?.name}</span>
                      <span className="text-xs text-gray-500">{invoice.clientId?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.date), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={invoice.status === "paid" ? "default" : "secondary"}
                      className={invoice.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ৳ {invoice.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* View / Print Button (Future Phase) */}
                      <Link href={`/dashboard/invoices/${invoice._id}`}>
                         <Button variant="outline" size="icon">
                           <FileText className="h-4 w-4" />
                         </Button>
                      </Link>

                      {/* Delete Button */}
                      <form
                        action={async () => {
                          "use server";
                          await deleteInvoice(invoice._id);
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}