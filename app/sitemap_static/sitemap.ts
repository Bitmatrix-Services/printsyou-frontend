import type {MetadataRoute} from 'next';

const feUrl = process.env.FE_URL;

// Static pages with their priorities (higher = more important)
const staticPages = [
  {path: '', priority: 1.0, changeFreq: 'daily'}, // Homepage
  {path: 'categories', priority: 0.9, changeFreq: 'daily'}, // Categories listing
  {path: 'about-us', priority: 0.6, changeFreq: 'monthly'},
  {path: 'contact-us', priority: 0.7, changeFreq: 'monthly'},
  {path: 'how-to-order', priority: 0.6, changeFreq: 'monthly'},
  {path: 'terms-and-conditions', priority: 0.3, changeFreq: 'yearly'},
  {path: '3pl', priority: 0.5, changeFreq: 'monthly'}
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return staticPages.map(page => ({
    url: `${feUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFreq,
    priority: page.priority
  }));
}
