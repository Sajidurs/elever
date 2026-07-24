import type { Metadata } from 'next';
import { CartView } from './CartView';

export const metadata: Metadata = {
  title: 'Your cart',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="mb-9 text-[clamp(1.75rem,3.6vw,2.5rem)] font-light">Your cart</h1>
      <CartView />
    </section>
  );
}
