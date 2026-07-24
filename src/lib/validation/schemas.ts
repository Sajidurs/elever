import { z } from 'zod';

export const activationSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
  phone: z.string().trim().min(7, 'Please enter a valid phone number.'),
  email: z.string().trim().email('Please enter a valid email.'),
});

export const orderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1),
  fullName: z.string().trim().min(1, 'Please enter your full name.'),
  phone: z.string().trim().min(7, 'Please enter a valid phone number.'),
  address: z.string().trim().min(1, 'Please enter your delivery address.'),
  deliveryZone: z.enum(['dhaka', 'outside']),
});

export const cartOrderSchema = z.object({
  fullName: z.string().trim().min(1, 'Please enter your full name.'),
  phone: z.string().trim().min(7, 'Please enter a valid phone number.'),
  address: z.string().trim().min(1, 'Please enter your delivery address.'),
  deliveryZone: z.enum(['dhaka', 'outside']),
});

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, 'Please enter your first name.'),
  lastName: z.string().trim().optional(),
  email: z.string().trim().email('Please enter a valid email.'),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(1, 'Please enter a message.'),
});

export const productSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  shortDescription: z.string().trim().optional(),
  regularPrice: z.coerce.number().min(0, 'Regular price must be zero or more.'),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  isActive: z.coerce.boolean(),
});

export const settingsSchema = z.object({
  discountText: z.string().trim().min(1, 'Discount text is required.'),
  pdfUrl: z.string().trim().optional(),
  playstoreUrl: z.string().trim().optional(),
});

export const trackOrderSchema = z.object({
  phone: z.string().trim().min(7, 'Please enter a valid phone number.'),
  orderNumber: z.string().trim().min(4, 'Please enter your order number.'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email.'),
  password: z.string().min(1, 'Please enter your password.'),
});
