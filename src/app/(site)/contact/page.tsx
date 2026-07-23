import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Get in touch with the Elever Notes team about orders, activation, or the ecosystem — we reply within one business day.",
};

const CONTACT_METHODS = [
  { label: 'Email', value: 'hello@elevernotes.com', icon: '✉' },
  { label: 'Support hours', value: 'Mon–Fri · 9am – 6pm', icon: '◷' },
  { label: 'Response time', value: 'Within one business day', icon: '↩' },
];

const CONTACT_LINKS = [
  { title: 'Activate your planner', text: 'Register your G1 and unlock your rewards.', href: '/activate' },
  { title: 'Shop Elever G1', text: 'Browse the planner and place an order.', href: '/shop' },
];

export default function ContactPage() {
  return (
    <>
      <section className="mx-auto grid max-w-5xl gap-10 px-5 pt-24 pb-16 sm:grid-cols-2 sm:px-8 sm:pt-32">
        <div>
          <p className="mb-6 text-xs tracking-[0.22em] text-brand-accent uppercase">Contact</p>
          <h1 className="mb-5.5 text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.06] font-extralight">
            We&apos;re here to help.
          </h1>
          <p className="mb-9 max-w-[42ch] leading-relaxed text-brand-muted">
            Questions about the G1, your order, activation, or the ecosystem — send a note and we&apos;ll reply
            within one business day.
          </p>
          <div className="flex flex-col gap-6">
            {CONTACT_METHODS.map((m) => (
              <div key={m.label} className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] border border-white/8 bg-brand-surface text-lg text-brand-accent">
                  {m.icon}
                </div>
                <div>
                  <div className="mb-1.5 text-xs tracking-[0.12em] text-brand-muted uppercase">{m.label}</div>
                  <div className="text-[15px]">{m.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] border border-white/8 bg-brand-surface p-7 sm:p-9">
          <ContactForm />
        </div>
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-5 py-14 sm:grid-cols-2 sm:px-8">
          {CONTACT_LINKS.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="rounded-2xl border border-white/8 bg-brand-surface p-6.5 transition-colors hover:border-white/20"
            >
              <h3 className="mb-2 text-base font-medium">{c.title}</h3>
              <p className="text-[13.5px] text-brand-muted">{c.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
