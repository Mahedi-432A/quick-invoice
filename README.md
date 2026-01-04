# 🚀 QuickInvoice - SaaS Invoicing Application

QuickInvoice is a modern, high-performance invoicing application built for small businesses and freelancers. It supports subscription management (SaaS), manual payments (Bkash/Nagad), PDF generation, and email automation.

## ✨ Features

- **Dashboard & Analytics:** Real-time revenue tracking, charts, and invoice stats.
- **Invoice Management:** Create, edit, delete, and download PDF invoices.
- **Client Management:** Manage client details easily.
- **SaaS Subscription:** Free vs Pro plan limits (Configurable).
- **Manual Payment Gateway:** Users can submit Bkash/Nagad TrxID for admin approval.
- **Admin Panel:** Approve/Reject payment requests and manage users.
- **Email Automation:** Send invoices directly to clients via email.
- **Secure Authentication:** Built with NextAuth v5.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Styling:** Tailwind CSS + Shadcn UI
- **Auth:** Auth.js (NextAuth v5)
- **Email:** Nodemailer

## 🚀 Getting Started

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/quick-invoice.git
cd quick-invoice
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add the following:

\`\`\`env
# Database
MONGODB_URI=mongodb+srv://your_mongo_url

# Authentication
AUTH_SECRET=your_generated_secret_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Gmail SMTP)
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
\`\`\`

### 4. Run the project
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 👤 Admin Setup
To make yourself an admin:
1. Sign up as a normal user.
2. Go to your MongoDB database > `users` collection.
3. Find your document and change `role: "user"` to `role: "admin"`.
4. Relogin to access `/admin`.

## 📄 License
This project is licensed under the MIT License.