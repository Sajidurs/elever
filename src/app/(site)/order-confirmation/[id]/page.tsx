import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderConfirmation } from '@/lib/data/orders';
import { ecosystem } from '@/lib/content';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Order confirmed',
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-white/10 text-brand-muted',
  fulfilled: 'bg-brand-accent/15 text-brand-accent',
  cancelled: 'bg-brand-error/15 text-brand-error',
};

export default async function OrderConfirmationPage(props: PageProps<'/order-confirmation/[id]'>) {
  const { id } = await props.params;
  const order = await getOrderConfirmation(id);

  if (!order) notFound();

  const orderNumber = order.id.slice(-8).toUpperCase();
  const total = order.product_price * order.quantity;

  return (
    <>
      <section className="mx-auto max-w-xl px-5 pt-24 pb-4 text-center sm:px-8 sm:pt-32">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent/15 text-2xl text-brand-accent">
          ✓
        </div>
        <p className="mb-4 text-xs tracking-[0.22em] text-brand-accent uppercase">Order confirmed</p>
        <h1 className="mb-4 text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.1] font-extralight tracking-tight text-balance">
          Thank you, {order.full_name.split(' ')[0]}.
        </h1>
        <p className="mx-auto max-w-[46ch] text-brand-muted">
          Your order is in — we&apos;ll be in touch to confirm delivery. Pay in cash when it arrives.
        </p>
      </section>

      <section className="mx-auto max-w-xl px-5 pt-8 pb-16 sm:px-8">
        <div className="rounded-2xl border border-white/8 bg-brand-surface p-7">
          <div className="mb-5 flex items-center justify-between border-b border-white/8 pb-5">
            <div>
              <p className="text-[11px] tracking-wide text-brand-muted uppercase">Order number</p>
              <p className="font-mono text-lg tracking-wider text-brand-accent">{orderNumber}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                STATUS_STYLES[order.status] ?? 'bg-white/10 text-brand-muted'
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-brand-muted">Item</span>
              <span className="text-right">
                {order.quantity} × {order.product_title}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-brand-muted">Total (Cash on Delivery)</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-brand-muted">Deliver to</span>
              <span className="max-w-[60%] text-right">{order.address}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-brand-muted">Phone</span>
              <span>{order.phone}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-brand-muted">Placed</span>
              <span>
                {new Date(order.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <p className="mt-5 text-xs text-brand-subtle">
            Save your order number — you can check its status anytime on the{' '}
            <Link href="/track-order" className="text-brand-accent underline underline-offset-2">
              track order
            </Link>{' '}
            page.
          </p>
        </div>
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto max-w-xl px-5 py-16 text-center sm:px-8">
          <p className="mb-4 text-xs tracking-[0.2em] text-brand-accent uppercase">Next step</p>
          <h2 className="mb-4 text-[clamp(1.4rem,3vw,2rem)] font-extralight">Activate your planner when it arrives.</h2>
          <p className="mx-auto mb-7 max-w-[48ch] text-brand-muted">
            Once your planner is in hand, scan the QR code inside the front cover and register with{' '}
            <span className="text-brand-text">the same phone number you used for this order</span> — that&apos;s
            how we confirm it&apos;s really you.
          </p>
          <Link
            href="/activate"
            className="inline-flex items-center justify-center rounded-full bg-brand-accent px-7 py-3.5 text-sm font-medium text-brand-bg transition-opacity hover:opacity-90"
          >
            Activate your planner
          </Link>
        </div>
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <h2 className="mb-10 text-center text-[clamp(1.3rem,2.8vw,1.9rem)] font-extralight">
            What activation unlocks
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ecosystem.map((e) => (
              <div key={e.title} className="text-center">
                <div className="mb-3.5 text-2xl text-brand-accent">{e.icon}</div>
                <h3 className="mb-2 text-[15px] font-medium">{e.title}</h3>
                <p className="text-[13px] text-brand-muted">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 py-14 text-center">
        <Link href="/shop" className="text-sm text-brand-muted hover:text-brand-text">
          ← Continue shopping
        </Link>
      </section>
    </>
  );
}
