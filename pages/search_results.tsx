import React, {useState, useEffect} from 'react';
import Container from '@components/globals/Container';
import {http} from 'services/axios.service';
import SearchSidebar from '@components/globals/SearchSidebar';
import SearchResultsSection from '@components/sections/searchResults/SearchResultsSection';
import {useRouter} from 'next/router';
import {Product} from '@store/slices/product/product';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';

type searchType = {
  name: string;
  count: number;
};

type categoryType = {
  name: string;
  uCategoryName: string;
  count: number;
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
    handleSearch();
  }, [router.query]);

  const handleSearch = async () => {
    setIsLoading(true);
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
            />
            <SearchResultsSection
              products={searchResultsData.products}
              totalProducts={searchResultsData.totalProducts}
              totalPages={searchResultsData.totalPages}
              isLoading={isLoading}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

export default CategoryDetails;
