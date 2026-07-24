'use client';

import { useTransition } from 'react';
import type { Activation, ActivationAttempt } from '@/lib/types/database';
import { deleteActivation, deleteActivationAttempt } from './actions';

export function ActivationsView({
  activations,
  attempts,
}: {
  activations: Activation[];
  attempts: ActivationAttempt[];
}) {
  const [, startTransition] = useTransition();

  function handleDeleteActivation(id: string) {
    if (!confirm('Delete this activation record? This cannot be undone.')) return;
    startTransition(() => {
      deleteActivation(id);
    });
  }

  function handleDeleteAttempt(id: string) {
    if (!confirm('Delete this failed attempt record?')) return;
    startTransition(() => {
      deleteActivationAttempt(id);
    });
  }

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center gap-4">
        <h1 className="text-xl font-semibold">Activations</h1>
        <span className="rounded-full border border-brand-error/30 bg-brand-error/5 px-3 py-1 text-xs text-brand-error">
          {attempts.length} failed attempt{attempts.length === 1 ? '' : 's'} (wrong phone number)
        </span>
      </div>

      <div className="mb-10 overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs text-brand-muted uppercase">
              <th className="p-3">Date</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {activations.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-brand-muted">
                  No activations yet.
                </td>
              </tr>
            )}
            {activations.map((a) => (
              <tr key={a.id} className="border-b border-white/8 last:border-0">
                <td className="p-3 whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</td>
                <td className="p-3">{a.name}</td>
                <td className="p-3">{a.phone}</td>
                <td className="p-3">{a.email}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDeleteActivation(a.id)}
                    className="cursor-pointer text-xs text-brand-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 text-sm font-medium text-brand-muted">Failed activation attempts</h2>
      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs text-brand-muted uppercase">
              <th className="p-3">Date</th>
              <th className="p-3">Name entered</th>
              <th className="p-3">Phone tried</th>
              <th className="p-3">Email entered</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {attempts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-brand-muted">
                  No failed attempts.
                </td>
              </tr>
            )}
            {attempts.map((a) => (
              <tr key={a.id} className="border-b border-white/8 last:border-0">
                <td className="p-3 whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</td>
                <td className="p-3">{a.name ?? '—'}</td>
                <td className="p-3 text-brand-error">{a.phone}</td>
                <td className="p-3">{a.email ?? '—'}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDeleteAttempt(a.id)}
                    className="cursor-pointer text-xs text-brand-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
