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
  }
};

export default nextConfig;
