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

  // Only allow activation if this phone number matches a real order —
  // prevents anyone from activating with an arbitrary phone number.
  const { data: hasOrder, error: lookupError } = await supabase.rpc('phone_has_order', {
    p_phone: phone,
  });

  if (lookupError) {
    return { status: 'error', message: 'Something went wrong — please try again.' };
  }

  if (!hasOrder) {
    // Log the failed attempt so admin can see how many people tried with an
    // unregistered number — best-effort, don't block the error response on it.
    await supabase.from('activation_attempts').insert({ name, phone, email });

    return {
      status: 'error',
      message:
        "This phone number isn't registered to any order. Please use the phone number you provided when ordering your planner.",
    };
  }

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
