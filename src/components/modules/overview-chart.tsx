"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

interface OverviewChartProps {
  data: { name: string; total: number }[];
  isPro: boolean; // <--- নতুন প্রপ
}

export function OverviewChart({ data, isPro }: OverviewChartProps) {
  return (
    <Card className="col-span-4 relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
           Overview (Yearly Revenue)
           {!isPro && <span className="text-xs font-normal bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-200">Pro Feature</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-87.5 w-full">
          {/* যদি ফ্রি ইউজার হয়, তাহলে ব্লার ইফেক্ট এবং তালা দেখাবে */}
          {!isPro && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4 border rounded-xl m-4">
              <div className="bg-white p-4 rounded-full shadow-lg">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900">Unlock Financial Insights</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
                  Upgrade to Pro to visualize your monthly revenue trends and growth.
                </p>
                <Link href="/dashboard/subscription">
                  <Button className="bg-linear-to-r from-yellow-500 to-orange-600 border-0">
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* মেইন চার্ট (পিছনে থাকবে) */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `৳${value}`}
              />
              <Tooltip 
                cursor={{ fill: "transparent" }}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Bar
                dataKey="total"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}