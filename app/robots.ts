import type {MetadataRoute} from 'next';

/**
 * Robots.txt configuration
 *
 * Strategy:
 * - Allow crawling of all content by default
 * - Block transactional/utility pages that shouldn't be indexed
 * - Block filtered/parameterized URLs to prevent crawl waste
 * - Use meta robots noindex for fine-grained control (not robots.txt)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/api/sitemap.xml' // Allow sitemap index
        ],
        disallow: [
          // Transactional pages (should not be indexed)
          '/more-info',
          '/order-now',
          '/checkout',
          '/request-quote',
          '/wishlist',

          // Search and filtered URLs (prevent crawl waste)
          '/search-results',

          // API and internal paths (except sitemap)
          '/api/',
          '/_next/',

          // Prevent crawling of parameterized URLs
          '/*?*'
        ]
      },
      {
        // Block AI training crawlers (optional - preserves content value)
        userAgent: 'GPTBot',
        disallow: ['/']
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/']
      },
      {
        userAgent: 'CCBot',
        disallow: ['/']
      }
    ],
    sitemap: 'https://printsyou.com/api/sitemap.xml'
  };
}
