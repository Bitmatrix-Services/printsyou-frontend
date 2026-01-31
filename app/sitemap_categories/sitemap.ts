import type {MetadataRoute} from 'next';
import {getSitemapStuff} from '@utils/utils';

const feUrl = process.env.FE_URL;

// Force dynamic generation - don't cache at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ISitemapCategories {
  loc: string;
  lastModified?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories: ISitemapCategories[] = await getSitemapStuff('category');

  if (!categories || categories.length === 0) {
    return [];
  }

  return categories
    .filter(category => category.loc && category.loc.trim() !== '')
    .map(category => ({
      url: `${feUrl}categories/${category.loc}`,
      lastModified: category.lastModified ? new Date(category.lastModified) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }));
}
