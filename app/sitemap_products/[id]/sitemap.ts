import {getSitemapStuff} from '@utils/utils';
import {MetadataRoute} from 'next';

const feUrl = process.env.FE_URL;

export async function generateSitemaps() {
  const productChunks: number = await getSitemapStuff('product-chunks');
  console.log('productChunks', productChunks);
  return Array.from({length: productChunks}).map((_, index) => {
    return {
      id: index
    };
  });
}

export default async function sitemap({id}: {id: number}): Promise<MetadataRoute.Sitemap> {
  const products = await getSitemapStuff('product', {chunk: id.toString()});

  return products.map(product => ({
    url: `${feUrl}/product/${product.uniqueProductName}`,
    lastModified: product.date,
    changeFrequency: 'monthly',
    priority: 0.5
  }));
}
