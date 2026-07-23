'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { productSchema } from '@/lib/validation/schemas';

export type ProductFormState = { status: 'idle' } | { status: 'error'; message: string } | { status: 'success' };

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

export async function saveProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const supabase = await getAuthedClient();
  if (!supabase) return { status: 'error', message: 'Not authorized.' };

  const parsed = productSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    shortDescription: formData.get('shortDescription'),
    regularPrice: formData.get('regularPrice'),
    salePrice: formData.get('salePrice') || undefined,
    isActive: formData.get('isActive') === 'on',
  });

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }

  const productId = formData.get('productId');
  const file = formData.get('image') as File | null;

  let imageUrl: string | undefined;
  if (file && file.size > 0) {
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, {
      upsert: true,
    });
    if (uploadError) {
      return { status: 'error', message: 'Image upload failed — please try again.' };
    }
    imageUrl = supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
  }

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    short_description: parsed.data.shortDescription || null,
    regular_price: parsed.data.regularPrice,
    sale_price: parsed.data.salePrice ?? null,
    is_active: parsed.data.isActive,
    ...(imageUrl ? { image_url: imageUrl } : {}),
  };

  const { error } =
    typeof productId === 'string' && productId
      ? await supabase.from('products').update(payload).eq('id', productId)
      : await supabase.from('products').insert(payload);

  if (error) {
    return { status: 'error', message: 'Something went wrong saving the product.' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/');
  return { status: 'success' };
}

export async function deleteProduct(id: string) {
  const supabase = await getAuthedClient();
  if (!supabase) return;

  await supabase.from('products').delete().eq('id', id);
  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/');
}
