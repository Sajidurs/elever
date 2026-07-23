import { createClient } from '@/lib/supabase/server';
import type { Activation } from '@/lib/types/database';

export async function getActivations(): Promise<Activation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
