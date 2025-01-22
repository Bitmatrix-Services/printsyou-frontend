import {SearchResult} from '@components/search-result.components';
import {Suspense} from 'react';

const SearchResultPage = () => {
  return (
    <Suspense>
      <SearchResult />
    </Suspense>
  );
};

export default SearchResultPage;

type SearchParams = Promise<any>;

export async function generateMetadata(props: {searchParams: SearchParams}) {
  const searchParams = await props.searchParams;

  const currentPage = parseInt(searchParams.page);
  let canonicalURL: string = `${process.env.FE_URL}search-results`;
  if (currentPage > 1) {
    canonicalURL = `${canonicalURL}?page=${currentPage}`;
  }

  const searchKeyword = searchParams.keywords
    ? searchParams.keywords
    : searchParams.tag === 'newAndExclusive'
      ? 'New and Exclusive'
      : searchParams.tag === 'featured'
        ? 'Just a Buck'
        : searchParams.tag === 'under1Dollar'
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
