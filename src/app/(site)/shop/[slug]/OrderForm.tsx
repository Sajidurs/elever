'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { placeOrder, type OrderState } from './actions';
import type { Product } from '@/lib/types/database';

const initialState: OrderState = { status: 'idle' };

const inputClass =
  'rounded-lg border border-white/14 bg-brand-surface-alt px-3.5 py-2.5 text-sm outline-none focus:border-brand-accent';

export function OrderForm({ product }: { product: Product }) {
  const [state, formAction, isPending] = useActionState(placeOrder, initialState);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (state.status === 'success') {
    return (
      <div className="rounded-xl border border-brand-accent/35 bg-brand-accent/8 p-5.5">
        <p className="mb-1.5 font-medium">Order placed.</p>
        <p className="mb-4 text-[13.5px] leading-relaxed text-[#c9c9cc]">
          We&apos;ll contact you to confirm your Cash on Delivery order for {state.quantity} × {state.productTitle}.
        </p>
        <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-[11px] tracking-wide text-brand-muted uppercase">Order number</p>
          <p className="font-mono text-lg tracking-wider text-brand-accent">{state.orderNumber}</p>
        </div>
        <p className="mt-3.5 text-xs text-brand-subtle">
          Save this number — you&apos;ll need it with your phone number to{' '}
          <Link href="/track-order" className="text-brand-accent underline underline-offset-2">
            track your order
          </Link>
          .
        </p>
      </div>
    );
  }

  if (!checkoutOpen) {
    return (
      <button
        onClick={() => setCheckoutOpen(true)}
        className="rounded-full bg-brand-accent px-6.5 py-3.5 text-sm font-medium text-brand-bg hover:opacity-90"
      >
        Buy now · Cash on Delivery
      </button>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border border-white/8 p-6">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="quantity" value={quantity} />

      <div className="mb-4.5 flex items-center gap-3.5">
        <span className="text-[13px] text-brand-muted">Quantity</span>
        <div className="flex items-center rounded-full border border-white/14">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-8 w-8 cursor-pointer text-base"
          >
            –
          </button>
          <span className="w-7 text-center text-sm">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)} className="h-8 w-8 cursor-pointer text-base">
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <input name="fullName" placeholder="Full name" required className={inputClass} />
        <input name="phone" placeholder="Phone number" required className={inputClass} />
        <textarea name="address" placeholder="Full delivery address" rows={3} required className={`resize-y ${inputClass}`} />
      </div>

      {state.status === 'error' && <p className="mt-3.5 text-sm text-brand-error">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-4.5 w-full cursor-pointer rounded-full bg-brand-accent py-3 text-sm font-medium text-brand-bg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Placing order…' : 'Place order — Cash on Delivery'}
      </button>
    </form>
  );
}
