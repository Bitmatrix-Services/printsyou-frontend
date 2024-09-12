'use client';
import {getSitemapStuff} from '../../utils/utils';

export async function GET() {
  const sitemap = (await getSitemapStuff('category')).xml;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
