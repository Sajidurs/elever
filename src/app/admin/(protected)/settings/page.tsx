import type { Metadata } from 'next';
import { getSettings } from '@/lib/data/settings';
import { SettingsForm } from './SettingsForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin — Settings', robots: { index: false, follow: false } };

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
