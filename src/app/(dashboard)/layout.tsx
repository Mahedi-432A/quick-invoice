"use client";

import { logoutUser } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Crown,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // মেনু আইটেমগুলো এক জায়গায় রাখা হলো যাতে কোড রিপিট না হয়
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
    { href: "/dashboard/clients", label: "Clients", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/subscription", label: "Subscription", icon: Crown, color: "text-orange-500" },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      
      {/* ========================================== */}
      {/* ১. মোবাইল হেডার (শুধুমাত্র ছোট স্ক্রিনে দেখাবে) */}
      {/* ========================================== */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-20">
        <h2 className="text-xl font-bold text-primary">QuickInvoice</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* ========================================== */}
      {/* ২. মোবাইল স্লাইড-ইন মেনু (Overlay + Sidebar) */}
      {/* ========================================== */}
      
      {/* কালো ব্যাকগ্রাউন্ড ওভারলে (মেনু ওপেন থাকলে দেখাবে) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* মোবাইল সাইডবার কন্টেন্ট */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-lg transition-transform duration-300 ease-in-out md:hidden flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">QuickInvoice</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                pathname === item.href 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon size={20} className={item.color} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <form action={logoutUser}>
            <Button variant="outline" className="w-full flex items-center gap-2 text-red-500 hover:text-red-600">
              <LogOut size={18} /> Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* ========================================== */}
      {/* ৩. ডেস্কটপ সাইডবার */}
      {/* ========================================== */}
      <aside className="w-64 bg-white border-r min-h-screen hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">QuickInvoice</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                pathname === item.href 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon size={20} className={item.color} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <form action={logoutUser}>
            <Button variant="outline" className="w-full flex items-center gap-2 text-red-500 hover:text-red-600">
              <LogOut size={18} /> Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* ৪. মেইন কন্টেন্ট এরিয়া */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}