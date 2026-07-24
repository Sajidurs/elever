'use client';

import { useActionState, useEffect, useState } from 'react';
import Image from 'next/image';
import { addProductImages, deleteProductImage, type GalleryState } from './actions';
import type { ProductImage } from '@/lib/types/database';

const initialState: GalleryState = { status: 'idle' };

export function GalleryManager({ productId, images }: { productId: string; images: ProductImage[] }) {
  const [state, formAction, isPending] = useActionState(addProductImages, initialState);
  const [localImages, setLocalImages] = useState(images);

  useEffect(() => {
    if (state.status === 'success') {
      setLocalImages((prev) => [...prev, ...state.images]);
    }
  }, [state]);

  function handleDelete(image: ProductImage) {
    if (!confirm('Remove this image?')) return;
    setLocalImages((prev) => prev.filter((img) => img.id !== image.id));
    deleteProductImage(image.id, image.image_url);
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs text-brand-muted">Gallery images</label>
      {localImages.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {localImages.map((img) => (
            <div key={img.id} className="group relative h-16 w-16 overflow-hidden rounded-md border border-white/10">
              <Image src={img.image_url} alt="" fill sizes="64px" className="object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(img)}
                className="absolute top-0.5 right-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-black/70 text-[10px] leading-none text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <form action={formAction} className="flex items-center gap-2">
        <input type="hidden" name="productId" value={productId} />
        <input name="images" type="file" accept="image/*" multiple className="flex-1 text-xs" />
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer rounded-full border border-white/18 px-3.5 py-1.5 text-xs whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Uploading…' : 'Add'}
        </button>
      </form>
      {state.status === 'error' && <p className="mt-1.5 text-xs text-brand-error">{state.message}</p>}
      <p className="mt-1.5 text-xs text-brand-subtle">Shown on the product page alongside the cover image above.</p>
    </div>
  );
}
