import type {MetadataRoute} from 'next';

const feUrl = process.env.FE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap | any> {
  const sitemaps = ['about-us', 'contact-us', 'how-to-order', 'terms-and-conditions'];
  return sitemaps.map(url => {
    return {
      url: `${feUrl}${url}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    };
  });
}
