import { createClient } from '@/lib/supabase/server';
import type { Activation, ActivationAttempt } from '@/lib/types/database';

export async function getActivations(): Promise<Activation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// Fails soft (returns []) rather than throwing — activation_attempts is an
// additive table; if it hasn't been migrated yet, the Activations page should
// still render the real activations list instead of 500ing entirely.
export async function getActivationAttempts(): Promise<ActivationAttempt[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activation_attempts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data ?? [];
}
