'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { couponSchema } from '@/lib/validation/schemas';

export type CouponFormState = { status: 'idle' } | { status: 'error'; message: string } | { status: 'success' };

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

export async function saveCoupon(_prev: CouponFormState, formData: FormData): Promise<CouponFormState> {
  const supabase = await getAuthedClient();
  if (!supabase) return { status: 'error', message: 'Not authorized.' };

  const parsed = couponSchema.safeParse({
    code: formData.get('code'),
    discountType: formData.get('discountType'),
    discountValue: formData.get('discountValue'),
    isActive: formData.get('isActive') === 'on',
  });

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }

  const couponId = formData.get('couponId');
  const payload = {
    code: parsed.data.code.toUpperCase(),
    discount_type: parsed.data.discountType,
    discount_value: parsed.data.discountValue,
    is_active: parsed.data.isActive,
  };

  const { error } =
    typeof couponId === 'string' && couponId
      ? await supabase.from('coupons').update(payload).eq('id', couponId)
      : await supabase.from('coupons').insert(payload);

  if (error) {
    const message = error.code === '23505' ? 'A coupon with that code already exists.' : 'Something went wrong saving the coupon.';
    return { status: 'error', message };
  }

  revalidatePath('/admin/coupons');
  return { status: 'success' };
}

export async function setCouponActive(id: string, isActive: boolean) {
  const supabase = await getAuthedClient();
  if (!supabase) return;

  await supabase.from('coupons').update({ is_active: isActive }).eq('id', id);
  revalidatePath('/admin/coupons');
}

export async function deleteCoupon(id: string) {
  const supabase = await getAuthedClient();
  if (!supabase) return;

  await supabase.from('coupons').delete().eq('id', id);
  revalidatePath('/admin/coupons');
}
