import React, {FC, useState} from 'react';
import Container from '@components/globals/Container';
import {GetServerSidePropsContext} from 'next';
import {http} from 'services/axios.service';
import SearchSidebar from '@components/globals/SearchSidebar';
import SearchResultsSection from '@components/sections/searchResults/SearchResultsSection';
import {Product} from '@store/slices/product/product';

type searchType = {
  name: string;
  count: number;
};

type filterType = {
  color: string[];
  price: string[];
};

type searchResults = {
  byCategory: searchType[];
  byColors: searchType[];
  byPriceRange: searchType[];
  products: any;
};

interface CategoryDetailsProps {
  searchResults: searchResults;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({searchResults}) => {
  const [filters, setFilters] = useState<filterType>({
    color: [],
    price: []
  });

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sort, setSort] = useState<string>('priceLowToHigh');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <main>
      <div className="bg-white footer pt-8">
        <Container>
          <div className="flex flex-col md:flex-row gap-3 lg:gap-8">
            <SearchSidebar
              byPriceRange={searchResults.byPriceRange}
              byColor={searchResults.byColors}
              byCategory={searchResults.byCategory}
              filters={filters}
              setFilters={setFilters}
            />
            <SearchResultsSection
              products={searchResults.products.content}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalPages={totalPages}
              sort={sort}
              setSort={setSort}
              isLoading={isLoading}
            />
          </div>
        </Container>
      </div>
    </main>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const keywords = context.query?.keywords;

  let searchResults: any = {};
  try {
    const {data} = await http.get(`search-result?query=${keywords}`);
    searchResults = data.payload;
  } catch (error) {
    console.log('error.message', error);
  }

  return {
    props: {
      searchResults: {
        byCategory: searchResults.byCategory ?? [],
        byColors: searchResults.byColor ?? [],
        byPriceRange: searchResults.byPriceRange ?? [],
        products: searchResults.products
      }
    }
  };
};

export default CategoryDetails;
