import type { Metadata } from 'next';
import { getMessages } from '@/lib/data/messages';
import { MessagesTable } from './MessagesTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin — Messages', robots: { index: false, follow: false } };

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  return <MessagesTable messages={messages} />;
}
