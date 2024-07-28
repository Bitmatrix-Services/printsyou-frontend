import React, {useEffect, useState} from 'react';
import Container from '@components/globals/Container';
import {http} from 'services/axios.service';
import SearchSidebar, {CategoryType} from '@components/globals/SearchSidebar';
import SearchResultsSection from '@components/sections/searchResults/SearchResultsSection';
import {useRouter} from 'next/router';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';
import {CircularLoader} from '@components/globals/CircularLoader';

type SearchType = {
  name: string;
  count: number;
};

interface EnclosureProduct {
  productId: string;
  productName: string;
  minPrice: number;
  maxPrice: number;
  priorityOrder: number;
  uniqueProductName: string;
  imageUrl: string;
}

interface SearchEnclosure {
  products: EnclosureProduct[];
  byPrice: SearchType[];
  byColors: SearchType[];
  totalElements: number;
  size: number;
  pageNumber: number;
  totalPages: number;
  byCategory: CategoryType[];
}

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
  const [updatedSearchResults, setUpdatedSearchResults] =
    useState<SearchEnclosure>({
      products: [],
      byColors: [],
      byPrice: [],
      totalPages: 0,
      size: 0,
      pageNumber: 0,
      totalElements: 0,
      byCategory: []
    });

  useEffect(() => {
    if (keywords || tag) handleSearch();
  }, [router.query]);

  const handleSearch = async () => {
    let queryString = `updated-search?`;

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
      setUpdatedSearchResults({
        products: data.payload.products,
        totalPages: data.payload.totalPages,
        totalElements: data.payload.totalElements,
        byPrice: data.payload.byPrice,
        size: data.payload.size,
        pageNumber: data.payload.pageNumber,
        byColors: data.payload.byColors,
        byCategory: data.payload.byCategory
      });
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
                  byPriceRange={updatedSearchResults.byPrice}
                  byColor={updatedSearchResults.byColors}
                  byCategory={updatedSearchResults.byCategory}
                  filters={filters}
                  setFilters={setFilters}
                />
                <SearchResultsSection
                  products={updatedSearchResults.products}
                  totalProducts={updatedSearchResults.totalElements}
                  totalPages={updatedSearchResults.totalPages}
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
