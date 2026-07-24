import { createClient } from '@/lib/supabase/server';

export type DashboardRange = 'today' | '7d' | '30d' | 'all';

export const RANGE_LABELS: Record<DashboardRange, string> = {
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  all: 'All time',
};

function rangeStartIso(range: DashboardRange): string | null {
  const now = new Date();
  if (range === 'today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  }
  if (range === '7d') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  if (range === '30d') return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  return null;
}

export interface DashboardStats {
  ordersPending: number;
  ordersFulfilled: number;
  ordersCancelled: number;
  ordersTotal: number;
  activations: number;
  failedActivationAttempts: number;
  messages: number;
  productsActive: number;
  productsTotal: number;
}

export async function getDashboardStats(range: DashboardRange): Promise<DashboardStats> {
  const supabase = await createClient();
  const start = rangeStartIso(range);

  async function countRows(table: string, status?: string) {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    if (status) query = query.eq('status', status);
    if (start) query = query.gte('created_at', start);
    const { count } = await query;
    return count ?? 0;
  }

  const [
    ordersPending,
    ordersFulfilled,
    ordersCancelled,
    activations,
    failedActivationAttempts,
    messages,
    productsActiveResult,
    productsTotalResult,
  ] = await Promise.all([
    countRows('orders', 'pending'),
    countRows('orders', 'fulfilled'),
    countRows('orders', 'cancelled'),
    countRows('activations'),
    countRows('activation_attempts'),
    countRows('messages'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('products').select('*', { count: 'exact', head: true }),
  ]);

  return {
    ordersPending,
    ordersFulfilled,
    ordersCancelled,
    ordersTotal: ordersPending + ordersFulfilled + ordersCancelled,
    activations,
    failedActivationAttempts,
    messages,
    productsActive: productsActiveResult.count ?? 0,
    productsTotal: productsTotalResult.count ?? 0,
  };
}
