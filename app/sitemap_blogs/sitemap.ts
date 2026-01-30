import type {MetadataRoute} from 'next';
import {getSitemapStuff} from '@utils/utils';

const feUrl = process.env.FE_URL;

interface ISitemapBlogs {
  loc: string;
  lastModified?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs: ISitemapBlogs[] = await getSitemapStuff('blog');

  if (!blogs || blogs.length === 0) {
    return [];
  }

  return blogs.map(blog => ({
    url: `${feUrl}blog/${blog.loc}`,
    lastModified: blog.lastModified ? new Date(blog.lastModified) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6
  }));
}
