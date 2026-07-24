'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart/CartContext';

/** Renders nothing — just clears the cart once if the URL carries ?clearCart=1,
 *  which the cart-checkout action appends on redirect. The direct single-product
 *  "Buy now" flow never touches the cart, so it never sets this flag. */
export function ClearCartOnSuccess() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    if (searchParams.get('clearCart') === '1') {
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
