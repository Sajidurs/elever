import type { Metadata } from 'next';
import { getCoupons } from '@/lib/data/coupons';
import { CouponsTable } from './CouponsTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin — Coupons', robots: { index: false, follow: false } };

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  return <CouponsTable coupons={coupons} />;
}
