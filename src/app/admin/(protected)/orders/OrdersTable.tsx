'use client';

import { useTransition } from 'react';
import type { Order, OrderStatus } from '@/lib/types/database';
import { formatPrice } from '@/lib/utils';
import { updateOrderStatus } from './actions';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'fulfilled', 'cancelled'];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [, startTransition] = useTransition();

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Orders</h1>
      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs text-brand-muted uppercase">
              <th className="p-3">Date</th>
              <th className="p-3">Product</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Address</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-brand-muted">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/8 last:border-0">
                <td className="p-3 whitespace-nowrap">{new Date(o.created_at).toLocaleString()}</td>
                <td className="p-3">
                  <div>{o.product_title}</div>
                  <div className="text-xs text-brand-muted">
                    {formatPrice(o.product_price)} × {o.quantity}
                  </div>
                </td>
                <td className="p-3">
                  <div>{o.full_name}</div>
                  <div className="text-xs text-brand-muted">{o.phone}</div>
                </td>
                <td className="max-w-[220px] p-3">{o.address}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
