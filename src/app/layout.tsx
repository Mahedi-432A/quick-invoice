import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "QuickInvoice - Smart Invoice Management",
    template: "%s | QuickInvoice", // অন্য পেজে টাইটেল দিলে অটোমেটিক শেষে | QuickInvoice যুক্ত হবে
  },
  description: "Create professional invoices, track payments, and manage your business finances easily with QuickInvoice.",
  keywords: ["Invoice Generator", "Billing Software", "QuickInvoice", "Business Finance", "Invoice BD"],
  authors: [{ name: "MD Mahedi Hasan" }], // তোমার নাম দাও
  creator: "MD Mahedi Hasan",
  openGraph: {
    title: "QuickInvoice - Smart Invoice Management",
    description: "The easiest way to manage invoices and payments for your business.",
    url: BASE_URL,
    siteName: "QuickInvoice",
    images: [
      {
        url: "/og-image.png", // public ফোল্ডারে এই নামে একটি ছবি রাখতে হবে (1200x630px)
        width: 1200,
        height: 630,
        alt: "QuickInvoice Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickInvoice - Smart Invoice Management",
    description: "Create professional invoices in seconds.",
    images: ["/og-image.png"], // টুইটারের জন্যও একই ছবি
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
