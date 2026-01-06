import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://quickinvoice.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/'], // ড্যাশবোর্ড এবং এডমিন প্যানেল হাইড থাকবে
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}