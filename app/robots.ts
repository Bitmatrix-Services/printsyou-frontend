import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/more-info', 'https://api.printsyou.com']
    },
    sitemap: 'https://printsyou.com/api/sitemap.xml'
  };
}
