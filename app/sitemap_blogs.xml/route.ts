import {getSitemapStuff} from '@utils/utils';

export async function GET() {
  const sitemap = (await getSitemapStuff('blog')).xml;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
