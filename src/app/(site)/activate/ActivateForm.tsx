'use client';

import { useActionState, useState } from 'react';
import { submitActivation, type ActivationState } from './actions';
import { RewardsPopup } from './RewardsPopup';

const initialState: ActivationState = { status: 'idle' };

const inputClass =
  'w-full rounded-xl border border-white/12 bg-[#0f0f11] px-4 py-3.5 text-sm outline-none focus:border-brand-accent';

export function ActivateForm() {
  const [state, formAction, isPending] = useActionState(submitActivation, initialState);
  const [dismissed, setDismissed] = useState(false);

  const showPopup = state.status === 'success' && !dismissed;

  return (
    <>
      <form action={formAction} className="flex flex-col gap-3">
        <input name="name" placeholder="Full name" required className={inputClass} />
        <input name="phone" placeholder="Phone number" required className={inputClass} />
        <input name="email" type="email" placeholder="Email address" required className={inputClass} />

        {state.status === 'error' && <p className="text-sm text-brand-error">{state.message}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-1 cursor-pointer rounded-xl bg-brand-text py-3.5 text-sm font-medium text-brand-bg transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Activating…' : 'Activate my year'}
        </button>
      </form>

      {showPopup && (
        <RewardsPopup
          name={state.name}
          discountText={state.discountText}
          pdfUrl={state.pdfUrl}
          playstoreUrl={state.playstoreUrl}
          onClose={() => setDismissed(true)}
        />
      )}
    </>
  );
}
