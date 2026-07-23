import type { Metadata } from 'next';
import { TrackOrderForm } from './TrackOrderForm';

export const metadata: Metadata = {
  title: 'Track your order',
  description: 'Check the status of your Elever Notes order using your phone number and order number.',
};

export default function TrackOrderPage() {
  return (
    <section className="mx-auto max-w-md px-5 pt-24 pb-24 sm:px-8 sm:pt-32">
      <p className="mb-6 text-center text-xs tracking-[0.22em] text-brand-accent uppercase">Track order</p>
      <h1 className="mb-5 text-center text-[clamp(1.9rem,4.4vw,2.8rem)] leading-[1.1] font-extralight tracking-tight">
        Where&apos;s my order?
      </h1>
      <p className="mx-auto mb-10 max-w-[42ch] text-center text-brand-muted">
        Enter the phone number and order number from your confirmation to check your status.
      </p>
      <TrackOrderForm />
    </section>
  );
}
