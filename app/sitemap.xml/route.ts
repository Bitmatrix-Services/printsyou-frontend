import {getSitemapStuff} from '@utils/utils';

// Force dynamic generation - don't cache at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_: Request) {
  const feUrl = process.env.FE_URL;
  const today = new Date().toISOString().split('T')[0];

  const response: number = await getSitemapStuff('product-chunks');

  // Generate product sitemap entries with lastmod
  let productSitemaps = '';
  Array.from({length: response}).forEach((_, index) => {
    productSitemaps += `
    <sitemap>
      <loc>${feUrl}sitemap_products/sitemap/${index}.xml</loc>
      <lastmod>${today}</lastmod>
    </sitemap>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${feUrl}sitemap_categories/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>${productSitemaps}
  <sitemap>
    <loc>${feUrl}sitemap_blogs/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${feUrl}sitemap_static/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600'
    }
  });
}
