import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';
import {SearchResult} from '@components/search-result.components';
import dynamic from 'next/dynamic';
import {getCategoryDetailsByUniqueName} from '@components/home/category/category.apis';
import {Category} from '@components/home/home.types';

const SearchResultPage = () => {
  return <SearchResult />;
};

const NoSSRSearchResultPage = dynamic(() => Promise.resolve(SearchResultPage), {
  ssr: false
});

export default NoSSRSearchResultPage;

export async function generateMetadata(queryParams: {searchParams: any}) {
  const currentPage = parseInt(queryParams.searchParams.page);
  let canonicalURL: string = `${process.env.FE_URL}search-results`;
  if (currentPage > 1) {
    canonicalURL = `${canonicalURL}?page=${currentPage}`;
  }

  return {
    title: `Search for ${queryParams.searchParams.searchQuery} showing page ${currentPage} - PrintsYou`,
    description: `Find the perfect promotional products tailored to your needs. Explore a wide range of options from your search results to elevate your brand's marketing and outreach efforts.`,
    alternates: {
      canonical: canonicalURL
    }
  };
}
