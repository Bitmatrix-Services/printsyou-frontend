export async function GET() {
  const sitemap = await buildSitemap();
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}

async function buildSitemap() {
  const feUrl = process.env.FE_URL;
  const sitemaps = ['about-us', 'contact-us', 'how-to-order', 'terms-and-conditions'];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const sitemapURL of sitemaps) {
    xml += '<sitemap>';
    xml += `<loc>${feUrl}${sitemapURL}</loc>`;
    xml += `<lastModified>${new Date().toISOString()}</lastModified>`;
    xml += `<changeFrequency>weekly</changeFrequency>`;
    xml += `<priority>0.5</priority>`;
    xml += '</sitemap>';
  }
  xml += '</sitemapindex>';
  return xml;
}
