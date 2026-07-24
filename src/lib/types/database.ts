export interface Product {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  regular_price: number;
  sale_price: number | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'fulfilled' | 'cancelled';

export interface Order {
  id: string;
  product_id: string | null;
  product_title: string;
  product_price: number;
  quantity: number;
  full_name: string;
  phone: string;
  address: string;
  status: OrderStatus;
  created_at: string;
}

export interface TrackedOrder {
  order_number: string;
  product_title: string;
  quantity: number;
  status: OrderStatus;
  created_at: string;
}

export interface OrderConfirmation {
  id: string;
  product_title: string;
  product_price: number;
  quantity: number;
  full_name: string;
  phone: string;
  address: string;
  status: OrderStatus;
  created_at: string;
}

export interface Activation {
  id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
}

export interface ActivationAttempt {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Message {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

export interface Settings {
  id: number;
  discount_text: string;
  pdf_url: string | null;
  playstore_url: string | null;
  updated_at: string;
}
