'use server';

import { createClient } from '@/lib/supabase/server';
import { trackOrderSchema } from '@/lib/validation/schemas';
import type { TrackedOrder } from '@/lib/types/database';

export type TrackOrderState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; order: TrackedOrder };

export async function trackOrder(_prev: TrackOrderState, formData: FormData): Promise<TrackOrderState> {
  const parsed = trackOrderSchema.safeParse({
    phone: formData.get('phone'),
    orderNumber: formData.get('orderNumber'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Please enter your phone number and order number.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('track_order', {
    p_phone: parsed.data.phone,
    p_order_ref: parsed.data.orderNumber,
  });

  if (error || !data || data.length === 0) {
    return {
      status: 'error',
      message:
        "We couldn't find an order with that phone number and order number. Please double-check and try again.",
    };
  }

  return { status: 'success', order: data[0] as TrackedOrder };
}
