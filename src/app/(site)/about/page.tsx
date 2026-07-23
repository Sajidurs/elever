import type { Metadata } from 'next';
import { LinkButton } from '@/components/ui/Button';
import { values } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Elever Notes builds calm, considered tools for people serious about how they spend their time. Read our story and values.',
};

const STORY_PARAGRAPHS = [
  'Elever Notes exists for a simple reason: focused daily work compounds into a meaningful year. Most tools add noise. We wanted to remove it.',
  'So we built a planner around a single discipline — decide what matters, then execute — and paired it with a quiet digital system that keeps the habit alive across all 365 days. Paper for intention and reflection; a connected ecosystem for continuity and rewards.',
  'The Elever G1 is our first model and the beginning of a growing product line. It sets the standard we intend to build on — premium, restrained, and engineered for real focus. More Elever products will follow, each held to the same bar.',
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pt-24 pb-12 text-center sm:px-8 sm:pt-32">
        <p className="mb-6 text-xs tracking-[0.22em] text-brand-accent uppercase">About Elever Notes</p>
        <h1 className="text-[clamp(2.1rem,5vw,4rem)] leading-[1.08] font-extralight tracking-tight text-balance">
          We build calm tools for people who take their work seriously.
        </h1>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16 sm:px-8">
        <div className="aspect-video overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-[#1a1a1e] to-[#0d0d0f]" />
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="mb-8 text-xs tracking-[0.2em] text-brand-muted uppercase">Our story</p>
          <div className="flex flex-col gap-7">
            <p className="text-[19px] leading-relaxed font-extralight">{STORY_PARAGRAPHS[0]}</p>
            <p className="leading-relaxed text-brand-muted">{STORY_PARAGRAPHS[1]}</p>
            <p className="leading-relaxed text-brand-muted">{STORY_PARAGRAPHS[2]}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <h2 className="mb-12 text-center text-[clamp(1.5rem,3vw,2.4rem)] font-extralight">What we value</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-white/8 bg-brand-surface p-7">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/7 bg-brand-surface-alt text-xl text-brand-accent">
                  {v.icon}
                </div>
                <h3 className="mb-2.5 text-[17px] font-medium">{v.title}</h3>
                <p className="text-sm text-brand-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-gradient-to-b from-[#0d0d0f] to-[#101012]">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="mb-6 text-xs tracking-[0.2em] text-brand-accent uppercase">The philosophy</p>
          <h2 className="mb-6 text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-extralight text-balance">
            Evidence over hype.
          </h2>
          <p className="mx-auto max-w-[56ch] leading-relaxed text-brand-muted">
            Every part of the G1 — from the focus box to the reflection prompt — is grounded in respected research
            on attention, habit formation, and time management. The same thinking shapes the free productivity
            guide we include with every planner. We design for what actually works, not what looks busy.
          </p>
        </div>
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <h2 className="mb-8 text-[clamp(1.75rem,4vw,3.1rem)] leading-tight font-extralight text-balance">
            This is where it begins.
          </h2>
          <LinkButton href="/shop" variant="primary">
            Explore the Elever G1
          </LinkButton>
        </div>
      </section>
    </>
  );
}
