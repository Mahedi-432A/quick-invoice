"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

// ১. টাইপ ডেফিনিশন (Type Definitions)
interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface ClientInfo {
  name: string;
  email: string;
  address: string;
}

interface InvoiceData {
  invoiceName: string;
  date: string | Date; // ডাটাবেস থেকে string হিসেবে আসতে পারে
  dueDate: string | Date;
  status: string;
  clientId: ClientInfo;
  items: InvoiceItem[];
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
}

interface SettingsData {
  businessName: string;
  businessAddress: string;
  currency: string;
}

interface InvoicePDFProps {
  invoice: InvoiceData;
  settings: SettingsData | null; // সেটিংস নাও থাকতে পারে
}

export function InvoicePDF({ invoice, settings }: InvoicePDFProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: invoice.invoiceName,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => handlePrint()}>
          <Printer className="mr-2 h-4 w-4" /> Print / Download PDF
        </Button>
      </div>

      <Card className="p-10 bg-white shadow-lg print:shadow-none" ref={contentRef}>
        
        {/* Header */}
        <div className="flex justify-between border-b pb-8">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-800">Invoice</h1>
            <p className="text-gray-500 mt-1"># {invoice.invoiceName}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">{settings?.businessName || "Your Business"}</h2>
            <p className="text-gray-500 text-sm whitespace-pre-line">
              {settings?.businessAddress || "Address not set"}
            </p>
          </div>
        </div>

        {/* Client & Date Info */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Bill To:</h3>
            <p className="font-bold mt-1">{invoice.clientId?.name}</p>
            <p className="text-gray-500 text-sm">{invoice.clientId?.address || "N/A"}</p>
            <p className="text-gray-500 text-sm">{invoice.clientId?.email}</p>
          </div>
          <div className="text-right">
            <div className="flex justify-end gap-4 text-sm">
              <span className="text-gray-500">Date:</span>
              <span className="font-medium">{format(new Date(invoice.date), "dd MMM yyyy")}</span>
            </div>
            <div className="flex justify-end gap-4 text-sm mt-1">
              <span className="text-gray-500">Due Date:</span>
              <span className="font-medium">{format(new Date(invoice.dueDate), "dd MMM yyyy")}</span>
            </div>
            <div className="flex justify-end gap-4 text-sm mt-1">
              <span className="text-gray-500">Status:</span>
              <span className={`font-bold capitalize ${invoice.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                {invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 text-sm font-semibold text-gray-600">Description</th>
                <th className="py-3 text-sm font-semibold text-gray-600 text-center">Qty</th>
                <th className="py-3 text-sm font-semibold text-gray-600 text-right">Price</th>
                <th className="py-3 text-sm font-semibold text-gray-600 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 text-sm">{item.description}</td>
                  <td className="py-3 text-sm text-center">{item.quantity}</td>
                  <td className="py-3 text-sm text-right">{item.price}</td>
                  <td className="py-3 text-sm text-right font-medium">
                    {item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-8 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{invoice.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>{invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>Total</span>
              <span>{settings?.currency || "BDT"} {invoice.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t pt-8 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
        </div>

      </Card>
    </div>
  );
}