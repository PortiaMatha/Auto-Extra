# Auto-Extra | MotorCovers

A full-stack e-commerce platform for automotive protective covers, built for the South African market. The platform serves both direct consumers (B2C) and retail partners (B2B) through a dual-model marketplace with an integrated 3D product customization experience.

---

## Features

### Storefront
- **Home Page** — Hero slider, featured product showcase, promotions, and FAQ
- **Shop** — Product grid with multi-faceted filtering by category, brand, material, color, and price range
- **Product Detail** — Image gallery, material/size selection, add to cart/wishlist, ratings and reviews, shipping calculator
- **Interior Covers** — Dedicated section for seat covers, steering wheels, and floor mats
- **Exterior Covers** — Full car covers, wheel covers, and window shades with weather protection specs
- **Cart & Wishlist** — Full cart management with quantity controls and order totals
- **Account** — User authentication (sign in, register, password recovery)
- **Contact & Help** — Contact form and support documentation

### 3D Custom Builder
An interactive 3D product customizer built with Three.js and React Three Fiber. Users can:
- Select their car make and model
- Upload a custom logo or graphic
- Adjust decal position, rotation, and scale on the 3D model in real time
- Preview the finished product before ordering

### Supplier / Retail Partner Portal
A dedicated portal for wholesale partners and retailers with:
- **Dashboard** — Overview metrics and activity summary
- **Product Management** — Full catalog and category control
- **Order Management** — Orders, returns, and shipment tracking
- **Financials** — Invoice generation and sales payouts
- **Analytics** — Sales performance and customer insights
- **Reviews** — Manage customer feedback
- **Settings** — Store profile and preferences

Retail partner plans available at three tiers: Basic (Free), Standard (R499/mo), and Premium (R999/mo).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + TypeScript |
| Routing | React Router DOM 7 |
| 3D Rendering | Three.js, React Three Fiber, Drei |
| Backend / Database | Supabase (PostgreSQL + Auth + Realtime) |
| State Management | React Context API |
| Build Tool | Create React App + Craco |
| Testing | React Testing Library + Jest |

---

## Project Structure

```
src/
├── api/              # API service layer
├── components/       # Page and feature components
│   ├── home/
│   ├── shop/
│   ├── builder/
│   ├── builder3d/    # Three.js 3D customizer
│   ├── interior/
│   ├── exterior/
│   ├── cart/
│   ├── wishlist/
│   ├── account/
│   ├── portal/       # Supplier/admin portal
│   └── layout/       # Header, Footer, Navigation, Sidebar
├── context/          # Global state (Cart, Wishlist, Products, Orders, Supplier)
├── data/             # Static product and vehicle data
├── hooks/            # Custom React hooks
├── lib/              # Supabase client and utilities
└── types/            # TypeScript type definitions
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (for backend features)

### Installation

```bash
git clone https://github.com/PortiaMatha/Auto-Extra.git
cd Auto-Extra
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

---

## Database

The Supabase schema files are included in the repo:
- `supabase_schema.sql` — Main application schema
- `supabase_customers_schema.sql` — Customer data schema

---

## Highlights

- **3D Product Customizer** — Real-time logo placement and cover preview on 3D car models before purchasing
- **Dual Revenue Model** — B2C storefront alongside a full B2B supplier marketplace
- **South African Market Focus** — ZAR pricing, local vehicle brands (Toyota, VW, Isuzu, Chery, Mazda, and more)
- **Custom Branding** — Logo upload and embroidery/print preview for personalized products
- **Comprehensive Partner Portal** — Full management suite with analytics, payouts, and inventory control

---

Built with React, TypeScript, Three.js, and Supabase.
