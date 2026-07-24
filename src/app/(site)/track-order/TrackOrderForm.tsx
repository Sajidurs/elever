'use client';

import { useActionState } from 'react';
import { trackOrder, type TrackOrderState } from './actions';
import { formatPrice } from '@/lib/utils';

const initialState: TrackOrderState = { status: 'idle' };

const inputClass =
  'w-full rounded-xl border border-white/12 bg-[#0f0f11] px-4 py-3.5 text-sm outline-none focus:border-brand-accent';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-white/10 text-brand-muted',
  fulfilled: 'bg-brand-accent/15 text-brand-accent',
  cancelled: 'bg-brand-error/15 text-brand-error',
};

export function TrackOrderForm() {
  const [state, formAction, isPending] = useActionState(trackOrder, initialState);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-3.5">
        <input name="phone" placeholder="Phone number used at checkout" required className={inputClass} />
        <input
          name="orderNumber"
          placeholder="Order number (e.g. A1B2C3D4)"
          required
          className={`${inputClass} uppercase placeholder:normal-case`}
        />
        {state.status === 'error' && <p className="text-sm text-brand-error">{state.message}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="mt-1 cursor-pointer rounded-xl bg-brand-accent py-3.5 text-sm font-medium text-brand-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Checking…' : 'Track order'}
        </button>
      </form>

      {state.status === 'success' && (
        <div className="rounded-2xl border border-white/8 bg-brand-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] tracking-wide text-brand-muted uppercase">Order</p>
              <p className="font-mono text-base tracking-wider">{state.order.order_number}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                STATUS_STYLES[state.order.status] ?? 'bg-white/10 text-brand-muted'
              }`}
            >
              {state.order.status}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {state.order.items.map((item, i) => (
              <p key={i} className="text-sm text-[#c9c9cc]">
                {item.quantity} × {item.product_title}
              </p>
            ))}
          </div>
          {state.order.discount_amount > 0 && (
            <p className="mt-2 text-sm text-brand-accent">
              Discount{state.order.coupon_code ? ` (${state.order.coupon_code})` : ''}: -
              {formatPrice(state.order.discount_amount)}
            </p>
          )}
          <p className="mt-3 border-t border-white/8 pt-3 text-sm font-medium">{formatPrice(state.order.total)}</p>
          <p className="mt-1 text-xs text-brand-subtle">
            Placed{' '}
            {new Date(state.order.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
}
