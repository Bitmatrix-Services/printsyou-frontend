import {getSitemapStuff} from '../../../utils/utils';

export async function GET(request, {params}) {
  if (!params?.id) {
    return {notFound: true};
  }
  const sitemap = (await getSitemapStuff('product', {chunk: params.id})).xml;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
