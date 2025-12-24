import { logoutUser } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut 
} from "lucide-react"; // আইকন ইমপোর্ট

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      {/* ১. সাইডবার (Sidebar) */}
      <aside className="w-full md:w-64 bg-white border-r min-h-screen hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">QuickInvoice</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/dashboard/invoices" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <FileText size={20} />
            Invoices
          </Link>
          <Link href="/dashboard/clients" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <Users size={20} />
            Clients
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t">
          <form action={logoutUser}>
            <Button variant="outline" className="w-full flex items-center gap-2 text-red-500 hover:text-red-600">
              <LogOut size={18} />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* ২. মেইন কন্টেন্ট এরিয়া (Main Content) */}
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}