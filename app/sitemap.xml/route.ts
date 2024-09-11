import {getSitemapStuff} from '@utils/utils';

export async function GET() {
  const feUrl = process.env.FE_URL;

  const productChunks: number = await getSitemapStuff('product-chunks');

  let map: string = '';
  Array.from({length: productChunks}).forEach((_, index) => {
    map += `<sitemap><loc>${feUrl}sitemap_products.xml/${index}</loc></sitemap>`;
  });

  const sitemap = `<sitemapindex
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
            <loc>${feUrl}sitemap_blogs.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${feUrl}sitemap_categories.xml</loc>
        </sitemap>
        ${map}
        <sitemap>
            <loc>${feUrl}sitemap_static.xml</loc>
        </sitemap>
    </sitemapindex>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
