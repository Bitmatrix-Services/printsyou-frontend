/** @type {import('next').NextConfig} */

import responseHeaders from './headers.js';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: responseHeaders
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'printsyouassets.s3.amazonaws.com'
      }
    ]
  },
  rewrites: () => [
    {
      source: '/ingest/static/:path*',
      destination: 'https://us-assets.i.posthog.com/static/:path*'
    },
    {
      source: '/ingest/:path*',
      destination: 'https://us.i.posthog.com/:path*'
    },
    {
      source: '/ingest/decide',
      destination: 'https://us.i.posthog.com/decide'
    }
  ]
};

export default nextConfig;
