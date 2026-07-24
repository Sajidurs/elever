'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { orderSchema } from '@/lib/validation/schemas';
import { DELIVERY_FEES } from '@/lib/delivery';
import { computeDiscount } from '@/lib/coupons';

export type OrderState = { status: 'idle' } | { status: 'error'; message: string };

export async function placeOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const parsed = orderSchema.safeParse({
    productId: formData.get('productId'),
    quantity: formData.get('quantity'),
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    deliveryZone: formData.get('deliveryZone'),
    couponCode: formData.get('couponCode') || undefined,
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Please fill in your name, phone, address, and delivery location.' };
  }

  const { productId, quantity, fullName, phone, address, deliveryZone, couponCode } = parsed.data;
  const supabase = await createClient();

  // Re-derive title/price from the database rather than trusting client-supplied
  // values, so a tampered hidden field can't change what actually gets billed.
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('title, regular_price, sale_price, is_active')
    .eq('id', productId)
    .single();

  if (productError || !product || !product.is_active) {
    return { status: 'error', message: 'This product is no longer available.' };
  }

  const unitPrice = product.sale_price ?? product.regular_price;
  const subtotal = unitPrice * quantity;
  const deliveryFee = DELIVERY_FEES[deliveryZone];

  // Re-validate the coupon server-side too — never trust a client-supplied
  // discount amount for what actually gets billed.
  let appliedCouponCode: string | null = null;
  let discountAmount = 0;
  if (couponCode) {
    const { data: couponRows } = await supabase.rpc('validate_coupon', { p_code: couponCode });
    if (!couponRows || couponRows.length === 0) {
      return { status: 'error', message: 'Your coupon code is no longer valid — please remove it and try again.' };
    }
    const coupon = couponRows[0];
    appliedCouponCode = coupon.code;
    discountAmount = computeDiscount(coupon.discount_type, coupon.discount_value, subtotal);
  }

  const total = subtotal + deliveryFee - discountAmount;

  // Generate the id ourselves rather than reading it back after insert —
  // anon has no SELECT policy on orders (by design, so the table can't be
  // dumped via the public API), so `.insert().select()` would fail RLS.
  const orderId = crypto.randomUUID();

  const { error } = await supabase.from('orders').insert({
    id: orderId,
    full_name: fullName,
    phone,
    address,
    delivery_zone: deliveryZone,
    delivery_fee: deliveryFee,
    subtotal,
    coupon_code: appliedCouponCode,
    discount_amount: discountAmount,
    total,
  });

  if (error) {
    return { status: 'error', message: 'Something went wrong placing your order — please try again.' };
  }

  const { error: itemError } = await supabase.from('order_items').insert({
    order_id: orderId,
    product_id: productId,
    product_title: product.title,
    product_price: unitPrice,
    quantity,
  });

  if (itemError) {
    return { status: 'error', message: 'Something went wrong placing your order — please try again.' };
  }

  redirect(`/order-confirmation/${orderId}`);
}
