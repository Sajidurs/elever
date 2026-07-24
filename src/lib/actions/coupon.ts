'use server';

import { createClient } from '@/lib/supabase/server';
import type { CouponType } from '@/lib/types/database';

export type CouponCheckResult =
  | { ok: true; code: string; discountType: CouponType; discountValue: number }
  | { ok: false; message: string };

export async function checkCoupon(rawCode: string): Promise<CouponCheckResult> {
  const code = rawCode.trim();
  if (!code) return { ok: false, message: 'Enter a coupon code.' };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('validate_coupon', { p_code: code });

  if (error || !data || data.length === 0) {
    return { ok: false, message: 'That coupon code is not valid.' };
  }

  const c = data[0];
  return { ok: true, code: c.code, discountType: c.discount_type, discountValue: c.discount_value };
}
