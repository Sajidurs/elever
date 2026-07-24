'use client';

import { useMemo, useState } from 'react';
import type { Order, Message } from '@/lib/types/database';
import { formatPrice } from '@/lib/utils';
import { DELIVERY_LABELS } from '@/lib/delivery';
import { CONTACT_RANGES, CONTACT_RANGE_LABELS, contactRangeStart, type ContactRange } from '@/lib/contacts';

export function ContactsView({ orders, messages }: { orders: Order[]; messages: Message[] }) {
  const [range, setRange] = useState<ContactRange>('all');

  const filteredOrders = useMemo(() => {
    const start = contactRangeStart(range);
    return start ? orders.filter((o) => new Date(o.created_at) >= start) : orders;
  }, [orders, range]);

  const filteredMessages = useMemo(() => {
    const start = contactRangeStart(range);
    return start ? messages.filter((m) => new Date(m.created_at) >= start) : messages;
  }, [messages, range]);

  async function handleDownloadPdf() {
    const { jsPDF } = await import('jspdf');
    const { autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Elever — Customer Contacts', 14, 16);
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text(`${CONTACT_RANGE_LABELS[range]} — generated ${new Date().toLocaleDateString()}`, 14, 22);
    doc.setTextColor(0);

    autoTable(doc, {
      startY: 28,
      head: [['Name', 'Phone', 'Address', 'Delivery', 'Total', 'Date']],
      body: filteredOrders.map((o) => [
        o.full_name,
        o.phone,
        o.address,
        o.delivery_zone ? DELIVERY_LABELS[o.delivery_zone] : '—',
        formatPrice(o.total ?? (o.product_price ?? 0) * (o.quantity ?? 0)),
        new Date(o.created_at).toLocaleDateString(),
      ]),
      headStyles: { fillColor: [193, 160, 120] },
      styles: { fontSize: 8 },
    });

    const afterOrdersY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 28;
    doc.setFontSize(12);
    doc.text('From Contact Messages', 14, afterOrdersY + 10);

    autoTable(doc, {
      startY: afterOrdersY + 14,
      head: [['Name', 'Email', 'Subject', 'Date']],
      body: filteredMessages.map((m) => [
        `${m.first_name} ${m.last_name ?? ''}`.trim(),
        m.email,
        m.subject ?? '—',
        new Date(m.created_at).toLocaleDateString(),
      ]),
      headStyles: { fillColor: [193, 160, 120] },
      styles: { fontSize: 8 },
    });

    doc.save(`elever-contacts-${range}-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Contacts</h1>
        <button
          onClick={handleDownloadPdf}
          className="cursor-pointer rounded-full bg-brand-accent px-4 py-2 text-sm font-medium text-brand-bg"
        >
          Download PDF
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        {CONTACT_RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs ${
              range === r ? 'bg-brand-accent/15 text-brand-accent' : 'border border-white/12 text-brand-muted'
            }`}
          >
            {CONTACT_RANGE_LABELS[r]}
          </button>
        ))}
      </div>

      <h2 className="mb-3 text-xs font-semibold tracking-wide text-brand-muted uppercase">
        From orders ({filteredOrders.length})
      </h2>
      <div className="mb-8 overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs text-brand-muted uppercase">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">Delivery</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-brand-muted">
                  No customers in this range.
                </td>
              </tr>
            )}
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-b border-white/8 last:border-0">
                <td className="p-3">{o.full_name}</td>
                <td className="p-3 whitespace-nowrap">{o.phone}</td>
                <td className="max-w-[220px] p-3">{o.address}</td>
                <td className="p-3 whitespace-nowrap">{o.delivery_zone ? DELIVERY_LABELS[o.delivery_zone] : '—'}</td>
                <td className="p-3 whitespace-nowrap">
                  {formatPrice(o.total ?? (o.product_price ?? 0) * (o.quantity ?? 0))}
                </td>
                <td className="p-3 whitespace-nowrap">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 text-xs font-semibold tracking-wide text-brand-muted uppercase">
        From messages ({filteredMessages.length})
      </h2>
      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs text-brand-muted uppercase">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-brand-muted">
                  No messages in this range.
                </td>
              </tr>
            )}
            {filteredMessages.map((m) => (
              <tr key={m.id} className="border-b border-white/8 last:border-0">
                <td className="p-3">
                  {m.first_name} {m.last_name ?? ''}
                </td>
                <td className="p-3">{m.email}</td>
                <td className="p-3">{m.subject ?? '—'}</td>
                <td className="p-3 whitespace-nowrap">{new Date(m.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
