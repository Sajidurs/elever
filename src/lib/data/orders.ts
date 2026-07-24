import { createClient } from '@/lib/supabase/server';
import type { Order, OrderConfirmation, OrderItem, OrderStatus } from '@/lib/types/database';

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

// Fails soft (returns []) — order_items is additive; a not-yet-migrated table
// should degrade to "no items shown" rather than break the whole Orders tab.
export async function getAllOrderItems(): Promise<OrderItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data;
}

export async function getOrderItemsForOrder(orderId: string): Promise<OrderItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}
