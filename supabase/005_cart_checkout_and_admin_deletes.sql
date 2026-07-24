-- DELIVERY + TOTALS on orders — additive, nullable/defaulted so existing rows
-- are completely unaffected (delivery_fee defaults to 0 for legacy orders,
-- which is accurate since they never had a delivery fee).
alter table orders add column if not exists delivery_zone text;
alter table orders add column if not exists delivery_fee numeric(10,2) not null default 0;
alter table orders add column if not exists subtotal numeric(10,2);
alter table orders add column if not exists total numeric(10,2);

-- Relax the old single-item columns to nullable. New orders (cart or direct
-- "Buy now") store their line items in order_items instead — these columns
-- stay populated on historical rows, just aren't required going forward.
alter table orders alter column product_title drop not null;
alter table orders alter column product_price drop not null;
alter table orders alter column quantity drop not null;

-- ORDER ITEMS — one row per product in an order. Supports multi-item cart
-- checkout; a direct single-product "Buy now" also writes exactly one row here.
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_title text not null,
  product_price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  created_at timestamptz not null default now()
);
alter table order_items enable row level security;
create policy "public can insert order items" on order_items for insert to anon, authenticated with check (true);
create policy "admin manage order items" on order_items for all to authenticated using (true) with check (true);

create index if not exists order_items_order_id_idx on order_items (order_id);

-- ADMIN DELETE — orders/activations/messages previously had no delete policy.
create policy "admin delete orders" on orders for delete to authenticated using (true);
create policy "admin delete activations" on activations for delete to authenticated using (true);
create policy "admin delete messages" on messages for delete to authenticated using (true);
create policy "admin delete activation attempts" on activation_attempts for delete to authenticated using (true);

-- Return type changed (added columns), so drop before recreating.
drop function if exists public.get_order_confirmation(uuid);
create function public.get_order_confirmation(p_order_id uuid)
returns table (
  id uuid,
  full_name text,
  phone text,
  address text,
  delivery_zone text,
  delivery_fee numeric,
  subtotal numeric,
  total numeric,
  status text,
  created_at timestamptz,
  items json
)
language sql
security definer
set search_path = public
as $$
  select
    o.id, o.full_name, o.phone, o.address, o.delivery_zone, o.delivery_fee,
    coalesce(o.subtotal, o.product_price * o.quantity) as subtotal,
    coalesce(o.total, o.product_price * o.quantity, 0) as total,
    o.status, o.created_at,
    coalesce(
      (
        select json_agg(json_build_object(
          'product_title', oi.product_title,
          'product_price', oi.product_price,
          'quantity', oi.quantity
        ) order by oi.created_at)
        from order_items oi where oi.order_id = o.id
      ),
      case when o.product_title is not null then
        json_build_array(json_build_object(
          'product_title', o.product_title,
          'product_price', o.product_price,
          'quantity', o.quantity
        ))
      else '[]'::json end
    ) as items
  from orders o
  where o.id = p_order_id
  limit 1;
$$;
grant execute on function public.get_order_confirmation(uuid) to anon, authenticated;

drop function if exists public.track_order(text, text);
create function public.track_order(p_phone text, p_order_ref text)
returns table (
  order_number text,
  status text,
  created_at timestamptz,
  total numeric,
  items json
)
language sql
security definer
set search_path = public
as $$
  select
    upper(right(o.id::text, 8)) as order_number,
    o.status,
    o.created_at,
    coalesce(o.total, o.product_price * o.quantity, 0) as total,
    coalesce(
      (
        select json_agg(json_build_object(
          'product_title', oi.product_title,
          'quantity', oi.quantity
        ) order by oi.created_at)
        from order_items oi where oi.order_id = o.id
      ),
      case when o.product_title is not null then
        json_build_array(json_build_object('product_title', o.product_title, 'quantity', o.quantity))
      else '[]'::json end
    ) as items
  from orders o
  where regexp_replace(o.phone, '[^0-9]', '', 'g') = regexp_replace(p_phone, '[^0-9]', '', 'g')
    and upper(right(o.id::text, 8)) = upper(regexp_replace(p_order_ref, '[^A-Za-z0-9]', '', 'g'))
  limit 1;
$$;
grant execute on function public.track_order(text, text) to anon, authenticated;
