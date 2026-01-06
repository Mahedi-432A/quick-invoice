"use client";

import { deleteInvoice } from "@/actions/invoice-actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useState } from "react";

const MySwal = withReactContent(Swal);

export function DeleteInvoiceBtn({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      
      // ডিলিট অ্যাকশন কল করা
      const res = await deleteInvoice(invoiceId);
      
      setLoading(false);

      if (res?.success) {
        MySwal.fire({
          title: "Deleted!",
          text: "Your invoice has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        MySwal.fire({
          title: "Error!",
          text: "Could not delete the invoice.",
          icon: "error",
        });
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}