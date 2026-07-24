'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

export async function deleteActivation(id: string) {
  const supabase = await getAuthedClient();
  if (!supabase) return;

  await supabase.from('activations').delete().eq('id', id);
  revalidatePath('/admin/activations');
}

export async function deleteActivationAttempt(id: string) {
  const supabase = await getAuthedClient();
  if (!supabase) return;

  await supabase.from('activation_attempts').delete().eq('id', id);
  revalidatePath('/admin/activations');
}
