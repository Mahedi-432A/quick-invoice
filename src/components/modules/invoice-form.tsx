"use client";

import { createInvoice } from "@/actions/invoice-actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ১. আইটেম এবং ক্লায়েন্টের টাইপ ডিফাইন করা (Fix: Unexpected any)
interface Item {
  description: string;
  quantity: number;
  price: number;
}

interface Client {
  _id: string;
  name: string;
}

interface InvoiceFormProps {
  clients: Client[];
  defaultTax?: number;
}

export function InvoiceForm({ clients, defaultTax }: InvoiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [items, setItems] = useState<Item[]>([
    { description: "", quantity: 1, price: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(defaultTax || 0);

  const subTotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxAmount = (subTotal * taxRate) / 100;
  const totalAmount = subTotal + taxAmount;

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // ২. টাইপ সেফ আপডেট ফাংশন (Strictly Typed)
  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];

    if (field === "description") {
      // যদি description হয়, টাইপস্ক্রিপ্ট জানে ভ্যালু string হবে
      newItems[index].description = value as string;
    } else {
      // আর quantity বা price হলে ভ্যালু নাম্বার হবে
      newItems[index][field] = Number(value);
    }

    setItems(newItems);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!clientId || !date || !dueDate) {
      alert("Please fill required fields");
      setLoading(false);
      return;
    }

    // ৩. ফিক্স: এখানে invoiceName সরানো হয়েছে (Impure function error fix)
    const invoiceData = {
      clientId,
      // invoiceName: ... (এটি এখন সার্ভারে তৈরি হবে)
      date: date,
      dueDate: dueDate,
      status: "pending",
      items: items.map(item => ({...item, total: item.quantity * item.price})),
      subTotal,
      taxRate,
      taxAmount,
      totalAmount,
    };

    const res = await createInvoice(invoiceData);

    if (res.success) {
      router.push("/dashboard/invoices");
    } else {
      alert("Failed to create invoice");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Select Client</Label>
            <Select onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client._id} value={client._id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-semibold">Invoice Items</h3>
          </div>
          
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>Description</Label>
                <Input 
                  value={item.description} 
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="Item name" 
                  required
                />
              </div>
              <div className="w-24 space-y-2">
                <Label>Qty</Label>
                <Input 
                  type="number" 
                  min="1"
                  value={item.quantity} 
                  onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                />
              </div>
              <div className="w-32 space-y-2">
                <Label>Price</Label>
                <Input 
                  type="number" 
                  min="0"
                  value={item.price} 
                  onChange={(e) => updateItem(index, "price", parseFloat(e.target.value))}
                />
              </div>
              <div className="w-32 space-y-2">
                <Label>Total</Label>
                <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 text-right">
                  {(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
              <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addItem} className="mt-2">
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </Card>

      <div className="flex justify-end">
        <div className="w-full md:w-1/3 space-y-4">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">{subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Tax Rate (%)</span>
            <Input 
              type="number" 
              className="w-20 text-right h-8" 
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Tax Amount</span>
            <span className="font-semibold">{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold">
            <span>Grand Total</span>
            <span>{totalAmount.toFixed(2)}</span>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </div>
    </form>
  );
}