import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/config";
import { Check, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 1. Navbar */}
      <nav className="flex items-center justify-between p-6 border-b max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">Q</div>
           <h1 className="text-xl font-bold">QuickInvoice</h1>
        </div>
        <div className="flex gap-4">
          {session ? (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="py-20 text-center space-y-6 max-w-3xl mx-auto px-6">
        <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600 mb-4">
          🚀 The #1 Invoicing App for Bangladesh
        </div>
        <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Manage Invoices <br/> <span className="text-primary">Without the Headache.</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create professional invoices, track payments, and manage clients effortlessly. 
          Designed for freelancers and small businesses.
        </p>
        
        <div className="flex justify-center gap-4 pt-4">
          <Link href={session ? "/dashboard" : "/register"}>
            <Button size="lg" className="h-12 px-8 text-base">
              Start for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
           <h3 className="text-3xl font-bold text-center mb-12">Everything you need to run your business</h3>
           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                 <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"><Zap /></div>
                 <h4 className="text-xl font-bold mb-2">Fast Invoicing</h4>
                 <p className="text-gray-500">Create and send invoices in less than 30 seconds. Automatic tax calculations.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                 <div className="h-10 w-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4"><ShieldCheck /></div>
                 <h4 className="text-xl font-bold mb-2">Secure Payments</h4>
                 <p className="text-gray-500">Track paid and unpaid invoices easily. Supports manual payments via Bkash/Nagad.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                 <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4"><Check /></div>
                 <h4 className="text-xl font-bold mb-2">Client Management</h4>
                 <p className="text-gray-500">Keep all your client details in one place. Send emails directly from the dashboard.</p>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Pricing Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
           <h3 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h3>
           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Free Plan */}
              <div className="p-8 border rounded-2xl">
                 <h4 className="text-2xl font-bold">{PLANS.FREE.name}</h4>
                 <div className="text-4xl font-bold mt-4">৳0<span className="text-base font-normal text-gray-500">/mo</span></div>
                 <ul className="mt-8 space-y-4">
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500"/> {PLANS.FREE.invoiceLimit} Invoices per month</li>
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500"/> Unlimited Clients</li>
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500"/> PDF Export</li>
                 </ul>
                 <Link href="/register">
                    <Button variant="outline" className="w-full mt-8">Get Started</Button>
                 </Link>
              </div>

              {/* Pro Plan */}
              <div className="p-8 border-2 border-primary rounded-2xl relative shadow-lg">
                 <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                 <h4 className="text-2xl font-bold">{PLANS.PRO.name}</h4>
                 <div className="text-4xl font-bold mt-4">৳{PLANS.PRO.price}<span className="text-base font-normal text-gray-500">/mo</span></div>
                 <ul className="mt-8 space-y-4">
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500"/> <strong>Unlimited</strong> Invoices</li>
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500"/> Advanced Analytics</li>
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500"/> Email Support</li>
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500"/> Priority Access</li>
                 </ul>
                 <Link href="/register">
                    <Button className="w-full mt-8">Upgrade to Pro</Button>
                 </Link>
              </div>

           </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="py-10 bg-gray-900 text-gray-400 text-center text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <p>© {new Date().getFullYear()} QuickInvoice. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ for Bangladeshi Business.</p>
        </div>
      </footer>
    </main>
  );
}