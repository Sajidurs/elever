-- Adds two narrow, security-definer RPCs so the public site can:
--   1. Verify a phone number belongs to a real order before allowing activation
--   2. Let a customer look up their own order status by phone + order reference
-- Both bypass RLS internally (SECURITY DEFINER) but only ever return the minimum
-- needed — never a raw SELECT on the orders table — so the anon key still can't
-- be used to dump the orders table directly via the REST API.

-- Phone-number normalization is applied on both sides so formatting differences
-- (spaces, dashes, +country code) don't cause false "not found" results.

create or replace function public.phone_has_order(p_phone text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from orders
    where regexp_replace(phone, '[^0-9]', '', 'g') = regexp_replace(p_phone, '[^0-9]', '', 'g')
  );
$$;

grant execute on function public.phone_has_order(text) to anon, authenticated;

create or replace function public.track_order(p_phone text, p_order_ref text)
returns table (
  order_number text,
  product_title text,
  quantity int,
  status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    upper(right(id::text, 8)) as order_number,
    product_title,
    quantity,
    status,
    created_at
  from orders
  where regexp_replace(phone, '[^0-9]', '', 'g') = regexp_replace(p_phone, '[^0-9]', '', 'g')
    and upper(right(id::text, 8)) = upper(regexp_replace(p_order_ref, '[^A-Za-z0-9]', '', 'g'))
  limit 1;
$$;

grant execute on function public.track_order(text, text) to anon, authenticated;
