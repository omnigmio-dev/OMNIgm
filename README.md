# Omnigm - Next.js 14 PWA

A Progressive Web App built with Next.js 14, TypeScript, TailwindCSS, Supabase Auth, Stripe, and OneSignal.

## Features

- ✅ Next.js 14 with App Router and TypeScript
- ✅ TailwindCSS for styling
- ✅ Supabase Authentication (Email Magic Link)
- ✅ Mobile-friendly layout with top nav and bottom tab bar
- ✅ Auth guard for protected routes
- ✅ PWA support (manifest.json + service worker)
- ✅ Stripe Checkout and Customer Portal integration
- ✅ OneSignal Web Push notifications
- ✅ Vercel deployment ready

## Routes

- `/` - Landing page
- `/connect` - Sign in with email magic link
- `/dashboard` - Main dashboard (protected)
- `/lineup` - Lineup page (protected)
- `/radar` - Radar page (protected)
- `/billing` - Subscription management (protected)
- `/settings` - User settings (protected)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and fill in your credentials:
```bash
cp .env.local.example .env.local
```

3. Set up Supabase:
   - Create a Supabase project
   - Enable Email Auth with Magic Links
   - Run the migration file `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
   - This will create the `profiles` and `subscriptions` tables with proper RLS policies

4. Set up Stripe:
   - Create Stripe products and prices for PRO ($4.99/month) and ALL_ACCESS ($9.99/month)
   - Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
   - Configure webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

5. Set up OneSignal:
   - Create a OneSignal app
   - Get your App ID and Safari Web ID

6. Run the development server:
```bash
npm run dev
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## PWA Icons

Place your PWA icons in the `public` folder:
- `icon-192x192.png` (192x192 pixels)
- `icon-512x512.png` (512x512 pixels)
- `favicon.ico` (standard favicon)

You can generate these icons using tools like:
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## Database Schema

### profiles table
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### subscriptions table
```sql
create table subscriptions (
  user_id uuid references auth.users on delete cascade primary key,
  plan text not null,
  stripe_customer_id text,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

