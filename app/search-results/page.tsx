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
  alternates: {
    canonical: `${process.env.FE_URL}search-results`
  }
};
