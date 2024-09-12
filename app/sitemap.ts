import type {MetadataRoute} from 'next';
import {getSitemapStuff} from '@utils/utils';

const feUrl = process.env.FE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productChunks: number = await getSitemapStuff('product-chunks');

  const productSitemap = Array.from({length: productChunks}).map((_, index) => {
    return {
      url: `${feUrl}sitemap_products.xml/${index}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    };
  });

  const staticSitemap = [
    {
      url: `${feUrl}/sitemap_blogs.xml`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${feUrl}/sitemap_categories.xml`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${feUrl}/sitemap_static.xml`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ];

  return [...productSitemap, ...staticSitemap];
}
