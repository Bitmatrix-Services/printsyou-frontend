/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    DOMAIN_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    ASSETS_SERVER_URL: process.env.NEXT_PUBLIC_ASSETS_SERVER_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY
  },
  images: {
    domains: [
      'www.identity-links.com',
      'media.nextopia.net',
      'identitylinks-assets-test.s3.amazonaws.com'
    ]
  }
};

module.exports = nextConfig;
