import Image from 'next/image';
import Link from 'next/link';
import { LinkButton } from '@/components/ui/Button';
import { getActiveProducts } from '@/lib/data/products';
import { benefits, teaserReviews } from '@/lib/content';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getActiveProducts();
  const featured = products[0] ?? null;
  const price = featured ? (featured.sale_price ?? featured.regular_price) : null;

  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pt-24 pb-16 text-center sm:px-8 sm:pt-32">
        <p className="mb-5 text-xs tracking-[0.22em] text-brand-accent uppercase">Elever Notes</p>
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05] font-extralight tracking-tight">
          Do the work that matters, every single day.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-brand-muted">
          A premium daily planner and a connected system, built to turn intention into focused execution — one
          deliberate day at a time.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <LinkButton href={featured ? `/shop/${featured.slug}` : '/shop'} variant="primary">
            Buy {featured?.title ?? 'Elever G1'}
          </LinkButton>
          <LinkButton href="/features" variant="secondary">
            Learn more
          </LinkButton>
        </div>
      </section>

      {featured && (
        <section className="border-t border-white/8">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:grid-cols-2 sm:px-8 sm:py-28">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-[#1a1a1e] to-[#0d0d0f]">
              {featured.image_url && (
                <Image
                  src={featured.image_url}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <p className="mb-5 text-xs tracking-[0.2em] text-brand-accent uppercase">The first model</p>
              <h2 className="mb-5 text-[clamp(1.9rem,3.8vw,3.1rem)] font-extralight">{featured.title}</h2>
              <p className="mb-5 max-w-[46ch] text-brand-muted">
                {featured.short_description ||
                  'Our flagship daily planner — premium paper, a considered page system, and a connected digital ecosystem.'}
              </p>
              <div className="mb-7 flex items-baseline gap-3.5">
                <span className="text-3xl font-light">{formatPrice(price!)}</span>
                <span className="text-sm text-brand-muted">Free shipping · Undated</span>
              </div>
              <div className="flex flex-wrap gap-3.5">
                <LinkButton href={`/shop/${featured.slug}`} variant="primary">
                  Buy {featured.title}
                </LinkButton>
                <LinkButton href={`/shop/${featured.slug}`} variant="secondary">
                  Explore the {featured.title}
                </LinkButton>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-white/8">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <h2 className="mb-3 text-center text-[clamp(1.6rem,3.4vw,2.6rem)] font-extralight">
            Why it makes you productive
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-brand-muted">
            Four habits, built into the structure of every page.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-white/8 bg-brand-surface p-7">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/7 bg-brand-surface-alt text-xl text-brand-accent">
                  {b.icon}
                </div>
                <h3 className="mb-2 text-[17px] font-medium">{b.title}</h3>
                <p className="text-sm text-brand-muted">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-gradient-to-b from-[#0d0d0f] to-[#111113]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="mb-5 text-xs tracking-[0.2em] text-brand-accent uppercase">The Elever ecosystem</p>
          <h2 className="mb-5 max-w-xl text-[clamp(1.7rem,3.6vw,2.9rem)] font-extralight">
            Scan. Activate. Unlock your year.
          </h2>
          <p className="mb-8 max-w-[44ch] text-brand-muted">
            A QR code inside your planner connects the paper to a quiet digital system — register, unlock free
            rewards, and get reminded before your year runs out.
          </p>
          <Link href="/features" className="border-b border-brand-accent pb-1 text-sm hover:text-brand-accent">
            See how it works →
          </Link>
        </div>
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mb-11 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="mb-2 text-[clamp(1.6rem,3.4vw,2.6rem)] font-extralight">Loved by focused people</h2>
              <p className="text-brand-muted">4.9 average · 2,400+ reviews</p>
            </div>
            <Link
              href="/shop#reviews"
              className="border-b border-brand-accent pb-1 text-sm whitespace-nowrap hover:text-brand-accent"
            >
              Read all reviews →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {teaserReviews.map((r) => (
              <div key={r.name} className="rounded-2xl border border-white/8 bg-brand-surface p-6">
                <div className="mb-4 text-[13px] tracking-[.15em] text-brand-accent">{r.stars}</div>
                <p className="mb-5 text-[15px] leading-relaxed font-light">&ldquo;{r.quote}&rdquo;</p>
                <div>
                  <div className="text-[13.5px] font-medium">{r.name}</div>
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
