"use client";

import { submitPaymentRequest } from "@/actions/payment-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
// প্রোডাকশনে 'sonner' বা 'react-hot-toast' ব্যবহার করা ভালো, আপাতত alert রাখলাম
// import { toast } from "sonner"; 

export function ManualPaymentModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await submitPaymentRequest(formData);

    setLoading(false);

    if (result.success) {
      setOpen(false);
      alert("Success: " + result.success); // Toast হলে: toast.success(result.success)
    } else {
      alert("Error: " + result.error); // Toast হলে: toast.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-linear-to-r from-pink-600 to-purple-600 text-white hover:opacity-90 border-0 shadow-md">
          Upgrade to Pro (900 BDT)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Manual Payment Request</DialogTitle>
          <DialogDescription>
            Send <strong>500 BDT</strong> via &quot;Send Money&quot; option.
          </DialogDescription>
        </DialogHeader>

        {/* Payment Info Box */}
        <div className="bg-slate-50 p-4 rounded-md text-sm space-y-2 border border-slate-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-pink-600">Bkash (Personal):</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border">017XXXXXXXX</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-orange-600">Nagad (Personal):</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border">018XXXXXXXX</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-500">Rocket (Personal):</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border">018XXXXXXXX</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          
          {/* Method Selection */}
          <div className="grid gap-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select name="method" required>
              <SelectTrigger>
                <SelectValue placeholder="Select Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bkash">Bkash</SelectItem>
                <SelectItem value="nagad">Nagad</SelectItem>
                <SelectItem value="rocket">Rocket</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sender Number Input (NEW ADDED) */}
          <div className="grid gap-2">
            <Label htmlFor="senderNumber">Sender Number (যে নম্বর থেকে পাঠিয়েছেন)</Label>
            <Input 
                id="senderNumber" 
                name="senderNumber" 
                placeholder="017..." 
                type="tel" 
                minLength={11}
                required 
            />
          </div>
          
          {/* Transaction ID Input */}
          <div className="grid gap-2">
            <Label htmlFor="trxId">Transaction ID (TrxID)</Label>
            <Input 
                id="trxId" 
                name="trxId" 
                placeholder="e.g. 9H7G6X..." 
                required 
                className="uppercase placeholder:normal-case"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Submit Payment Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}