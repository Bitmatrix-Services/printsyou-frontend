import {SearchResult} from '@components/search-result.components';
import dynamic from 'next/dynamic';

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

  const searchKeyword = queryParams.searchParams.keywords
    ? queryParams.searchParams.keywords
    : queryParams.searchParams.tag === 'newAndExclusive'
      ? 'New and Exclusive'
      : queryParams.searchParams.tag === 'featured'
        ? 'Just a Buck'
        : queryParams.searchParams.tag === 'under1Dollar'
          ? 'Under $1'
          : 'Most Popular';

  return {
    title: `Search for ${searchKeyword} showing page ${currentPage} - PrintsYou`,
    description: `Find the perfect promotional products tailored to your needs. Explore a wide range of options from your search results to elevate your brand's marketing and outreach efforts.`,
    robots: {
      index: false,
      follow: false
    },
    alternates: {
      canonical: canonicalURL
    }
  };
}
