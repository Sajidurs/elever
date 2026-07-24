import type { Metadata } from 'next';
import { getActivations, getActivationAttempts } from '@/lib/data/activations';
import { ActivationsView } from './ActivationsView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin — Activations', robots: { index: false, follow: false } };

export default async function AdminActivationsPage() {
  const [activations, attempts] = await Promise.all([getActivations(), getActivationAttempts()]);
  return <ActivationsView activations={activations} attempts={attempts} />;
}
