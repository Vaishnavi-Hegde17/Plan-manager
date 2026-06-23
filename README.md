# Plan Renewal Demo

This is a Netflix-style subscription management demo focused on the 3-day grace period for payment failures and proper email notifications leading up to and during the grace period.

## Tech Stack
* **Frontend**: React (Vite), TypeScript, Tailwind CSS, Zustand, React Router
* **Backend**: Node.js, Express, TypeScript, Prisma ORM
* **Database**: SQLite (local)
* **Email**: Nodemailer

---

## Features
- Signup with email verification link.
- Login and session management (JWT).
- Netflix-clone browsing and marketing pages.
- Account settings with a visually animated timeline for your subscription lifecycle.
- Dedicated Admin dashboard to simulate "time travel" and "payment failures".
- Automated Cron Job scheduling for notifying users:
  - 3 days before renewal.
  - Due date notifications.
  - Day 1, 2, and 3 grace period warnings.
  - Final cancellation and downgrade emails.

---

## Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory based on the `.env.example` (or configure it manually):
   ```env
   DATABASE_URL="file:./dev.db"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   JWT_SECRET="super-secret-jwt-key"
   PORT=5000
   ```
4. Push the Prisma schema to the SQLite database and generate the client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will run at `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will run at `http://localhost:5173`.*

---

## How to Test the Demo

1. Open `http://localhost:5173/` in your browser.
2. Sign up and verify your email (the verification link is sent via Nodemailer to the inbox you provided).
3. Browse the application, then head to **Account -> Billing details** to see your active subscription.
4. Open the **Admin Dashboard** (`/admin`) and use the **Force Failure** button.
5. Watch your timeline change to the Grace Period state and check your email for the Day 1 alert!
6. Use the time-travel buttons in the Admin Dashboard to advance time and trigger the Node-Cron jobs that dispatch daily emails.
