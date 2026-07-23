'use server';

import { createClient } from '@/lib/supabase/server';
import { orderSchema } from '@/lib/validation/schemas';

export type OrderState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; quantity: number; productTitle: string };

export async function placeOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const parsed = orderSchema.safeParse({
    productId: formData.get('productId'),
    quantity: formData.get('quantity'),
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    address: formData.get('address'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Please fill in your name, phone, and address.' };
  }

  const { productId, quantity, fullName, phone, address } = parsed.data;
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

  const { error } = await supabase.from('orders').insert({
    product_id: productId,
    product_title: product.title,
    product_price: unitPrice,
    quantity,
    full_name: fullName,
    phone,
    address,
  });

  if (error) {
    return { status: 'error', message: 'Something went wrong placing your order — please try again.' };
  }

  return { status: 'success', quantity, productTitle: product.title };
}
