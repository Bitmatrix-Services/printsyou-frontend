import type {MetadataRoute} from 'next';
import {getSitemapStuff} from '@utils/utils';
import {buildCategoryUrlBySlug, UrlFormat} from '@utils/url-builder';

const feUrl = process.env.FE_URL?.endsWith('/') ? process.env.FE_URL.slice(0, -1) : process.env.FE_URL;

// Force dynamic generation - don't cache at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ISitemapCategories {
  loc: string;
  lastModified?: string;
  urlFormat?: UrlFormat;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories: ISitemapCategories[] = await getSitemapStuff('category');

  if (!categories || categories.length === 0) {
    return [];
  }

  return categories
    .filter(category => category.loc && category.loc.trim() !== '')
    .map(category => {
      // Use URL builder to respect LEGACY/CLEAN format
      const urlPath = buildCategoryUrlBySlug(category.loc, category.urlFormat);
      return {
        url: `${feUrl}${urlPath}`,
        lastModified: category.lastModified ? new Date(category.lastModified) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7
      };
    });
}
