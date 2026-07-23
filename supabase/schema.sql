-- Elever Notes ecommerce schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).
-- After running: create one admin user under Authentication > Users (email/password),
-- and copy your Project URL + anon public key from Project Settings > API.

-- PRODUCTS
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text,
  regular_price numeric(10,2) not null,
  sale_price numeric(10,2),
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table products enable row level security;
create policy "public read active products" on products for select to anon, authenticated using (is_active = true);
create policy "admin full access products" on products for all to authenticated using (true) with check (true);

-- ORDERS (Cash on Delivery) - snapshots product title/price so later edits/deletes don't corrupt open orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  product_title text not null,
  product_price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  full_name text not null,
  phone text not null,
  address text not null,
  status text not null default 'pending' check (status in ('pending','fulfilled','cancelled')),
  created_at timestamptz not null default now()
);
alter table orders enable row level security;
create policy "public can place order" on orders for insert to anon, authenticated
  with check (exists (select 1 from products p where p.id = product_id and p.is_active));
create policy "admin read orders" on orders for select to authenticated using (true);
create policy "admin update orders" on orders for update to authenticated using (true) with check (true);

-- ACTIVATIONS (universal QR - no per-serial uniqueness/dedupe by design)
create table activations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  created_at timestamptz not null default now()
);
alter table activations enable row level security;
create policy "public can activate" on activations for insert to anon, authenticated with check (true);
create policy "admin read activations" on activations for select to authenticated using (true);

-- SETTINGS (single row)
create table settings (
  id int primary key default 1 check (id = 1),
  discount_text text not null default '15%',
  pdf_url text,
  playstore_url text,
  updated_at timestamptz not null default now()
);
alter table settings enable row level security;
insert into settings (id) values (1);
create policy "public read settings" on settings for select to anon, authenticated using (true);
create policy "admin update settings" on settings for update to authenticated using (true) with check (true);

-- MESSAGES (Contact form)
create table messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);
alter table messages enable row level security;
create policy "public can send message" on messages for insert to anon, authenticated with check (true);
create policy "admin read messages" on messages for select to authenticated using (true);

-- STORAGE: creates the "product-images" bucket (public read) for admin-uploaded product photos
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public read product images" on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');
create policy "admin upload product images" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');
