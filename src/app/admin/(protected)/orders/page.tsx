import type { Metadata } from 'next';
import { getOrders } from '@/lib/data/orders';
import { OrdersTable } from './OrdersTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin — Orders', robots: { index: false, follow: false } };

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrdersTable orders={orders} />;
}
