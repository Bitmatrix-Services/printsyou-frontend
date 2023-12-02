import React, {useState, useEffect} from 'react';
import Container from '@components/globals/Container';
import {http} from 'services/axios.service';
import SearchSidebar from '@components/globals/SearchSidebar';
import SearchResultsSection from '@components/sections/searchResults/SearchResultsSection';
import {useRouter} from 'next/router';
import {Product} from '@store/slices/product/product';
import {getMinMaxRange} from '@utils/utils';
import {NextSeo} from "next-seo";
import {metaConstants} from "@utils/Constants";

type searchType = {
  name: string;
  count: number;
};

type categoryType = {
  name: string;
  uCategoryName: string;
  count: number;
};

type filterType = {
  color: string[];
  price: string[];
  category: categoryType;
};

type searchResultsData = {
  products: Product[];
  totalPages: number;
  totalProducts: number;
  byPriceRange: searchType[];
  byColors: searchType[];
  byCategory: categoryType[];
};

const CategoryDetails = () => {
  const router = useRouter();

  const [filters, setFilters] = useState<filterType>({
    color: [],
    price: [],
    category: {
      name: '',
      uCategoryName: '',
      count: 0
    }
  });

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [sort, setSort] = useState<string>('priceLowToHigh');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResultsData, setSearchResultsData] = useState<searchResultsData>(
    {
      products: [],
      totalPages: 0,
      totalProducts: 0,
      byPriceRange: [],
      byColors: [],
      byCategory: []
    }
  );

  useEffect(() => {
    if (router.query.keywords) handleSearch();
  }, [
    pageNumber,
    pageSize,
    sort,
    router.query.keywords,
    filters,
    filters.category.name
  ]);

  const handleSearch = async () => {
    setIsLoading(true);
    let queryString = `search-result?query=${router.query.keywords}&page=${pageNumber}&size=${pageSize}&filter=${sort}`;

    if (filters.color && filters.color.length > 0) {
      queryString += `&colors=${filters.color.join(',')}`;
    }
    if (filters.category.name) {
      queryString += `&category=${filters.category.uCategoryName}`;
    }

    if (filters.price && filters.price.length > 0) {
      const result = getMinMaxRange(filters.price);
      if (result.length) {
        let max = Number.NEGATIVE_INFINITY;
        let min = Number.POSITIVE_INFINITY;
        result.forEach(item => {
          max = Math.max(max, item.maxValue);
          min = Math.min(min, item.minValue);
        });
        queryString += `&minPrice=${min}&maxPrice=${max}`;
      }
    }

    try {
      const {data} = await http.get(queryString);
      const searchResults = {
        products: data.payload.products.content,
        totalPages: data.payload.products.totalPages,
        totalProducts: data.payload.products.totalElements,
        byPriceRange: data.payload.byPriceRange,
        byColors: data.payload.byColors,
        byCategory: data.payload.byCategory
      };
      setSearchResultsData(searchResults);
    } catch (error) {
      console.log('error.message', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NextSeo title={`Search | ${metaConstants.SITE_NAME}`} />
      <div className="bg-white footer pt-8">
        <Container>
          <div className="flex flex-col md:flex-row gap-3 lg:gap-8">
            <SearchSidebar
              byPriceRange={searchResultsData.byPriceRange}
              byColor={searchResultsData.byColors}
              byCategory={searchResultsData.byCategory}
              filters={filters}
              setFilters={setFilters}
            />
            <SearchResultsSection
              products={searchResultsData.products}
              totalProducts={searchResultsData.totalProducts}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalPages={searchResultsData.totalPages}
              sort={sort}
              setSort={setSort}
              isLoading={isLoading}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

export default CategoryDetails;
