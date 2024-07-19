import {GetServerSidePropsContext, NextPage} from 'next';
import {getSitemapStuff} from '@utils/utils';

const SiteMap: NextPage = () => {
  return null;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {res} = context;
  const feUrl = process.env.FE_URL;

  const response: number = await getSitemapStuff('product-chunks');
  let map: string = '';
  Array.from({length: response}).forEach((_, index) => {
    map += `<sitemap><loc>${feUrl}sitemap_products.xml?chunk=${index}</loc></sitemap>`;
  });

  const sitemap = `<sitemapindex
        xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
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

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=86400'
  );
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
}

export default SiteMap;
