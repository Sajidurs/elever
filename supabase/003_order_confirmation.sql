-- Lets the order-confirmation page fetch a single order's full details right
-- after checkout, keyed by the order's own UUID (already an unguessable secret
-- on its own — no separate phone check needed here, unlike track_order()).
-- SECURITY DEFINER bypasses RLS internally but only ever returns one row for
-- an exact id match — anon still can't SELECT the orders table directly.

create or replace function public.get_order_confirmation(p_order_id uuid)
returns table (
  id uuid,
  product_title text,
  product_price numeric,
  quantity int,
  full_name text,
  phone text,
  address text,
  status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select id, product_title, product_price, quantity, full_name, phone, address, status, created_at
  from orders
  where id = p_order_id
  limit 1;
$$;

grant execute on function public.get_order_confirmation(uuid) to anon, authenticated;
