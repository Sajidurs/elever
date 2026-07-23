'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { OrderStatus } from '@/lib/types/database';

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('orders').update({ status }).eq('id', id);
  revalidatePath('/admin/orders');
}
