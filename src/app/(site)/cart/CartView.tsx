'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart/CartContext';
import { placeCartOrder, type CartOrderState } from './actions';
import { DELIVERY_ZONES, DELIVERY_FEES, DELIVERY_LABELS, type DeliveryZone } from '@/lib/delivery';
import { formatPrice } from '@/lib/utils';

const initialState: CartOrderState = { status: 'idle' };

const inputClass =
  'w-full rounded-lg border border-white/14 bg-brand-surface-alt px-3.5 py-2.5 text-sm outline-none focus:border-brand-accent';

export function CartView() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const [zone, setZone] = useState<DeliveryZone>('dhaka');
  const [state, formAction, isPending] = useActionState(placeCartOrder, initialState);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="mb-6 text-brand-muted">Your cart is empty.</p>
        <Link
          href="/shop"
          className="inline-flex rounded-full bg-brand-accent px-6 py-3 text-sm font-medium text-brand-bg"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  const deliveryFee = DELIVERY_FEES[zone];
  const total = subtotal + deliveryFee;

  return (
    <div className="grid gap-8 sm:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 rounded-2xl border border-white/8 bg-brand-surface p-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-brand-surface-alt">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.title} fill sizes="80px" className="object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/shop/${item.slug}`} className="font-medium hover:text-brand-accent">
                  {item.title}
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="cursor-pointer text-xs whitespace-nowrap text-brand-error"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-full border border-white/14">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="h-7 w-7 cursor-pointer text-sm"
                  >
                    –
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="h-7 w-7 cursor-pointer text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-brand-accent">{formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form action={formAction} className="h-fit rounded-2xl border border-white/8 bg-brand-surface p-6">
        <input
          type="hidden"
          name="items"
          value={JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity })))}
        />
        <input type="hidden" name="deliveryZone" value={zone} />

        <div className="mb-4 flex flex-col gap-2">
          <span className="mb-0.5 text-[13px] text-brand-muted">Delivery location</span>
          {DELIVERY_ZONES.map((z) => (
            <label
              key={z}
              className={`flex cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                zone === z ? 'border-brand-accent' : 'border-white/14 hover:border-white/30'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="radio"
                  checked={zone === z}
                  onChange={() => setZone(z)}
                  className="h-3.5 w-3.5 accent-[#c1a078]"
                />
                {DELIVERY_LABELS[z]}
              </span>
              <span className="text-brand-muted">{formatPrice(DELIVERY_FEES[z])}</span>
            </label>
          ))}
        </div>

        <div className="mb-4 flex flex-col gap-3">
          <input name="fullName" placeholder="Full name" required className={inputClass} />
          <input name="phone" placeholder="Phone number" required className={inputClass} />
          <textarea
            name="address"
            placeholder="Full delivery address"
            rows={3}
            required
            className={`resize-y ${inputClass}`}
          />
        </div>

        <div className="mb-4 flex flex-col gap-2 border-t border-white/8 pt-4 text-sm">
          <div className="flex justify-between text-brand-muted">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-brand-muted">
            <span>Delivery</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {state.status === 'error' && <p className="mb-3 text-sm text-brand-error">{state.message}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer rounded-full bg-brand-accent py-3 text-sm font-medium text-brand-bg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Placing order…' : 'Place order — Cash on Delivery'}
        </button>
      </form>
    </div>
  );
}
