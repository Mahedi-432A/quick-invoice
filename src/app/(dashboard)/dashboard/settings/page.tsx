import { getSettings } from "@/actions/settings-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SettingsForm } from "./settings-form"; // ইমপোর্ট করছি
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  // যদি লগইন না থাকে, লগইন পেজে পাঠাও
  if (!session) {
    redirect("/login");
  }

  const settings = await getSettings();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Business Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>
            Manage your invoice branding and details here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* ক্লায়েন্ট কম্পোনেন্টে ডাটা পাঠাচ্ছি */}
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}