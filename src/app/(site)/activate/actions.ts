'use server';

import { createClient } from '@/lib/supabase/server';
import { activationSchema } from '@/lib/validation/schemas';

export type ActivationState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | {
      status: 'success';
      name: string;
      discountText: string;
      pdfUrl: string | null;
      playstoreUrl: string | null;
    };

export async function submitActivation(
  _prev: ActivationState,
  formData: FormData,
): Promise<ActivationState> {
  const parsed = activationSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Please fill in your name, phone, and email.' };
  }

  const { name, phone, email } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from('activations').insert({ name, phone, email });
  if (error) {
    return { status: 'error', message: 'Something went wrong — please try again.' };
  }

  const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('discount_text, pdf_url, playstore_url')
    .eq('id', 1)
    .single();

  if (settingsError || !settings) {
    return {
      status: 'success',
      name,
      discountText: '15%',
      pdfUrl: null,
      playstoreUrl: null,
    };
  }

  return {
    status: 'success',
    name,
    discountText: settings.discount_text,
    pdfUrl: settings.pdf_url,
    playstoreUrl: settings.playstore_url,
  };
}
