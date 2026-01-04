"use client";

import { sendInvoiceEmail } from "@/actions/email-actions";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";

export function EmailSender({ invoiceId, email }: { invoiceId: string, email?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!email) {
      alert("Client does not have an email address!");
      return;
    }
    
    const confirmSend = confirm(`Send this invoice to ${email}?`);
    if (!confirmSend) return;

    setLoading(true);
    const result = await sendInvoiceEmail(invoiceId);
    setLoading(false);

    if (result.success) {
      alert(result.success);
    } else {
      alert(result.error);
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