'use client';

import { useActionState } from 'react';
import { submitMessage, type ContactState } from './actions';

const initialState: ContactState = { status: 'idle' };

const inputClass =
  'w-full rounded-xl border border-white/12 bg-[#0f0f11] px-4 py-3.5 text-sm outline-none focus:border-brand-accent';

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitMessage, initialState);

  if (state.status === 'success') {
    return (
      <div className="py-6 text-center">
        <p className="mb-2.5 text-lg font-medium">Message sent.</p>
        <p className="text-sm text-brand-muted">Thanks for reaching out — we&apos;ll reply within one business day.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3.5">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <input name="firstName" placeholder="First name" required className={inputClass} />
        <input name="lastName" placeholder="Last name" className={inputClass} />
      </div>
      <input name="email" type="email" placeholder="Email address" required className={inputClass} />
      <select name="subject" defaultValue="" className={`${inputClass} text-brand-muted`}>
        <option value="">What is this about?</option>
        <option value="Order or shipping">Order or shipping</option>
        <option value="Activation help">Activation help</option>
        <option value="Rewards & app">Rewards &amp; app</option>
        <option value="Returns">Returns</option>
        <option value="Something else">Something else</option>
      </select>
      <textarea name="message" placeholder="Your message" rows={5} required className={`resize-y ${inputClass}`} />

      {state.status === 'error' && <p className="text-sm text-brand-error">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 cursor-pointer rounded-xl bg-brand-text py-3.5 text-sm font-medium text-brand-bg transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
