-- Run this entire script in your Supabase SQL Editor
-- Dashboard → SQL Editor → New query → paste → Run

create table if not exists products (
  id              bigserial primary key,
  slug            text        not null unique,
  title           text        not null,
  category        text        not null check (category in ('interior', 'exterior', 'custom')),
  brand           text        not null,
  description     text        not null default '',
  base_price      numeric     not null default 0,
  discount_price  numeric     null,
  shipping_fee    numeric     not null default 0,
  material_options text[]     not null default '{}',
  size_options    text[]      not null default '{}',
  colors          text[]      not null default '{}',
  images          text[]      not null default '{}',
  average_rating  numeric     not null default 0,
  review_count    integer     not null default 0,
  stock           integer     not null default 0,
  status          text        not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at      timestamptz not null default now()
);

-- Enable Row Level Security
alter table products enable row level security;

-- Allow anyone to read active products (storefront)
create policy "Public can read active products"
  on products for select
  using (status = 'Active');

-- Allow authenticated users (portal) full access
create policy "Authenticated users have full access"
  on products for all
  using (auth.role() = 'authenticated');

-- Allow anon key full access for the portal (use authenticated in production)
create policy "Anon key full access"
  on products for all
  using (true)
  with check (true);

-- ── Seed data ─────────────────────────────────────────────────────────
insert into products (slug, title, category, brand, description, base_price, shipping_fee, material_options, size_options, colors, images, average_rating, review_count, stock, status) values
(
  'premium-leather-seat-cover-set',
  'Premium Leather Seat Cover Set',
  'interior', 'Volkswagen',
  'High–quality leather seat cover set designed to fit your car model. Durable, easy to clean and perfect for custom logo prints.',
  2500, 150,
  ARRAY['Polyester-fibre','Nylon','Micro-polyester'],
  ARRAY['S','M','L','XL'],
  ARRAY['Black','Red','Beige'],
  ARRAY['/Products/seat-cover-front.jpeg','/Products/seat-cover-detail.jpeg','/Products/seat-cover-back.jpeg'],
  4.6, 18, 20, 'Active'
),
(
  'sport-steering-wheel-cover',
  'Sport Steering Wheel Cover',
  'interior', 'Universal',
  'Sport-style steering wheel cover with excellent grip and comfort, available in multiple colours.',
  450, 80,
  ARRAY['Nylon blend','Micro-polyester'],
  ARRAY['S','M','L'],
  ARRAY['Black','Red','White'],
  ARRAY['/Products/seat-cover-detail.jpeg'],
  4.3, 9, 14, 'Active'
),
(
  'car-cover',
  'Car cover',
  'interior', 'Universal',
  'Sport-style steering wheel cover with excellent grip and comfort, available in multiple colours.',
  450, 80,
  ARRAY['Polyester','Canvas'],
  ARRAY['S','M','L'],
  ARRAY['Black','Grey','Beige'],
  ARRAY['/Products/seat-cover-detail.jpeg'],
  4.3, 9, 10, 'Active'
),
(
  'car-cover-2',
  'Car cover',
  'interior', 'Universal',
  'Sport-style steering wheel cover with excellent grip and comfort, available in multiple colours.',
  450, 80,
  ARRAY['Polyester','Canvas'],
  ARRAY['S','M','L'],
  ARRAY['Black','Grey'],
  ARRAY['/Products/seat-cover-detail.jpeg'],
  4.3, 9, 7, 'Active'
),
(
  'universal-car-body-cover',
  'Universal Car Body Cover',
  'exterior', 'Universal',
  'Heavy-duty waterproof exterior car cover suitable for all weather conditions. UV-resistant and dust-proof.',
  520, 100,
  ARRAY['Polyester','Nylon'],
  ARRAY['S','M','L','XL'],
  ARRAY['Grey','Black','Blue'],
  ARRAY['/Products/car-cover.jpg','/Products/white-car.jpg'],
  4.5, 22, 25, 'Active'
),
(
  'premium-suv-exterior-cover',
  'Premium SUV Exterior Cover',
  'exterior', 'Universal',
  'Premium-grade exterior cover designed specifically for SUV and 4x4 models. Includes carry bag.',
  890, 120,
  ARRAY['Polyester-fibre','Canvas'],
  ARRAY['L','XL','XXL'],
  ARRAY['Grey','Black','White'],
  ARRAY['/Products/white-car.jpg','/Products/car-cover.jpg'],
  4.7, 14, 12, 'Active'
),
(
  'all-weather-hatchback-cover',
  'All-Weather Hatchback Cover',
  'exterior', 'Universal',
  'Lightweight all-weather cover tailored for hatchback models. Elastic hem for a snug fit.',
  420, 80,
  ARRAY['Polyester','Canvas','Nylon blend'],
  ARRAY['S','M','L'],
  ARRAY['Black','Grey','Blue'],
  ARRAY['/Products/car-cover.jpg'],
  4.3, 31, 40, 'Active'
),
(
  'custom-logo-seat-cover',
  'Custom Logo Seat Cover Set',
  'custom', 'AutoExtras',
  'Fully personalised seat covers with your brand logo or custom design, printed to perfection.',
  1500, 150,
  ARRAY['Micro-polyester','Nylon blend'],
  ARRAY['S','M','L','XL'],
  ARRAY['Black','Red','White','Yellow','Blue'],
  ARRAY['/Products/seat-cover-detail.jpeg','/Products/seat-cover-front.jpeg'],
  4.9, 8, 15, 'Active'
),
(
  'custom-embroidered-floor-mats',
  'Custom Embroidered Floor Mats',
  'custom', 'AutoExtras',
  'High-quality floor mats with custom embroidery — choose your text, colour and pattern.',
  950, 100,
  ARRAY['Nylon blend','Polyester-fibre','Canvas'],
  ARRAY['S','M','L'],
  ARRAY['Black','Brown','Beige','Red'],
  ARRAY['/Products/seat-cover-back.jpg'],
  4.8, 12, 18, 'Active'
);

-- ── Storage: product-images bucket policies ───────────────────────────
-- Run these in Supabase Dashboard → SQL Editor

-- Drop old broken policies first (AND logic on extensions is always false)
DROP POLICY IF EXISTS "Allow image uploads"  ON storage.objects;
DROP POLICY IF EXISTS "Allow image updates"  ON storage.objects;
DROP POLICY IF EXISTS "Allow image deletes"  ON storage.objects;
DROP POLICY IF EXISTS "Allow public image reads" ON storage.objects;

-- INSERT (upload) — extension check uses OR, not AND
CREATE POLICY "Allow image uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND (
    storage.extension(name) = 'jpg'
    OR storage.extension(name) = 'jpeg'
    OR storage.extension(name) = 'png'
    OR storage.extension(name) = 'webp'
  )
  AND lower((storage.foldername(name))[1]) = 'public'
  AND (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- UPDATE
CREATE POLICY "Allow image updates"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND (
    storage.extension(name) = 'jpg'
    OR storage.extension(name) = 'jpeg'
    OR storage.extension(name) = 'png'
    OR storage.extension(name) = 'webp'
  )
  AND lower((storage.foldername(name))[1]) = 'public'
  AND (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- DELETE
CREATE POLICY "Allow image deletes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND (
    storage.extension(name) = 'jpg'
    OR storage.extension(name) = 'jpeg'
    OR storage.extension(name) = 'png'
    OR storage.extension(name) = 'webp'
  )
  AND lower((storage.foldername(name))[1]) = 'public'
  AND (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- SELECT (public reads — no restriction needed)
CREATE POLICY "Allow public image reads"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
