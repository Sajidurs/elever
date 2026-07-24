-- COUPONS — simple fixed/percentage discount codes applied at checkout.
create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('fixed', 'percent')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint percent_capped_at_100 check (discount_type = 'fixed' or discount_value <= 100)
);
alter table coupons enable row level security;
-- No anon select policy — codes are only ever checked through validate_coupon()
-- below, so the full coupon list can't be scraped via the public REST API.
create policy "admin manage coupons" on coupons for all to authenticated using (true) with check (true);

create function public.validate_coupon(p_code text)
returns table (code text, discount_type text, discount_value numeric)
language sql
security definer
set search_path = public
as $$
  select code, discount_type, discount_value
  from coupons
  where upper(code) = upper(trim(p_code))
    and is_active = true
  limit 1;
$$;
grant execute on function public.validate_coupon(text) to anon, authenticated;

-- ORDERS — record which coupon (if any) was applied and how much it saved.
alter table orders add column if not exists coupon_code text;
alter table orders add column if not exists discount_amount numeric(10,2) not null default 0;

-- Return types changed (added coupon_code/discount_amount) — drop before recreating.
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
  coupon_code text,
  discount_amount numeric,
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
    o.coupon_code, o.discount_amount,
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
  coupon_code text,
  discount_amount numeric,
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
    o.coupon_code, o.discount_amount,
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
