import { createClient } from '@/lib/supabase/server';
import type { Message } from '@/lib/types/database';

export async function getMessages(): Promise<Message[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
