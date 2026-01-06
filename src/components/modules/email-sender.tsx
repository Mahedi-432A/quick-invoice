"use client";

import { sendInvoiceEmail } from "@/actions/email-actions";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function EmailSender({ invoiceId, email }: { invoiceId: string, email?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!email) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Client does not have an email address!",
      });
      return;
    }

    // ১. কনফার্মেশন অ্যালার্ট
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: `Do you want to send this invoice to ${email}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send it!",
    });

    if (result.isConfirmed) {
      setLoading(true);

      // ২. লোডিং অ্যালার্ট (অ্যাকশন চলার সময়)
      MySwal.fire({
        title: "Sending Email...",
        text: "Please wait while we send the invoice.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await sendInvoiceEmail(invoiceId);
      setLoading(false);

      // ৩. সাকসেস বা এরর অ্যালার্ট
      if (response.success) {
        MySwal.fire({
          icon: "success",
          title: "Sent!",
          text: "The invoice has been sent successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: "Failed!",
          text: response.error,
        });
      }
    }
  }

  return (
    <Button variant="outline" onClick={handleSend} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      {loading ? "Sending..." : "Send to Client"}
    </Button>
  );
}