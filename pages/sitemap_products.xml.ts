import {GetServerSidePropsContext, NextPage} from 'next';
import {getSitemapStuff} from '@utils/utils';

const SiteMap: NextPage = () => {
  return null;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {res, query} = context;
  const chunk = query.chunk as string;

  const sitemap = (await getSitemapStuff('product', {chunk: chunk})).xml;

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
