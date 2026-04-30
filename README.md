# 🚛 Northeast Instant Transport Platform (Assam)

> An Uber-for-goods platform built for Assam, India — book Tata Yodha, Bolero Pickup, and more vehicles instantly.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue)](https://tailwindcss.com)
[![Playwright](https://img.shields.io/badge/Playwright-Tests-purple)](https://playwright.dev)

---

## 🎯 Overview

**NE Transport** is a production-ready, mobile-first platform that enables instant goods transport booking across Assam. Customers can book medium-sized pickup vehicles (Tata Yodha, Bolero Pickup, Mini Trucks), while drivers can accept jobs and track earnings — all in real time.

**Headquarters:** Guwahati, Assam  
**Coverage:** 14+ cities across Assam

---

## 🚗 Supported Vehicles

| Vehicle | Capacity | Base Fare | Per Km |
|---------|----------|-----------|--------|
| Tata Yodha | 1500 kg | ₹150 | ₹18/km |
| Bolero Pickup | 1000 kg | ₹120 | ₹15/km |
| Mini Truck | 2500 kg | ₹200 | ₹22/km |
| Mahindra Pickup | 800 kg | ₹100 | ₹14/km |
| Tata Ace | 750 kg | ₹80 | ₹12/km |

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel-ready
- **Testing:** Playwright E2E
- **Fonts:** Syne (display) + DM Sans (body)

---

## 📁 Project Structure

```
northeast-transport/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── auth/login/page.tsx         # Auth (signin/signup)
│   ├── booking/page.tsx            # 3-step booking flow
│   ├── dashboard/
│   │   ├── customer/page.tsx       # Customer dashboard
│   │   ├── driver/page.tsx         # Driver dashboard
│   │   ├── driver/documents/       # Document uploads
│   │   └── admin/page.tsx          # Admin panel
│   └── api/
│       ├── bookings/route.ts       # Bookings CRUD
│       ├── vehicles/route.ts       # Vehicle management
│       └── pricing/route.ts        # Price estimates
├── components/
│   ├── dashboard/BottomNav.tsx     # Mobile bottom navigation
│   └── ui/StatusBadge.tsx          # Status display component
├── lib/supabase/
│   ├── client.ts                   # Browser Supabase client
│   ├── server.ts                   # Server Supabase client
│   └── database.types.ts           # TypeScript DB types
├── services/
│   ├── auth.ts                     # Auth functions
│   ├── bookings.ts                 # Booking CRUD
│   └── pricing.ts                  # Pricing calculations
├── hooks/
│   ├── useAuth.ts                  # Auth state hook
│   └── useBookings.ts              # Bookings + real-time
├── supabase/migrations/
│   └── 001_initial_schema.sql      # Full DB schema
└── tests/
    └── e2e.spec.ts                 # Playwright tests
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/northeast-transport-assam.git
cd northeast-transport-assam
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration:
```bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase SQL editor:
# Copy contents of supabase/migrations/001_initial_schema.sql
```

3. Create a storage bucket named `driver-documents` (Public bucket)

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## 🧪 Running Tests

```bash
# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run with UI
npm run test:ui

# Run specific test file
npx playwright test tests/e2e.spec.ts

# Generate test report
npx playwright show-report
```

---

## 🚀 Deployment (Vercel)

### One-click deploy:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment variables to set in Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 👥 User Roles & Access

| Role | Path | Description |
|------|------|-------------|
| Customer | `/dashboard/customer` | Book rides, track orders |
| Driver | `/dashboard/driver` | Accept jobs, view earnings |
| Admin | `/dashboard/admin` | Platform management |

**Demo Accounts** (available on login page):
- Customer: `customer@demo.com` / `demo1234`
- Driver: `driver@demo.com` / `demo1234`
- Admin: `admin@demo.com` / `demo1234`

---

## 📊 Database Schema

### Tables
- **profiles** — User profiles (extends auth.users)
- **vehicles** — Vehicle inventory with pricing
- **bookings** — Full booking lifecycle tracking
- **documents** — Driver document uploads
- **driver_earnings** — Earnings tracking

### Booking Lifecycle
```
requested → accepted → in_progress → completed
                    ↘ cancelled
```

---

## 🗺️ Covered Cities

Guwahati • Dibrugarh • Silchar • Jorhat • Nagaon • Tinsukia • Tezpur • Bongaigaon • Dhubri • North Lakhimpur • Goalpara • Karimganj • Sivasagar • Diphu • Golaghat

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | List bookings |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/[id]` | Get booking details |
| PATCH | `/api/bookings/[id]` | Update booking status |
| GET | `/api/vehicles` | List available vehicles |
| POST | `/api/vehicles` | Register vehicle |
| GET | `/api/pricing` | Get price estimates |
| POST | `/api/pricing` | Calculate specific price |

---

## 🎨 Design System

- **Primary:** Orange brand (`#f97316`)
- **Background:** Dark navy (`#0a0a0f`)
- **Cards:** Dark panels with subtle borders
- **Typography:** Syne (headings) + DM Sans (body)
- **Mobile-first:** Optimized for 375px+ screens

---

## 📄 License

MIT License — feel free to use for your transport startup!

---

*Built for Northeast India 🙏 — Transforming logistics in Assam*
