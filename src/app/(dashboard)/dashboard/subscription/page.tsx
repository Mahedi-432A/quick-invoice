import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLANS } from "@/lib/config";
import { getUserUsage } from "@/lib/limiter";
import { Check, Crown } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SubscriptionPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const usage = await getUserUsage();
  const isPro = usage.plan === "pro";

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Subscription Plan</h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:max-w-4xl mx-auto mt-10">
        {/* FREE PLAN CARD */}
        <Card className={!isPro ? "border-primary border-2 shadow-lg" : "opacity-75"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {PLANS.FREE.name}
              {!isPro && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Current</span>}
            </CardTitle>
            <CardDescription>Perfect for freelancers just starting out.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              FREE
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Up to {PLANS.FREE.invoiceLimit} Invoices/month
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Basic Dashboard Analytics
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Unlimited Clients
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                PDF Export
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled={!isPro}>
              {!isPro ? "Your Current Plan" : "Downgrade to Free"}
            </Button>
          </CardFooter>
        </Card>

        {/* PRO PLAN CARD */}
        <Card className={isPro ? "border-primary border-2 shadow-lg relative" : "relative border-yellow-200 shadow-md"}>
          {!isPro && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              RECOMMENDED
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Crown className="h-5 w-5 fill-yellow-500 text-yellow-600" />
              {PLANS.PRO.name}
            </CardTitle>
            <CardDescription>For growing businesses needing power.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              ৳{PLANS.PRO.price}<span className="text-base font-normal text-gray-500">/mo</span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2 font-medium">
                <Check className="h-5 w-5 text-green-600" />
                Unlimited Invoices
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Advanced Charts & Reports
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Priority Email Support
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Remove &quot;Powered by QuickInvoice&quot;
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {isPro ? (
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" disabled>
                Active Plan
              </Button>
            ) : (
              // আপাতত বাটনটি ডিসেবল বা ডামি অ্যাকশন হিসেবে থাকবে
              // পরের ফেজে আমরা এখানে Stripe কানেক্ট করব
              <Button className="w-full bg-linear-to-r from-yellow-500 to-orange-600 text-white hover:opacity-90 border-0">
                Upgrade to Pro
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}