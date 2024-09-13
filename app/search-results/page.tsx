import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';
import {SearchResult} from '@components/search-result.components';
import dynamic from 'next/dynamic';

const SearchResultPage = () => {
  return <SearchResult />;
};

const NoSSRSearchResultPage = dynamic(() => Promise.resolve(SearchResultPage), {
  ssr: false
});

export default NoSSRSearchResultPage;

export const metadata: Metadata = {
  title: `Search | ${metaConstants.SITE_NAME}`,
  description: `Find the perfect promotional products tailored to your needs. Explore a wide range of options from your search results to elevate your brand's marketing and outreach efforts.`,
  alternates: {
    canonical: `${process.env.FE_URL}search-results`
  }
};
