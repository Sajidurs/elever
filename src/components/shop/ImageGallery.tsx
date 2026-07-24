'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ImageLightbox } from './ImageLightbox';

const SWIPE_THRESHOLD = 40;

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const hasMultiple = images.length > 1;

  function goPrev() {
    setActive((i) => (i - 1 + images.length) % images.length);
  }
  function goNext() {
    setActive((i) => (i + 1) % images.length);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) goPrev();
      else goNext();
    }
    setTouchStartX(null);
  }

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl border border-white/8 bg-gradient-to-br from-[#1a1a1e] to-[#0d0d0f]" />
    );
  }

  return (
    <div>
      <div
        className="group relative mb-3 aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-[#1a1a1e] to-[#0d0d0f]"
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-lg text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
              className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-lg text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              ›
            </button>
          </>
        )}

        <span className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-base text-white opacity-0 transition-opacity group-hover:opacity-100">
          ⤢
        </span>
      </div>

      {hasMultiple && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border transition-colors',
                active === i ? 'border-brand-accent' : 'border-white/10 hover:border-white/30',
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          alt={alt}
          initialIndex={active}
          onIndexChange={setActive}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
