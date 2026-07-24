import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ksdprcoizcfisfhvpacm.supabase.co',
        pathname: '/storage/v1/object/public/product-images/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      // Default is 1MB, too small for admin image uploads (cover photo +
      // multi-file gallery uploads both go through Server Actions). Phone
      // camera photos commonly run a few MB each.
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;
