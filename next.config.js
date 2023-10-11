/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'www.identity-links.com',
      'media.nextopia.net',
      'identitylinks-assets-test.s3.amazonaws.com'
    ]
  }
};

module.exports = nextConfig;
