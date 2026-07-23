import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/data/products';
import { formatPrice } from '@/lib/utils';
import { OrderForm } from './OrderForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: PageProps<'/shop/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };

  return {
    title: product.title,
    description: product.short_description || `Shop the ${product.title} from Elever Notes.`,
  };
}

export default async function ProductPage(props: PageProps<'/shop/[slug]'>) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const hasSale = product.sale_price != null;
  const displayPrice = formatPrice(hasSale ? product.sale_price! : product.regular_price);

  return (
    <section className="mx-auto grid max-w-5xl gap-9 px-5 py-16 sm:grid-cols-2 sm:px-8 sm:py-24">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-[#1a1a1e] to-[#0d0d0f]">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div>
        <Link href="/shop" className="mb-4.5 inline-block text-[13px] text-brand-muted hover:text-brand-text">
          ← Back to shop
        </Link>
        <h1 className="mb-3.5 text-[clamp(1.75rem,3.6vw,2.5rem)] font-light">{product.title}</h1>
        {product.short_description && (
          <p className="mb-5.5 leading-relaxed text-[#c9c9cc]">{product.short_description}</p>
        )}
        <div className="mb-7 flex items-baseline gap-3">
          <span className="text-[26px] font-medium text-brand-accent">{displayPrice}</span>
          {hasSale && (
            <span className="text-base text-brand-subtle line-through">{formatPrice(product.regular_price)}</span>
          )}
        </div>
        <OrderForm product={product} />
      </div>
    </section>
  );
}
