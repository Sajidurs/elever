import type { MetadataRoute } from 'next';
import { getActiveProducts } from '@/lib/data/products';

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elevernotes.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getActiveProducts();

  const staticRoutes = ['', '/about', '/features', '/shop', '/activate', '/contact'].map((path) => ({
    url: `${BASE_URL}${path}`,
  }));

  const productRoutes = products.map((p) => ({
    url: `${BASE_URL}/shop/${p.slug}`,
    lastModified: new Date(p.updated_at),
  }));

  return [...staticRoutes, ...productRoutes];
}
