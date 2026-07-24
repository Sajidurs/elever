import type { Metadata } from 'next';
import { getOrders } from '@/lib/data/orders';
import { getMessages } from '@/lib/data/messages';
import { ContactsView } from './ContactsView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin — Contacts', robots: { index: false, follow: false } };

export default async function AdminContactsPage() {
  const [orders, messages] = await Promise.all([getOrders(), getMessages()]);
  return <ContactsView orders={orders} messages={messages} />;
}
