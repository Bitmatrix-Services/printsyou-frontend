const responseHeaders = require('./headers');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.identity-links.com", "media.nextopia.net"],
  },
};

module.exports = nextConfig;
