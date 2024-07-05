import React, {useState, useEffect} from 'react';
import Container from '@components/globals/Container';
import {http} from 'services/axios.service';
import SearchSidebar, {CategoryType} from '@components/globals/SearchSidebar';
import SearchResultsSection from '@components/sections/searchResults/SearchResultsSection';
import {useRouter} from 'next/router';
import {Product} from '@store/slices/product/product';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';
import {CircularLoader} from '@components/globals/CircularLoader';

type SearchType = {
  name: string;
  count: number;
};

type SearchResultsData = {
  products: Product[];
  totalPages: number;
  totalProducts: number;
  byPriceRange: SearchType[];
  byColors: SearchType[];
  byCategory: CategoryType[];
};

type FilterType = {
  price: string[];
};

const CategoryDetails = () => {
  const router = useRouter();
  const {
    keywords,
    page,
    minPrice,
    maxPrice,
    colors,
    category,
    filter,
    size,
    tag
  } = router.query;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterType>({
    price: []
  });
  const [searchResultsData, setSearchResultsData] = useState<SearchResultsData>(
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
    if (keywords || tag) handleSearch();
  }, [router.query]);

  const handleSearch = async () => {
    let queryString = `search-result?`;

    if (keywords) {
      queryString += `query=${keywords}&`;
    }

    if (tag) {
      queryString += `tag=${tag}&`;
    }

    if (page) {
      queryString += `page=${page}`;
    }
    if (size) {
      queryString += `&size=${size}`;
    }

    if (filter) {
      queryString += `&filter=${filter}`;
    }

    if (colors && Array.isArray(colors)) {
      queryString += `&colors=${colors.join(',')}`;
    } else if (colors) {
      queryString += `&colors=${colors}`;
    }

    if (category) {
      queryString += `&category=${category}`;
    }

    if (minPrice && maxPrice) {
      queryString += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }

    try {
      setIsLoading(true);
      const {data} = await http.get(queryString);
      const searchResults = {
        products: data.payload.products.content,
        totalPages: data.payload.products.totalPages,
        totalProducts: data.payload.products.totalElements,
        byPriceRange: data.payload.byPriceRange?.filter(
          (item: {name: string}) => item.name !== null
        ),
        byColors: data.payload.byColors,
        byCategory: data.payload.byCategory
      };
      setSearchResultsData(searchResults);
    } catch (error) {
      console.log('error.message', error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  return (
    <>
      <NextSeo title={`Search | ${metaConstants.SITE_NAME}`} />
      <div className="bg-white footer pt-8">
        <Container>
          <div className="flex flex-col md:flex-row gap-3 lg:gap-8">
            {isPageLoading ? (
              <div className="flex justify-center align-middle items-center h-[20rem] w-[100%]">
                <CircularLoader />
              </div>
            ) : (
              <>
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
                  totalPages={searchResultsData.totalPages}
                  isLoading={isLoading}
                  isPageLoading={isPageLoading}
                />
              </>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default CategoryDetails;
