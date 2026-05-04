-- Run this in Supabase Dashboard → SQL Editor → New query → Run
-- This creates customers, orders, and order_items tables.
-- Make sure you have already run supabase_schema.sql (products table) first.

-- ── Customers ─────────────────────────────────────────────────────────
create table if not exists customers (
  
  id          bigserial primary key,
  full_name   text        not null,
  email       text        not null unique,
  phone       text        not null default '',
  address     text        not null default '',
  city        text        not null default '',
  province    text        not null default '',
  postal_code text        not null default '',
  created_at  timestamptz not null default now()
);

-- ── Orders ────────────────────────────────────────────────────────────
create table if not exists orders (
  id                   bigserial primary key,
  order_ref            text        not null unique,
  customer_id          bigint      references customers(id) on delete set null,
  status               text        not null default 'Pending'
                         check (status in ('Pending','Processing','Shipped','Delivered','Cancelled')),
  payment_status       text        not null default 'Unpaid'
                         check (payment_status in ('Unpaid','Paid','Failed')),
  total_amount         numeric     not null default 0,
  shipping_fee         numeric     not null default 0,
  notes                text        not null default '',
  phone                text        not null default '',
  delivery_address     text        not null default '',
  delivery_city        text        not null default '',
  delivery_province    text        not null default '',
  delivery_postal_code text        not null default '',
  delivery_country     text        not null default 'South Africa',
  billing_same         boolean     not null default true,
  billing_first_name   text        not null default '',
  billing_last_name    text        not null default '',
  billing_address      text        not null default '',
  billing_city         text        not null default '',
  billing_province     text        not null default '',
  billing_postal_code  text        not null default '',
  billing_country      text        not null default '',
  billing_phone        text        not null default '',
  billing_alt_phone    text        not null default '',
  created_at           timestamptz not null default now()
);

-- ── Order items (links orders ↔ products) ─────────────────────────────
create table if not exists order_items (
  id          bigserial primary key,
  order_id    bigint      not null references orders(id) on delete cascade,
  product_id  bigint      references products(id) on delete set null,
  quantity    integer     not null default 1,
  unit_price  numeric     not null default 0,
  size        text        not null default '',
  color       text        not null default '',
  material    text        not null default ''
);

-- ── Row Level Security ────────────────────────────────────────────────
alter table customers   enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Allow full anon access (tighten to auth.role() = 'authenticated' in production)
create policy "Anon full access on customers"
  on customers for all using (true);

create policy "Anon full access on orders"
  on orders for all using (true);

create policy "Anon full access on order_items"
  on order_items for all using (true);

-- ── Seed: customers ──────────────────────────────────────────────────
insert into customers (full_name, email, phone, address, city, province, postal_code) values
  ('John Smith',    'john@mail.com',  '071 234 5678', '12 Oak Ave',       'Cape Town',      'Western Cape', '8001'),
  ('Sarah Miller',  'sarah@mail.com', '072 345 6789', '45 Pine Rd',       'Johannesburg',   'Gauteng',      '2000'),
  ('Mike Roberts',  'mike@mail.com',  '073 456 7890', '7 Maple St',       'Durban',         'KwaZulu-Natal','4001'),
  ('Lisa Khumalo',  'lisa@mail.com',  '074 567 8901', '3 Baobab Cres',    'Pretoria',       'Gauteng',      '0001'),
  ('David Botha',   'david@mail.com', '075 678 9012', '22 Fynbos Lane',   'Stellenbosch',   'Western Cape', '7600'),
  ('Emma Nkosi',    'emma@mail.com',  '076 789 0123', '88 Ndlovu Rd',     'Polokwane',      'Limpopo',      '0700'),
  ('Thabo Dlamini', 'thabo@mail.com', '077 890 1234', '5 Imvula St',      'Bloemfontein',   'Free State',   '9301'),
  ('Priya Naidoo',  'priya@mail.com', '078 901 2345', '17 Lotus Park',    'Pietermaritzburg','KwaZulu-Natal','3200')
on conflict (email) do nothing;

-- ── Seed: orders ─────────────────────────────────────────────────────
insert into orders (order_ref, customer_id, status, total_amount, shipping_fee, created_at)
select 'AE9844', id, 'Processing', 1250, 150, '2024-03-15 09:00:00+00' from customers where email='john@mail.com';

insert into orders (order_ref, customer_id, status, total_amount, shipping_fee, created_at)
select 'AE9843', id, 'Delivered',  890,  100, '2024-03-14 10:30:00+00' from customers where email='sarah@mail.com';

insert into orders (order_ref, customer_id, status, total_amount, shipping_fee, created_at)
select 'AE9842', id, 'Pending',    2100, 150, '2024-03-14 14:00:00+00' from customers where email='mike@mail.com';

insert into orders (order_ref, customer_id, status, total_amount, shipping_fee, created_at)
select 'AE9841', id, 'Cancelled',  650,  80,  '2024-03-12 11:00:00+00' from customers where email='lisa@mail.com';

insert into orders (order_ref, customer_id, status, total_amount, shipping_fee, created_at)
select 'AE9840', id, 'Delivered',  3450, 150, '2024-03-11 08:45:00+00' from customers where email='david@mail.com';

insert into orders (order_ref, customer_id, status, total_amount, shipping_fee, created_at)
select 'AE9839', id, 'Processing', 1740, 150, '2024-03-10 13:20:00+00' from customers where email='emma@mail.com';

insert into orders (order_ref, customer_id, status, total_amount, shipping_fee, created_at)
select 'AE9838', id, 'Delivered',  480,  80,  '2024-03-09 15:10:00+00' from customers where email='thabo@mail.com';

insert into orders (order_ref, customer_id, status, total_amount, shipping_fee, created_at)
select 'AE9837', id, 'Pending',    960,  100, '2024-03-08 09:55:00+00' from customers where email='priya@mail.com';

-- ── Seed: order_items (link orders to products) ───────────────────────
-- AE9844 → 2 items
insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 2500, 'L', 'Black', 'Micro-polyester'
from orders o, products p
where o.order_ref='AE9844' and p.slug='premium-leather-seat-cover-set';

insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 450, 'M', 'Red', 'Nylon blend'
from orders o, products p
where o.order_ref='AE9844' and p.slug='sport-steering-wheel-cover';

-- AE9843 → 1 item
insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 890, 'XL', 'Grey', 'Polyester-fibre'
from orders o, products p
where o.order_ref='AE9843' and p.slug='premium-suv-exterior-cover';

-- AE9842 → 3 items
insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 520, 'M', 'Black', 'Polyester'
from orders o, products p
where o.order_ref='AE9842' and p.slug='universal-car-body-cover';

insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 1500, 'L', 'White', 'Micro-polyester'
from orders o, products p
where o.order_ref='AE9842' and p.slug='custom-logo-seat-cover';

insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 420, 'S', 'Blue', 'Canvas'
from orders o, products p
where o.order_ref='AE9842' and p.slug='all-weather-hatchback-cover';

-- AE9841 → 1 item
insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 450, 'S', 'Grey', 'Polyester'
from orders o, products p
where o.order_ref='AE9841' and p.slug='car-cover';

-- AE9840 → 4 items
insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 2, 520, 'L', 'Grey', 'Nylon'
from orders o, products p
where o.order_ref='AE9840' and p.slug='universal-car-body-cover';

insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 950, 'M', 'Black', 'Nylon blend'
from orders o, products p
where o.order_ref='AE9840' and p.slug='custom-embroidered-floor-mats';

insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 890, 'XL', 'White', 'Canvas'
from orders o, products p
where o.order_ref='AE9840' and p.slug='premium-suv-exterior-cover';

-- AE9839 → 2 items
insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 2500, 'M', 'Beige', 'Polyester-fibre'
from orders o, products p
where o.order_ref='AE9839' and p.slug='premium-leather-seat-cover-set';

insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 420, 'S', 'Black', 'Polyester'
from orders o, products p
where o.order_ref='AE9839' and p.slug='all-weather-hatchback-cover';

-- AE9838 → 1 item
insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 420, 'M', 'Grey', 'Canvas'
from orders o, products p
where o.order_ref='AE9838' and p.slug='all-weather-hatchback-cover';

-- AE9837 → 2 items
insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 450, 'L', 'Black', 'Micro-polyester'
from orders o, products p
where o.order_ref='AE9837' and p.slug='sport-steering-wheel-cover';

insert into order_items (order_id, product_id, quantity, unit_price, size, color, material)
select o.id, p.id, 1, 450, 'M', 'Grey', 'Polyester'
from orders o, products p
where o.order_ref='AE9837' and p.slug='car-cover';
