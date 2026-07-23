import type { Metadata } from 'next';
import Link from 'next/link';
import { LinkButton } from '@/components/ui/Button';
import { benefits, research, ecosystem } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Features',
  description:
    'A calm system built on focus, planning, habit tracking, and reflection — backed by research, connected by one QR-code activation.',
};

export default function FeaturesPage() {
  return (
    <>
      <section className="mx-auto max-w-2xl px-5 pt-24 pb-12 text-center sm:px-8 sm:pt-32">
        <p className="mb-5 text-xs tracking-[0.22em] text-brand-accent uppercase">Features</p>
        <h1 className="mb-5 text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.1] font-extralight tracking-tight text-balance">
          Built to remove friction, not add features.
        </h1>
        <p className="mx-auto max-w-[56ch] text-brand-muted">
          A calm system for deciding what matters, doing it, and closing the loop — every Elever product is
          designed around the same four moves.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-white/8 bg-brand-surface p-7">
              <div className="mb-4 text-xl text-brand-accent">{b.icon}</div>
              <h3 className="mb-2.5 text-[16.5px] font-medium">{b.title}</h3>
              <p className="text-sm text-brand-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="mb-5 text-xs tracking-[0.2em] text-brand-muted uppercase">Why we build this way</p>
            <h2 className="text-[clamp(1.5rem,3vw,2.4rem)] leading-tight font-extralight">
              Research we design around — not proof, just good reasons.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {research.map((r) => (
              <div key={r.title} className="rounded-2xl border border-white/8 bg-brand-surface p-6.5">
                <div className="mb-3 text-3xl font-extralight text-brand-accent">{r.stat}</div>
                <h3 className="mb-2.5 text-[15.5px] font-medium">{r.title}</h3>
                <p className="mb-3 text-[13.5px] leading-relaxed text-[#c9c9cc]">{r.text}</p>
                <p className="text-xs leading-relaxed text-brand-subtle">
                  {r.source} — {r.disclaimer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="mb-5 text-xs tracking-[0.2em] text-brand-muted uppercase">The activation system</p>
            <h2 className="text-[clamp(1.5rem,3vw,2.4rem)] leading-tight font-extralight">
              One scan connects the page to the system.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ecosystem.map((e) => (
              <div key={e.title} className="text-center">
                <div className="mb-3.5 text-2xl text-brand-accent">{e.icon}</div>
                <h3 className="mb-2.5 text-[15.5px] font-medium">{e.title}</h3>
                <p className="text-[13.5px] text-brand-muted">{e.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-11 text-center">
            <Link
              href="/activate"
              className="rounded-full border border-white/18 px-5.5 py-2.5 text-[13.5px] hover:border-white/40"
            >
              Activate a planner →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 py-24 text-center">
        <h2 className="mb-6 text-[clamp(1.5rem,3vw,2.25rem)] font-extralight">See it in the Elever G1.</h2>
        <LinkButton href="/shop" variant="accent">
          Shop Elever G1
        </LinkButton>
      </section>
    </>
  );
}
