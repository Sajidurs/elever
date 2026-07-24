import type { CouponType } from '@/lib/types/database';

export function computeDiscount(discountType: CouponType, discountValue: number, subtotal: number): number {
  const raw = discountType === 'percent' ? (subtotal * discountValue) / 100 : discountValue;
  return Math.min(Math.max(raw, 0), subtotal);
}
