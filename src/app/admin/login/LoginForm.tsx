'use client';

import { useActionState } from 'react';
import { login, type LoginState } from './actions';

const initialState: LoginState = { status: 'idle' };

const inputClass =
  'w-full rounded-lg border border-white/12 bg-[#0f0f11] px-3.5 py-3 text-sm outline-none focus:border-brand-accent';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3.5">
      <div>
        <label className="mb-1.5 block text-xs text-brand-muted">Email</label>
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-brand-muted">Password</label>
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </div>
      {state.status === 'error' && <p className="text-sm text-brand-error">{state.message}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="mt-1.5 w-full cursor-pointer rounded-lg bg-brand-accent py-3 text-sm font-medium text-brand-bg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
