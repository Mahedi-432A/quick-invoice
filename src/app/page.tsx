import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-4xl font-bold">QuickInvoice</h1>
      <p className="text-xl text-gray-500">
        Smart Invoicing for Smart Business
      </p>
      <Button size="lg">Get Started</Button>
    </main>
  );
}