import {GetServerSidePropsContext, NextPage} from 'next';

const SiteMap: NextPage = () => {
  return null;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {res} = context;

  const sitemap = await (await fetch(`${process.env.FE_URL}/sitemap_pages.xml`)).text();

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400');
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
}

export default SiteMap;
