'use client';

import { useActionState, useEffect, useState } from 'react';
import { saveProduct, type ProductFormState } from './actions';
import type { Product } from '@/lib/types/database';

const initialState: ProductFormState = { status: 'idle' };

const inputClass =
  'w-full rounded-lg border border-white/12 bg-[#0f0f11] px-3.5 py-2.5 text-sm outline-none focus:border-brand-accent';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function ProductForm({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [state, formAction, isPending] = useActionState(saveProduct, initialState);
  const [title, setTitle] = useState(product?.title ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(product));

  useEffect(() => {
    if (state.status === 'success') onClose();
  }, [state.status, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5" onClick={onClose}>
      <div
        className="max-h-[88vh] w-full max-w-md overflow-auto rounded-2xl border border-white/10 bg-brand-surface p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-lg font-semibold">{product ? 'Edit product' : 'Add product'}</h2>
        <form action={formAction} className="flex flex-col gap-4">
          {product && <input type="hidden" name="productId" value={product.id} />}

          <div>
            <label className="mb-1.5 block text-xs text-brand-muted">Title</label>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-brand-muted">URL slug</label>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-brand-muted">Short description</label>
            <textarea
              name="shortDescription"
              rows={3}
              defaultValue={product?.short_description ?? ''}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs text-brand-muted">Regular price</label>
              <input
                name="regularPrice"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={product?.regular_price ?? ''}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-brand-muted">Sale price (optional)</label>
              <input
                name="salePrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.sale_price ?? ''}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-brand-muted">Product image</label>
            <input name="image" type="file" accept="image/*" className="w-full text-sm" />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={product ? product.is_active : true}
              className="h-4 w-4"
            />
            Visible in shop
          </label>

          {state.status === 'error' && <p className="text-sm text-brand-error">{state.message}</p>}

          <div className="mt-1 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-white/18 px-5 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-full bg-brand-accent px-5 py-2.5 text-sm font-medium text-brand-bg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Saving…' : product ? 'Save' : 'Add product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
