import type { Metadata } from 'next';
import { getActivations } from '@/lib/data/activations';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin — Activations', robots: { index: false, follow: false } };

export default async function AdminActivationsPage() {
  const activations = await getActivations();

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Activations</h1>
      <div className="overflow-x-auto rounded-xl border border-white/8">
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
    </div>
  );
}
