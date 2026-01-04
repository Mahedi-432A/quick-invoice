export const PLANS = {
  FREE: {
    name: "Free",
    slug: "free",
    invoiceLimit: 5, 
    price: 0,
  },
  PRO: {
    name: "Pro",
    slug: "pro",
    invoiceLimit: 100000, 
    price: 500, 
  },
};

// এই ফাংশনটি দিয়ে আমরা চেক করব লিমিট ঠিক আছে কি না
export const MAX_FREE_INVOICES = PLANS.FREE.invoiceLimit;