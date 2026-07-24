'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';

export function StickyBuyBar({ title, price }: { title: string; price: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById('buy-sentinel');
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: '-56px 0px 0px 0px',
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  function scrollToBuy() {
    document.getElementById('buy-sentinel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-brand-bg/95 backdrop-blur-md transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="text-xs text-brand-muted">{formatPrice(price)}</p>
        </div>
        <button
          type="button"
          onClick={scrollToBuy}
          className="flex-shrink-0 cursor-pointer rounded-full bg-brand-accent px-6 py-2.5 text-sm font-medium text-brand-bg transition-opacity hover:opacity-90"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
