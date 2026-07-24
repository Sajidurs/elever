import { createClient } from '@/lib/supabase/server';
import type { Coupon } from '@/lib/types/database';

export async function getCoupons(): Promise<Coupon[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data ?? [];
}
