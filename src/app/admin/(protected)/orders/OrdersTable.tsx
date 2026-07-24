'use client';

import { useTransition } from 'react';
import type { Order, OrderItem, OrderStatus } from '@/lib/types/database';
import { formatPrice } from '@/lib/utils';
import { updateOrderStatus, deleteOrder } from './actions';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'fulfilled', 'cancelled'];

export function OrdersTable({ orders, orderItems }: { orders: Order[]; orderItems: OrderItem[] }) {
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    startTransition(() => {
      deleteOrder(id);
    });
  }

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Orders</h1>
      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs text-brand-muted uppercase">
              <th className="p-3">Order ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Items</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Address</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-brand-muted">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((o) => {
              const items = orderItems.filter((oi) => oi.order_id === o.id);
              const hasLegacyItem = items.length === 0 && o.product_title != null;
              return (
                <tr key={o.id} className="border-b border-white/8 last:border-0">
                  <td className="p-3 font-mono text-xs text-brand-accent whitespace-nowrap">
                    {o.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="p-3 whitespace-nowrap">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-3">
                    {items.map((item) => (
                      <div key={item.id} className="text-xs">
                        {item.quantity} × {item.product_title}
                      </div>
                    ))}
                    {hasLegacyItem && (
                      <div className="text-xs">
                        {o.quantity} × {o.product_title}
                      </div>
                    )}
                    {items.length === 0 && !hasLegacyItem && <span className="text-xs text-brand-muted">—</span>}
                  </td>
                  <td className="p-3">
                    <div>{o.full_name}</div>
                    <div className="text-xs text-brand-muted">{o.phone}</div>
                  </td>
                  <td className="max-w-[200px] p-3">{o.address}</td>
                  <td className="p-3 whitespace-nowrap">
                    {formatPrice(o.total ?? (o.product_price ?? 0) * (o.quantity ?? 0))}
                  </td>
                  <td className="p-3">
                    <select
                      defaultValue={o.status}
                      onChange={(e) =>
                        startTransition(() => {
                          updateOrderStatus(o.id, e.target.value as OrderStatus);
                        })
                      }
                      className="rounded-lg border border-white/12 bg-[#0f0f11] px-2.5 py-1.5 text-sm"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleDelete(o.id)} className="cursor-pointer text-xs text-brand-error">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
