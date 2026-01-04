import { getAllPayments, updatePaymentStatus } from "@/actions/admin-actions";
import { auth } from "@/auth";
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
import { Check, X } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();

  // সিকিউরিটি: যদি এডমিন না হয়, ড্যাশবোর্ডে পাঠিয়ে দাও
  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const payments = await getAllPayments();

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Panel - Payment Requests</h1>
        <Badge variant="outline" className="text-lg px-4 py-1">
           Total Requests: {payments.length}
        </Badge>
      </div>

      <div className="border rounded-lg bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>TrxID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">No payment requests found.</TableCell>
              </TableRow>
            ) : (
              payments.map((payment: any) => (
                <TableRow key={payment._id}>
                  <TableCell>
                    <div className="font-medium">{payment.userId?.name}</div>
                    <div className="text-xs text-gray-500">{payment.userId?.email}</div>
                  </TableCell>
                  <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                  <TableCell className="font-mono text-blue-600">{payment.transactionId}</TableCell>
                  <TableCell>৳{payment.amount}</TableCell>
                  <TableCell>
                    <Badge className={
                      payment.status === "approved" ? "bg-green-600" : 
                      payment.status === "pending" ? "bg-yellow-500" : "bg-red-600"
                    }>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {payment.status === "pending" && (
                      <>
                        {/* APPROVE BUTTON FORM */}
                        <form action={async () => {
                            "use server";
                            await updatePaymentStatus(payment._id, "approved");
                          }} 
                          className="inline-block"
                        >
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0">
                            <Check className="h-4 w-4" />
                          </Button>
                        </form>

                        {/* REJECT BUTTON FORM */}
                        <form action={async () => {
                            "use server";
                            await updatePaymentStatus(payment._id, "rejected");
                          }} 
                          className="inline-block"
                        >
                          <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </form>
                      </>
                    )}
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