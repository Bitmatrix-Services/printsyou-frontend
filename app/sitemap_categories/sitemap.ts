import type {MetadataRoute} from 'next';
import {getSitemapStuff} from '@utils/utils';

const feUrl = process.env.FE_URL;

interface ISitemapCategories {
  loc: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories: ISitemapCategories[] = await getSitemapStuff('category');
  return categories?.map(category => {
    return {
      url: `${feUrl}categories/${category.loc}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    };
  });
}
