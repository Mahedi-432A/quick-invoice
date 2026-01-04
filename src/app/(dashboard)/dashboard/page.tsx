import { getDashboardData } from "@/actions/dashboard-actions";
import { getSettings } from "@/actions/settings-actions";
import { getUserUsage } from "@/lib/limiter"; // নতুন ইমপোর্ট
import { auth } from "@/auth";
import { OverviewChart } from "@/components/modules/overview-chart";
import { RecentSales } from "@/components/modules/recent-sales";
import { UpgradeCard } from "@/components/modules/upgrade-card"; // নতুন ইমপোর্ট
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Users, FileText } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // ৩টি ডাটা সোর্স থেকে একসাথে ডাটা আনা হচ্ছে (Dashboard, Settings, Usage)
  const [data, settings, usage] = await Promise.all([
    getDashboardData(),
    getSettings(),
    getUserUsage(),
  ]);

  if (!data) return <div className="p-4">Failed to load dashboard data.</div>;

  const currency = settings?.currency || "৳";

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* ১. KPI Cards (কার্ড সেকশন) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currency} {data.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total earnings from paid invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Due</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {currency} {data.totalDue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending payments from clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Total invoices generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Total registered clients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ২. চার্ট এবং রিসেন্ট সেলস সেকশন */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* বাম পাশের বড় কলাম (৪ অংশ) */}
        <div className="col-span-4 space-y-4">
          {/* যদি ফ্রি ইউজার হয়, তাহলে এখানে ওয়ার্নিং কার্ড দেখাবে */}
          <UpgradeCard usage={usage} />
          
          {/* মাসিক আয়ের গ্রাফ */}
          <OverviewChart data={data.graphData} />
        </div>

        {/* ডান পাশের ছোট কলাম (৩ অংশ) */}
        <div className="col-span-3">
          {/* রিসেন্ট ইনভয়েস লিস্ট */}
          <RecentSales sales={data.recentSales} />
        </div>
      </div>
    </div>
  );
}