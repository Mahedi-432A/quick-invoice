import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // যদি shadcn এর progress না থাকে, আমি নিচে কোড দিচ্ছি
import { Zap } from "lucide-react";
import Link from "next/link";

interface UpgradeCardProps {
  usage: {
    count: number;
    limit: number;
    plan: string;
  };
}

export function UpgradeCard({ usage }: UpgradeCardProps) {
  const isPro = usage.plan === "pro";
  const percentage = isPro ? 100 : (usage.count / usage.limit) * 100;

  if (isPro) return null; // প্রো ইউজারদের এই কার্ড দেখানোর দরকার নেই

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-4 w-4 text-orange-500 fill-orange-500" /> Free Plan
        </CardTitle>
        <CardDescription>
          You have used {usage.count} of {usage.limit} invoices this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {usage.limit - usage.count} invoices remaining.
        </p>
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/subscription" className="w-full">
          <Button className="w-full" variant="default">
            Upgrade to Pro
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}