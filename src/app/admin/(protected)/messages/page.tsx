import type { Metadata } from 'next';
import { getMessages } from '@/lib/data/messages';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin — Messages', robots: { index: false, follow: false } };

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Messages</h1>
      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs text-brand-muted uppercase">
              <th className="p-3">Date</th>
              <th className="p-3">From</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-brand-muted">
                  No messages yet.
                </td>
              </tr>
            )}
            {messages.map((m) => (
              <tr key={m.id} className="border-b border-white/8 last:border-0">
                <td className="p-3 whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</td>
                <td className="p-3">
                  <div>
                    {m.first_name} {m.last_name ?? ''}
                  </div>
                  <div className="text-xs text-brand-muted">{m.email}</div>
                </td>
                <td className="p-3">{m.subject ?? '—'}</td>
                <td className="max-w-[320px] p-3 whitespace-pre-wrap">{m.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
