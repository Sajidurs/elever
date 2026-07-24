-- ACTIVATION ATTEMPTS — logs every activation submission that failed the
-- phone_has_order() check, so admin can see how many people tried with an
-- unregistered number (and who/when), without polluting the real
-- `activations` table (which represents successful registrations only).
create table activation_attempts (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  name text,
  email text,
  created_at timestamptz not null default now()
);
alter table activation_attempts enable row level security;
create policy "public can log failed attempt" on activation_attempts for insert to anon, authenticated with check (true);
create policy "admin read activation attempts" on activation_attempts for select to authenticated using (true);

-- PRODUCT IMAGES — additional gallery images per product, beyond the single
-- `products.image_url` cover shot (which stays as-is for Shop-listing cards
-- and social/OG previews). The product detail page combines cover + gallery
-- into one ordered set for the image viewer.
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table product_images enable row level security;
create policy "public read product gallery" on product_images for select to anon, authenticated using (true);
create policy "admin manage product gallery" on product_images for all to authenticated using (true) with check (true);

create index if not exists product_images_product_id_idx on product_images (product_id, sort_order);
