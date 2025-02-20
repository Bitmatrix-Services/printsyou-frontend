import {getSitemapStuff} from '@utils/utils';

export async function GET(_: Request) {
  const feUrl = process.env.FE_URL;

  const response: number = await getSitemapStuff('product-chunks');
  let map: string = '';
  Array.from({length: response}).forEach((_, index) => {
    map += `<sitemap><loc>${feUrl}sitemap_products/sitemap/${index}.xml</loc></sitemap>`;
  });

  const sitemap = `<sitemapindex
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
            <loc>${feUrl}sitemap_blogs/sitemap.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${feUrl}sitemap_categories/sitemap.xml</loc>
        </sitemap>
        ${map}
        <sitemap>
            <loc>${feUrl}sitemap_static/sitemap.xml</loc>
        </sitemap>
    </sitemapindex>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400'
    }
  });
}
