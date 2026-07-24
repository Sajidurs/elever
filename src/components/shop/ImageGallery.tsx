'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl border border-white/8 bg-gradient-to-br from-[#1a1a1e] to-[#0d0d0f]" />
    );
  }

  return (
    <div>
      <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-[#1a1a1e] to-[#0d0d0f]">
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
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
    </div>
  );
}
