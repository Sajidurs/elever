import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrderById, getOrderItemsForOrder } from '@/lib/data/orders';
import { formatPrice } from '@/lib/utils';
import { DELIVERY_LABELS } from '@/lib/delivery';
import { PrintButton } from './PrintButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Print order', robots: { index: false, follow: false } };

export default async function OrderPrintPage(props: PageProps<'/admin/print/orders/[id]'>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { id } = await props.params;
  const order = await getOrderById(id);
  if (!order) notFound();
  const items = await getOrderItemsForOrder(id);
  const hasLegacyItem = items.length === 0 && order.product_title != null;
  const deliveryLabel = order.delivery_zone ? DELIVERY_LABELS[order.delivery_zone] : null;
  const subtotal = order.subtotal ?? (order.product_price ?? 0) * (order.quantity ?? 0);
  const total = order.total ?? subtotal + order.delivery_fee;

  return (
    <div className="mx-auto min-h-screen max-w-[640px] bg-white p-10 text-black print:p-0">
      <PrintButton />

      <div className="mb-8 flex items-center justify-between border-b border-black/15 pb-5">
        <div className="text-lg font-semibold tracking-[0.08em]">ELEVER</div>
        <div className="text-right text-sm">
          <div className="font-mono">#{order.id.slice(-8).toUpperCase()}</div>
          <div>{new Date(order.created_at).toLocaleDateString()}</div>
        </div>
      </div>

      <h1 className="mb-3 text-sm font-semibold tracking-wide uppercase">Deliver to</h1>
      <div className="mb-8 space-y-1 text-sm">
        <div className="text-base font-medium">{order.full_name}</div>
        <div>{order.phone}</div>
        <div>{order.address}</div>
        <div className="text-black/60">{deliveryLabel ?? 'Delivery zone not set'}</div>
      </div>

      <h2 className="mb-3 text-sm font-semibold tracking-wide uppercase">Items</h2>
      <table className="mb-8 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/25 text-left">
            <th className="py-2">Item</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-b border-black/10">
              <td className="py-2">{it.product_title}</td>
              <td className="py-2 text-right">{it.quantity}</td>
              <td className="py-2 text-right">{formatPrice(it.product_price * it.quantity)}</td>
            </tr>
          ))}
          {hasLegacyItem && (
            <tr className="border-b border-black/10">
              <td className="py-2">{order.product_title}</td>
              <td className="py-2 text-right">{order.quantity}</td>
              <td className="py-2 text-right">{formatPrice((order.product_price ?? 0) * (order.quantity ?? 0))}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="ml-auto max-w-[240px] space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery{deliveryLabel ? ` (${deliveryLabel})` : ''}</span>
          <span>{formatPrice(order.delivery_fee)}</span>
        </div>
        <div className="flex justify-between border-t border-black/25 pt-1.5 text-base font-semibold">
          <span>Total (Cash on Delivery)</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
