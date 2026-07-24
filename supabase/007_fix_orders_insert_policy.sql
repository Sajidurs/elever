-- Fix: the original orders INSERT policy required product_id to reference an
-- active product. Since migration 005, orders no longer carry product_id
-- directly (line items moved to order_items), so product_id is always null
-- on new orders and that check always failed — silently blocking every order
-- placement. Product/price validation already happens server-side in
-- placeOrder/placeCartOrder before this insert runs, so this is safe to relax.
drop policy if exists "public can place order" on orders;
create policy "public can place order" on orders for insert to anon, authenticated with check (true);
