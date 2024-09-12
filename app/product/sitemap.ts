import {getSitemapStuff} from '@utils/utils';
import {MetadataRoute} from 'next';

const feUrl = process.env.FE_URL;

interface ISitemapProduct {
  loc: string;
}

export async function generateSitemaps() {
  const productChunks: number = await getSitemapStuff('product-chunks');
  return Array.from({length: productChunks}).map((_, index) => {
    return {
      id: index
    };
  });
}

export default async function sitemap({id}: {id: number}): Promise<MetadataRoute.Sitemap> {
  const products: ISitemapProduct[] = await getSitemapStuff('product', {chunk: id.toString()});

  return products.map(product => ({
    url: `${feUrl}product/${product.loc}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5
  }));
}
