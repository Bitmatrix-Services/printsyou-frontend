import type {MetadataRoute} from 'next';
import {getSitemapStuff} from '@utils/utils';

const feUrl = process.env.FE_URL;

interface ISitemapBlogs {
  loc: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs: ISitemapBlogs[] = await getSitemapStuff('blog');
  return blogs.map(url => {
    return {
      url: `${feUrl}blogs/${url.loc}.xml`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    };
  });
}
