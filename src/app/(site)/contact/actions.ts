'use server';

import { createClient } from '@/lib/supabase/server';
import { contactSchema } from '@/lib/validation/schemas';

export type ContactState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success' };

export async function submitMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Please fill in your first name, email, and message.' };
  }

  const { firstName, lastName, email, subject, message } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from('messages').insert({
    first_name: firstName,
    last_name: lastName || null,
    email,
    subject: subject || null,
    message,
  });

  if (error) {
    return { status: 'error', message: 'Something went wrong — please try again.' };
  }

  return { status: 'success' };
}
