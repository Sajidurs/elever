import { createClient } from '@/lib/supabase/server';
import type { Order, OrderConfirmation, OrderStatus } from '@/lib/types/database';

export async function getOrderConfirmation(orderId: string): Promise<OrderConfirmation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_order_confirmation', { p_order_id: orderId });
  if (error || !data || data.length === 0) return null;
  return data[0] as OrderConfirmation;
}

export async function getOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}
