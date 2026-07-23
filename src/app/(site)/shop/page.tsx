import type { Metadata } from 'next';
import { getActiveProducts } from '@/lib/data/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { ratingBreakdown, allReviews } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse the Elever Notes product catalog — premium planners built for focused, deliberate work.',
};

export default async function ShopPage() {
  const products = await getActiveProducts();

  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pt-24 pb-12 text-center sm:px-8 sm:pt-32">
        <p className="mb-5 text-xs tracking-[0.22em] text-brand-accent uppercase">Shop</p>
        <h1 className="text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.1] font-extralight tracking-tight text-balance">
          Considered tools, built to last.
        </h1>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        {products.length === 0 ? (
          <p className="py-16 text-center text-brand-muted">No products available right now — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section id="reviews" className="scroll-mt-20 border-t border-white/8">
        <div className="mx-auto max-w-6xl px-5 pt-20 sm:px-8">
          <p className="mb-5 text-xs tracking-[0.22em] text-brand-accent uppercase">Reviews</p>
          <h2 className="mb-9 max-w-[18ch] text-[clamp(1.75rem,3.6vw,2.75rem)] leading-tight font-extralight">
            What Elever owners say.
          </h2>
          <div className="mb-14 grid grid-cols-[auto_1fr] items-center gap-9 rounded-[20px] border border-white/8 bg-brand-surface p-8">
            <div className="text-center">
              <div className="text-[clamp(3.5rem,8vw,5.5rem)] leading-none font-extralight">4.9</div>
              <div className="my-2.5 text-base tracking-[0.14em] text-brand-accent">★★★★★</div>
              <div className="text-[13px] text-brand-muted">2,431 reviews</div>
            </div>
            <div className="flex min-w-[220px] flex-col gap-3">
              {ratingBreakdown.map((rb) => (
                <div key={rb.star} className="flex items-center gap-3.5">
                  <span className="w-8 text-xs text-brand-muted">{rb.star}★</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-brand-accent" style={{ width: rb.pct }} />
                  </div>
                  <span className="w-9 text-right text-xs text-brand-muted">{rb.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          <p className="mb-7 text-sm text-brand-muted">Showing {allReviews.length} reviews</p>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {allReviews.map((r) => (
              <div
                key={r.name}
                className="mb-4 break-inside-avoid rounded-2xl border border-white/8 bg-brand-surface p-6.5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[13px] tracking-[0.14em] text-brand-accent">{r.stars}</div>
                  <span className="text-xs text-brand-subtle">{r.date}</span>
                </div>
                <p className="mb-5 text-[15px] leading-relaxed font-light">&ldquo;{r.quote}&rdquo;</p>
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-brand-muted">{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
