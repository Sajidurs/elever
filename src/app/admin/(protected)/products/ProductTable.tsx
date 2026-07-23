'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types/database';
import { formatPrice } from '@/lib/utils';
import { deleteProduct } from './actions';
import { ProductForm } from './ProductForm';

export function ProductTable({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    startTransition(() => {
      deleteProduct(id);
    });
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <button
          onClick={() => setEditing('new')}
          className="cursor-pointer rounded-full bg-brand-accent px-5 py-2.5 text-sm font-medium text-brand-bg"
        >
          Add product
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs text-brand-muted uppercase">
              <th className="p-3"></th>
              <th className="p-3">Title</th>
              <th className="p-3">Regular</th>
              <th className="p-3">Sale</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-brand-muted">
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/8 last:border-0">
                <td className="p-3">
                  <div className="relative h-11 w-11 overflow-hidden rounded-md bg-brand-surface-alt">
                    {p.image_url && (
                      <Image src={p.image_url} alt={p.title} fill sizes="44px" className="object-cover" />
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <div>{p.title}</div>
                  <div className="text-xs text-brand-muted">/{p.slug}</div>
                </td>
                <td className="p-3">{formatPrice(p.regular_price)}</td>
                <td className="p-3">{p.sale_price != null ? formatPrice(p.sale_price) : '—'}</td>
                <td className="p-3">
                  {p.is_active ? (
                    <span className="rounded-full bg-brand-accent/15 px-2.5 py-1 text-xs text-brand-accent">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs text-brand-muted">Hidden</span>
                  )}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(p)} className="mr-3 cursor-pointer text-xs text-brand-muted hover:text-brand-text">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="cursor-pointer text-xs text-brand-error">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <ProductForm product={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
