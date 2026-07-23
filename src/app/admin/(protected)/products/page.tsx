import type { Metadata } from 'next';
import { getAllProductsForAdmin } from '@/lib/data/products';
import { ProductTable } from './ProductTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin — Products', robots: { index: false, follow: false } };

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();
  return <ProductTable products={products} />;
}
