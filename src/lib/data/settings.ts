import { createClient } from '@/lib/supabase/server';
import type { Settings } from '@/lib/types/database';

export async function getSettings(): Promise<Settings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return data;
}

export async function updateSettings(
  patch: Partial<Pick<Settings, 'discount_text' | 'pdf_url' | 'playstore_url'>>,
) {
  const supabase = await createClient();
  const { error } = await supabase.from('settings').update(patch).eq('id', 1);
  if (error) throw error;
}
