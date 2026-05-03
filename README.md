# 🚛 Northeast Instant Transport Platform (Assam)

> Uber for goods transport in Assam — book Tata Yodha, Bolero Pickup, and more instantly.

## 🚀 Quick Start

```bash
git clone https://github.com/Amit2004k/northeast-transport-assam.git
cd northeast-transport-assam
npm install
cp .env.example .env.local   # add your Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🗄️ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in the SQL editor:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Create a storage bucket named `driver-documents` (public)

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Auth | @supabase/ssr v0.10.2 |
| Deployment | Vercel |
| Testing | Playwright |

## 👥 User Roles

| Role | Path | Demo Login |
|------|------|------------|
| Customer | `/dashboard/customer` | customer@demo.com / demo1234 |
| Driver | `/dashboard/driver` | driver@demo.com / demo1234 |
| Admin | `/dashboard/admin` | admin@demo.com / demo1234 |

## 🚗 Supported Vehicles

| Vehicle | Capacity | Base Fare | Per Km |
|---------|----------|-----------|--------|
| Tata Yodha | 1500 kg | ₹150 | ₹18/km |
| Bolero Pickup | 1000 kg | ₹120 | ₹15/km |
| Mini Truck | 2500 kg | ₹200 | ₹22/km |
| Mahindra Pickup | 800 kg | ₹100 | ₹14/km |
| Tata Ace | 750 kg | ₹80 | ₹12/km |

## 🧪 Testing

```bash
npx playwright install
npm test
```

## 🚀 Deploy to Vercel

```bash
npx vercel --prod
```

Set the three environment variables in your Vercel project settings.

## 🗄️ Project Structure

```
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/login/page.tsx         # Auth (Suspense-wrapped)
│   ├── booking/page.tsx            # 3-step booking flow
│   ├── dashboard/
│   │   ├── customer/               # Customer dashboard
│   │   ├── driver/                 # Driver dashboard + docs
│   │   └── admin/                  # Admin panel
│   └── api/
│       ├── bookings/               # CRUD + status lifecycle
│       ├── vehicles/               # Vehicle management
│       └── pricing/                # Fare estimation
├── components/
│   ├── dashboard/BottomNav.tsx
│   └── ui/StatusBadge.tsx
├── lib/supabase/
│   ├── client.ts                   # Browser client (@supabase/ssr)
│   ├── server.ts                   # Server client (@supabase/ssr)
│   └── database.types.ts           # Hand-written types (supabase-js v2.105 compatible)
├── services/
│   ├── auth.ts
│   ├── bookings.ts
│   └── pricing.ts
├── hooks/
│   ├── useAuth.ts
│   └── useBookings.ts
├── middleware.ts                   # Session refresh (required by @supabase/ssr)
└── supabase/migrations/
    └── 001_initial_schema.sql
```

## 🔧 Key Fixes (v1.1.0)

- Migrated from deprecated `@supabase/auth-helpers-nextjs` → `@supabase/ssr@0.10.2`
- Fixed `database.types.ts` with `Relationships: Relationship[]` on every table (required by postgrest-js v2.9+)
- Added `__InternalSupabase.PostgrestVersion: '12'` to resolve `never` types in supabase-js v2.105
- Fixed `useSearchParams()` wrapped in `<Suspense>` boundary on login page
- Added `middleware.ts` for session refresh on every request
- Removed non-existent `Toggle` import from lucide-react
- Google Fonts loaded via runtime `<link>` tag instead of `next/font/google` (build environment safe)

---

*Built for Northeast India 🙏 — Transforming logistics in Assam*
