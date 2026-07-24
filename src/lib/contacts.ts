export type ContactRange = 'week' | 'month' | 'year' | 'all';

export const CONTACT_RANGES: ContactRange[] = ['week', 'month', 'year', 'all'];

export const CONTACT_RANGE_LABELS: Record<ContactRange, string> = {
  week: 'Last 7 days',
  month: 'Last 30 days',
  year: 'Last 365 days',
  all: 'All time',
};

export function contactRangeStart(range: ContactRange): Date | null {
  const now = new Date();
  if (range === 'week') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (range === 'month') return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  if (range === 'year') return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  return null;
}
