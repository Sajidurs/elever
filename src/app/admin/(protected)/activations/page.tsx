import type { Metadata } from 'next';
import { getActivations, getActivationAttempts } from '@/lib/data/activations';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin — Activations', robots: { index: false, follow: false } };

export default async function AdminActivationsPage() {
  const [activations, attempts] = await Promise.all([getActivations(), getActivationAttempts()]);

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
            </tr>
          </thead>
          <tbody>
            {activations.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-brand-muted">
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
            </tr>
          </thead>
          <tbody>
            {attempts.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-brand-muted">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
