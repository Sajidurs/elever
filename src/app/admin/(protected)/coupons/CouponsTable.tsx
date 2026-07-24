'use client';

import { useState, useTransition } from 'react';
import type { Coupon } from '@/lib/types/database';
import { formatPrice } from '@/lib/utils';
import { deleteCoupon, setCouponActive } from './actions';
import { CouponForm } from './CouponForm';

export function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const [editing, setEditing] = useState<Coupon | 'new' | null>(null);
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm('Delete this coupon? This cannot be undone.')) return;
    startTransition(() => {
      deleteCoupon(id);
    });
  }

  function handleToggleActive(coupon: Coupon) {
    startTransition(() => {
      setCouponActive(coupon.id, !coupon.is_active);
    });
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Coupons</h1>
        <button
          onClick={() => setEditing('new')}
          className="cursor-pointer rounded-full bg-brand-accent px-5 py-2.5 text-sm font-medium text-brand-bg"
        >
          Add coupon
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs text-brand-muted uppercase">
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-brand-muted">
                  No coupons yet.
                </td>
              </tr>
            )}
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-white/8 last:border-0">
                <td className="p-3 font-mono text-brand-accent">{c.code}</td>
                <td className="p-3">
                  {c.discount_type === 'percent' ? `${c.discount_value}%` : formatPrice(c.discount_value)}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggleActive(c)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 text-xs ${
                      c.is_active ? 'bg-brand-accent/15 text-brand-accent' : 'bg-white/8 text-brand-muted'
                    }`}
                  >
                    {c.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => setEditing(c)}
                    className="mr-3 cursor-pointer text-xs text-brand-muted hover:text-brand-text"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="cursor-pointer text-xs text-brand-error">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <CouponForm coupon={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
