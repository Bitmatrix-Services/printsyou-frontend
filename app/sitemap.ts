import type {MetadataRoute} from 'next';
import {getSitemapStuff} from '@utils/utils';

const feUrl = process.env.FE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap | any> {
  const productChunks: number = await getSitemapStuff('product-chunks');

  const staticUrls = ['sitemap_categories/sitemap.xml', 'sitemap_blogs/sitemap.xml', 'sitemap_static/sitemap.xml'];

  const productSitemap = Array.from({length: productChunks}).map((_, index) => {
    return {
      url: `${feUrl}sitemap_products/sitemap.xml/${index}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    };
  });

  const staticSitemap = staticUrls.map(staticUrl => ({
    url: `${feUrl}${staticUrl}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5
  }));

  return [...productSitemap, ...staticSitemap];
}
