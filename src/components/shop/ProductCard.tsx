import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types/database';
import { formatPrice } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const hasSale = product.sale_price != null;
  const displayPrice = formatPrice(hasSale ? product.sale_price! : product.regular_price);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="block overflow-hidden rounded-2xl border border-white/8 bg-brand-surface-alt transition-colors hover:border-white/20"
    >
      <div className="relative aspect-4/3 bg-gradient-to-br from-[#1a1a1e] to-[#0d0d0f]">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="p-5.5">
        <h3 className="mb-2 text-lg font-medium">{product.title}</h3>
        {product.short_description && (
          <p className="mb-4 text-[13.5px] leading-relaxed text-brand-muted">{product.short_description}</p>
        )}
        <div className="flex items-baseline gap-2.5">
          <span className="text-[17px] font-medium text-brand-accent">{displayPrice}</span>
          {hasSale && (
            <span className="text-sm text-brand-subtle line-through">{formatPrice(product.regular_price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
