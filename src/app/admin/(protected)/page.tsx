import type { Metadata } from 'next';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getDashboardStats, RANGE_LABELS, type DashboardRange } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin — Dashboard', robots: { index: false, follow: false } };

const RANGES: DashboardRange[] = ['today', '7d', '30d', 'all'];

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: 'default' | 'warning';
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-5',
        tone === 'warning' ? 'border-brand-error/30 bg-brand-error/5' : 'border-white/8 bg-brand-surface',
      )}
    >
      <p className="mb-2 text-xs tracking-wide text-brand-muted uppercase">{label}</p>
      <p className={cn('text-3xl font-light', tone === 'warning' && 'text-brand-error')}>{value}</p>
      {hint && <p className="mt-1 text-xs text-brand-subtle">{hint}</p>}
    </div>
  );
}

export default async function AdminDashboardPage(props: PageProps<'/admin'>) {
  const searchParams = await props.searchParams;
  const requested = searchParams.range;
  const range: DashboardRange = RANGES.includes(requested as DashboardRange) ? (requested as DashboardRange) : '7d';
  const stats = await getDashboardStats(range);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex gap-1 rounded-full border border-white/10 p-1">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/admin?range=${r}`}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs',
                range === r ? 'bg-brand-accent font-medium text-brand-bg' : 'text-brand-muted hover:text-brand-text',
              )}
            >
              {RANGE_LABELS[r]}
            </Link>
          ))}
        </div>
      </div>

      <h2 className="mb-3 text-xs tracking-wide text-brand-muted uppercase">Orders</h2>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Pending" value={stats.ordersPending} />
        <StatCard label="Fulfilled" value={stats.ordersFulfilled} />
        <StatCard label="Cancelled" value={stats.ordersCancelled} />
        <StatCard label="Total" value={stats.ordersTotal} />
      </div>

      <h2 className="mb-3 text-xs tracking-wide text-brand-muted uppercase">Activity</h2>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Activations" value={stats.activations} />
        <StatCard
          label="Failed activations"
          value={stats.failedActivationAttempts}
          tone="warning"
          hint="Wrong phone number"
        />
        <StatCard label="Messages" value={stats.messages} />
      </div>

      <h2 className="mb-3 text-xs tracking-wide text-brand-muted uppercase">Catalog (all time)</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Active products" value={stats.productsActive} />
        <StatCard label="Total products" value={stats.productsTotal} />
      </div>
    </div>
  );
}
