import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth"; // সেশন চেক করার জন্য

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col">
      {/* 1. Navbar */}
      <nav className="flex items-center justify-between p-6 border-b">
        <h1 className="text-2xl font-bold">QuickInvoice</h1>
        <div className="flex gap-4">
          {session ? (
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
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
      <section className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-6 bg-gray-50">
        <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Invoicing made <span className="text-primary">Simple.</span>
        </h2>
        <p className="max-w-2xl text-lg text-gray-600">
          Create professional invoices in seconds, manage clients, and track your business growth. 
          Perfect for freelancers and small businesses in Bangladesh.
        </p>
        
        <div className="flex gap-4 mt-4">
          {session ? (
             <Link href="/dashboard">
               <Button size="lg" className="px-8">Go to Dashboard</Button>
             </Link>
          ) : (
            <Link href="/register">
              <Button size="lg" className="px-8">Create Free Account</Button>
            </Link>
          )}
        </div>
      </section>

      {/* 3. Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} QuickInvoice. All rights reserved.
      </footer>
    </main>
  );
}