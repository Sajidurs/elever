'use client';

import { useActionState, useState } from 'react';
import { placeOrder, type OrderState } from './actions';
import type { Product, CouponType } from '@/lib/types/database';
import { useCart } from '@/lib/cart/CartContext';
import { DELIVERY_ZONES, DELIVERY_FEES, DELIVERY_LABELS, type DeliveryZone } from '@/lib/delivery';
import { formatPrice } from '@/lib/utils';
import { computeDiscount } from '@/lib/coupons';
import { checkCoupon } from '@/lib/actions/coupon';

const initialState: OrderState = { status: 'idle' };

const inputClass =
  'rounded-lg border border-white/14 bg-brand-surface-alt px-3.5 py-2.5 text-sm outline-none focus:border-brand-accent';

export function OrderForm({ product }: { product: Product }) {
  const [state, formAction, isPending] = useActionState(placeOrder, initialState);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [zone, setZone] = useState<DeliveryZone>('dhaka');
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: CouponType;
    discountValue: number;
  } | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCheckingCoupon(true);
    const result = await checkCoupon(couponInput);
    setCheckingCoupon(false);
    if (result.ok) {
      setAppliedCoupon({ code: result.code, discountType: result.discountType, discountValue: result.discountValue });
      setCouponMessage(null);
    } else {
      setAppliedCoupon(null);
      setCouponMessage(result.message);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponMessage(null);
  }

  const unitPrice = product.sale_price ?? product.regular_price;

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        price: unitPrice,
        imageUrl: product.image_url,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
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

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="cursor-pointer rounded-full border border-white/18 px-6 py-3.5 text-sm font-medium transition-colors hover:border-white/40"
        >
          {added ? 'Added ✓' : 'Add to cart'}
        </button>
        <button
          type="button"
          onClick={() => setCheckoutOpen((v) => !v)}
          className="cursor-pointer rounded-full bg-brand-accent px-6.5 py-3.5 text-sm font-medium text-brand-bg transition-opacity hover:opacity-90"
        >
          Buy now · Cash on Delivery
        </button>
      </div>

      {checkoutOpen && (
        <form action={formAction} className="mt-5 rounded-2xl border border-white/8 p-6">
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="quantity" value={quantity} />
          <input type="hidden" name="deliveryZone" value={zone} />
          <input type="hidden" name="couponCode" value={appliedCoupon?.code ?? ''} />

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

          <div className="flex flex-col gap-3">
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

          <div className="mt-4">
            {appliedCoupon ? (
              <div className="flex items-center justify-between rounded-lg border border-brand-accent/40 bg-brand-accent/10 px-3.5 py-2.5 text-sm">
                <span>
                  Coupon <span className="font-medium text-brand-accent">{appliedCoupon.code}</span> applied
                </span>
                <button type="button" onClick={handleRemoveCoupon} className="cursor-pointer text-xs text-brand-error">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code"
                  className={`flex-1 ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={checkingCoupon || !couponInput.trim()}
                  className="cursor-pointer rounded-lg border border-white/18 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checkingCoupon ? 'Checking…' : 'Apply'}
                </button>
              </div>
            )}
            {couponMessage && <p className="mt-2 text-sm text-brand-error">{couponMessage}</p>}
          </div>

          {state.status === 'error' && <p className="mt-3.5 text-sm text-brand-error">{state.message}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="mt-4.5 w-full cursor-pointer rounded-full bg-brand-accent py-3 text-sm font-medium text-brand-bg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? 'Placing order…'
              : `Place order — ${formatPrice(
                  unitPrice * quantity +
                    DELIVERY_FEES[zone] -
                    (appliedCoupon
                      ? computeDiscount(appliedCoupon.discountType, appliedCoupon.discountValue, unitPrice * quantity)
                      : 0),
                )}`}
          </button>
        </form>
      )}
    </div>
  );
}
