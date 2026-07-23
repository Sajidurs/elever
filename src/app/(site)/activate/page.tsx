import type { Metadata } from 'next';
import Link from 'next/link';
import { activationSteps } from '@/lib/content';
import { ActivateForm } from './ActivateForm';

export const metadata: Metadata = {
  title: 'Activate your planner',
  description:
    'Scan the QR code in your Elever planner to register, unlock your rewards, and get a discount on your next purchase.',
};

export default function ActivatePage() {
  return (
    <>
      <section className="mx-auto max-w-2xl px-5 pt-24 pb-10 text-center sm:px-8 sm:pt-32">
        <p className="mb-6 text-xs tracking-[0.22em] text-brand-accent uppercase">Activation</p>
        <h1 className="mb-5.5 text-[clamp(2.1rem,5vw,3.9rem)] leading-[1.06] font-extralight tracking-tight text-balance">
          Activate your planner.
        </h1>
        <p className="mx-auto max-w-[52ch] leading-relaxed text-brand-muted">
          Connect your Elever planner to the Elever system in under a minute — register, unlock your rewards, and
          we&apos;ll remind you before it ends.
        </p>
      </section>

      <section className="mx-auto max-w-md px-5 pb-14 sm:px-8">
        <div className="rounded-[20px] border border-white/8 bg-brand-surface p-7 sm:p-9">
          <ActivateForm />
          <p className="mt-4.5 text-center text-xs text-brand-subtle">
            Registering activates your 365 days and all included rewards.
          </p>
        </div>
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <h2 className="mb-11 text-center text-[clamp(1.5rem,3vw,2.4rem)] font-extralight">
            How activation works
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activationSteps.map((s) => (
              <div key={s.n} className="flex flex-col gap-3.5 rounded-2xl border border-white/8 bg-brand-surface p-7">
                <span className="text-[13px] tracking-[0.1em] text-brand-accent">STEP {s.n}</span>
                <h3 className="text-base font-medium">{s.label}</h3>
                <p className="text-sm text-brand-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto max-w-xl px-5 py-20 text-center sm:px-8">
          <h2 className="mb-3.5 text-[clamp(1.3rem,2.6vw,2rem)] font-extralight">Having trouble activating?</h2>
          <p className="mb-7 text-brand-muted">Our team is glad to help — most activations work on the first try.</p>
          <Link
            href="/contact"
            className="rounded-full border border-white/18 px-6.5 py-3 text-sm hover:border-white/40"
          >
            Contact support
          </Link>
        </div>
      </section>
    </>
  );
}
