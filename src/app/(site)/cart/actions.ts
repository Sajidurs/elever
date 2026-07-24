'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cartOrderSchema } from '@/lib/validation/schemas';
import { DELIVERY_FEES } from '@/lib/delivery';

export type CartOrderState = { status: 'idle' } | { status: 'error'; message: string };

interface CartItemInput {
  productId: string;
  quantity: number;
}

export async function placeCartOrder(_prev: CartOrderState, formData: FormData): Promise<CartOrderState> {
  let cartItems: CartItemInput[] = [];
  try {
    cartItems = JSON.parse(String(formData.get('items') ?? '[]'));
  } catch {
    return { status: 'error', message: 'Your cart looks empty — please try again.' };
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { status: 'error', message: 'Your cart is empty.' };
  }

  const parsed = cartOrderSchema.safeParse({
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    deliveryZone: formData.get('deliveryZone'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Please fill in your name, phone, address, and delivery location.' };
  }

  const supabase = await createClient();

  // Re-derive authoritative price/title/active status server-side — never
  // trust the client-supplied cart contents for what actually gets billed.
  const productIds = [...new Set(cartItems.map((i) => i.productId))];
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, title, regular_price, sale_price, is_active')
    .in('id', productIds);

  if (productsError || !products) {
    return { status: 'error', message: 'Something went wrong — please try again.' };
  }

  const lineItems: { productId: string; title: string; unitPrice: number; quantity: number }[] = [];
  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.productId);
    const quantity = Math.floor(Number(item.quantity)) || 0;
    if (!product || !product.is_active || quantity < 1) continue;
    lineItems.push({
      productId: product.id,
      title: product.title,
      unitPrice: product.sale_price ?? product.regular_price,
      quantity,
    });
  }

  if (lineItems.length === 0) {
    return { status: 'error', message: 'None of the items in your cart are available anymore.' };
  }

  const subtotal = lineItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const deliveryFee = DELIVERY_FEES[parsed.data.deliveryZone];
  const total = subtotal + deliveryFee;
  const orderId = crypto.randomUUID();

  const { error } = await supabase.from('orders').insert({
    id: orderId,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    address: parsed.data.address,
    delivery_zone: parsed.data.deliveryZone,
    delivery_fee: deliveryFee,
    subtotal,
    total,
  });

  if (error) {
    return { status: 'error', message: 'Something went wrong placing your order — please try again.' };
  }

  const { error: itemsError } = await supabase.from('order_items').insert(
    lineItems.map((i) => ({
      order_id: orderId,
      product_id: i.productId,
      product_title: i.title,
      product_price: i.unitPrice,
      quantity: i.quantity,
    })),
  );

  if (itemsError) {
    return { status: 'error', message: 'Something went wrong placing your order — please try again.' };
  }

  redirect(`/order-confirmation/${orderId}?clearCart=1`);
}
