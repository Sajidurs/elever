'use client';

import { useActionState } from 'react';
import { updateSettingsAction, type SettingsFormState } from './actions';
import type { Settings } from '@/lib/types/database';

const initialState: SettingsFormState = { status: 'idle' };

const inputClass =
  'w-full rounded-lg border border-white/12 bg-[#0f0f11] px-3.5 py-2.5 text-sm outline-none focus:border-brand-accent';

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, isPending] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4 rounded-xl border border-white/8 p-6">
      <div>
        <label className="mb-1.5 block text-xs text-brand-muted">
          Activation discount text (shown to customers)
        </label>
        <input name="discountText" defaultValue={settings.discount_text} required className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-brand-muted">Free PDF download link</label>
        <input name="pdfUrl" defaultValue={settings.pdf_url ?? ''} className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-brand-muted">Play Store app link</label>
        <input name="playstoreUrl" defaultValue={settings.playstore_url ?? ''} className={inputClass} />
      </div>

      {state.status === 'error' && <p className="text-sm text-brand-error">{state.message}</p>}
      {state.status === 'success' && <p className="text-sm text-brand-accent">Settings saved.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer rounded-full bg-brand-accent px-5 py-2.5 text-sm font-medium text-brand-bg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  );
}
