"use client";

import { updateSettings } from "@/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";

// ১. স্টেটের জন্য টাইপ ডিফাইন করা
type FormState = {
  message: string;
  error: string;
};

// ২. ডাটাবেস থেকে আসা সেটিংসের টাইপ ডিফাইন করা
interface SettingsData {
  businessName: string;
  businessAddress: string;
  currency: string;
  taxPercentage: number;
}

const initialState: FormState = {
  message: "",
  error: "",
};

// ৩. এখানে prevState এর টাইপ 'any' এর বদলে 'FormState' দেওয়া হলো
async function updateSettingsWrapper(prevState: FormState, formData: FormData): Promise<FormState> {
  const result = await updateSettings(formData);
  if (result.error) {
    return { error: result.error, message: "" };
  }
  return { message: result.success || "Updated", error: "" };
}

// ৪. props এর টাইপ 'any' এর বদলে সঠিক টাইপ দেওয়া হলো
// সেটিংস null ও হতে পারে (যদি ইউজার প্রথমবার আসে), তাই 'SettingsData | null'
export function SettingsForm({ settings }: { settings: SettingsData | null }) {
  const [state, formAction, isPending] = useActionState(updateSettingsWrapper, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{state.error}</p>
      )}
      {state?.message && (
        <p className="text-green-500 text-sm bg-green-50 p-2 rounded">{state.message}</p>
      )}

      <div className="grid gap-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          name="businessName"
          // সেটিংস নাল হলে এম্পটি স্ট্রিং দেখাবে
          defaultValue={settings?.businessName || ""}
          placeholder="Ex: Tech Solutions BD"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="businessAddress">Address</Label>
        <Input
          id="businessAddress"
          name="businessAddress"
          defaultValue={settings?.businessAddress || ""}
          placeholder="123, Dhaka, Bangladesh"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            name="currency"
            defaultValue={settings?.currency || "BDT"}
            placeholder="BDT / USD"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="taxPercentage">Tax (%)</Label>
          <Input
            id="taxPercentage"
            name="taxPercentage"
            type="number"
            defaultValue={settings?.taxPercentage || 0}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}