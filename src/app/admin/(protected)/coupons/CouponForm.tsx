'use client';

import { useActionState, useEffect } from 'react';
import { saveCoupon, type CouponFormState } from './actions';
import type { Coupon } from '@/lib/types/database';

const initialState: CouponFormState = { status: 'idle' };

const inputClass =
  'w-full rounded-lg border border-white/12 bg-[#0f0f11] px-3.5 py-2.5 text-sm outline-none focus:border-brand-accent';

export function CouponForm({ coupon, onClose }: { coupon: Coupon | null; onClose: () => void }) {
  const [state, formAction, isPending] = useActionState(saveCoupon, initialState);

  useEffect(() => {
    if (state.status === 'success') onClose();
  }, [state.status, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-brand-surface p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-lg font-semibold">{coupon ? 'Edit coupon' : 'Add coupon'}</h2>
        <form action={formAction} className="flex flex-col gap-4">
          {coupon && <input type="hidden" name="couponId" value={coupon.id} />}

          <div>
            <label className="mb-1.5 block text-xs text-brand-muted">Code</label>
            <input
              name="code"
              required
              defaultValue={coupon?.code ?? ''}
              placeholder="e.g. SAVE10"
              className={`${inputClass} uppercase`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs text-brand-muted">Type</label>
              <select
                name="discountType"
                defaultValue={coupon?.discount_type ?? 'fixed'}
                className={inputClass}
              >
                <option value="fixed">Fixed (৳)</option>
                <option value="percent">Percent (%)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-brand-muted">Value</label>
              <input
                name="discountValue"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={coupon?.discount_value ?? ''}
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={coupon ? coupon.is_active : true} className="h-4 w-4" />
            Active
          </label>

          {state.status === 'error' && <p className="text-sm text-brand-error">{state.message}</p>}

          <div className="mt-1 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-white/18 px-5 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-full bg-brand-accent px-5 py-2.5 text-sm font-medium text-brand-bg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Saving…' : coupon ? 'Save' : 'Add coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
