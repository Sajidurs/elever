'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { settingsSchema } from '@/lib/validation/schemas';

export type SettingsFormState = { status: 'idle' } | { status: 'error'; message: string } | { status: 'success' };

export async function updateSettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: 'error', message: 'Not authorized.' };

  const parsed = settingsSchema.safeParse({
    discountText: formData.get('discountText'),
    pdfUrl: formData.get('pdfUrl'),
    playstoreUrl: formData.get('playstoreUrl'),
  });

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }

  const { error } = await supabase
    .from('settings')
    .update({
      discount_text: parsed.data.discountText,
      pdf_url: parsed.data.pdfUrl || null,
      playstore_url: parsed.data.playstoreUrl || null,
    })
    .eq('id', 1);

  if (error) {
    return { status: 'error', message: 'Something went wrong saving settings.' };
  }

  revalidatePath('/admin/settings');
  revalidatePath('/activate');
  return { status: 'success' };
}
