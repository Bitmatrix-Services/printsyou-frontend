import {getSitemapStuff} from '@utils/utils';
import {MetadataRoute} from 'next';

const feUrl = process.env.FE_URL;
const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL;

interface ISitemapProduct {
  loc: string;
  lastModified?: string;
  image?: string | null;
  caption?: string | null;
}

export async function generateSitemaps() {
  const productChunks: number = await getSitemapStuff('product-chunks');
  // Ensure at least one sitemap even if no products
  const chunks = Math.max(1, productChunks);
  return Array.from({length: chunks}).map((_, index) => ({
    id: index
  }));
}

export default async function sitemap({id}: {id: number}): Promise<MetadataRoute.Sitemap> {
  const products: ISitemapProduct[] = await getSitemapStuff('product', {chunk: id.toString()});

  if (!products || products.length === 0) {
    return [];
  }

  return products
    .filter(product => product.loc && product.loc.trim() !== '')
    .map(product => {
      // Build clean image URL without query string encoding issues
      const imageUrl = product.image && assetsUrl
        ? `${assetsUrl}${product.image.replace(/\?.*$/, '')}`
        : undefined;

      return {
        url: `${feUrl}products/${product.loc}`,
        lastModified: product.lastModified ? new Date(product.lastModified) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        images: imageUrl ? [imageUrl] : []
      };
    });
}
