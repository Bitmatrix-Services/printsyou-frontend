'use client';
import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import axios from 'axios';
import {SearchResultsSection} from '@components/search/search-results-section';
import {CategoryType, SearchSidebar} from '@components/search/search-sidebar.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {EnclosureProduct} from '@components/home/product/product.types';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {DialogContent, Drawer} from '@mui/joy';
import {selectFilterSidebarOpen, setFilterSidebarOpen} from '../store/slices/cart/cart.slice';
import {IoClose} from 'react-icons/io5';
import {useAppDispatch, useAppSelector} from '../store/hooks';

type SearchType = {
  name: string;
  count: number;
};

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

export const SearchResult = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const {keywords, page, minPrice, maxPrice, colors, category, filter, size, tag} = Object.fromEntries(
    ['keywords', 'page', 'minPrice', 'maxPrice', 'colors', 'category', 'filter', 'size', 'tag'].map(param => [
      param,
      searchParams.get(param)
    ])
  );

  const isFilterSidebarOpen = useAppSelector(selectFilterSidebarOpen);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterType>({
    price: []
  });
  const [updatedSearchResults, setUpdatedSearchResults] = useState<SearchEnclosure>({
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
  }, [searchParams]);
  //
  // useEffectOnce(() => {
  //   window.scrollTo(0, 0);
  // });

  const handleSearch = async () => {
    let queryString = `${process.env.NEXT_PUBLIC_API_BASE_URL}/updated-search?`;

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
      const {data} = await axios.get(queryString);
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
    <div className="bg-white footer pt-8">
      <Breadcrumb list={[]} prefixTitle="Search Result" />
      <div className="w-full max-w-[120rem] mx-auto px-3 md:px-[3rem] tablet:px-[4rem] lg:px-[4rem] xl:px-[8rem] 2xl:px-[10rem] relative">
        <div className="flex flex-col md:flex-row gap-3 lg:gap-8">
          {isPageLoading ? (
            <div className="flex justify-center align-middle items-center h-[20rem] w-[100%]">
              <CircularLoader />
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <SearchSidebar
                  byPriceRange={updatedSearchResults.byPrice}
                  byColor={updatedSearchResults.byColors}
                  byCategory={updatedSearchResults.byCategory}
                  filters={filters}
                  setFilters={setFilters}
                />
              </div>
              <SearchResultsSection
                products={updatedSearchResults.products}
                totalProducts={updatedSearchResults.totalElements}
                totalPages={updatedSearchResults.totalPages}
                isLoading={isLoading}
                isPageLoading={isPageLoading}
              />
              <div className="md:hidden block">
                <Drawer
                  anchor="left"
                  open={isFilterSidebarOpen}
                  onClose={() => dispatch(setFilterSidebarOpen(false))}
                  size="sm"
                >
                  <div className="p-3">
                    <IoClose className="h-7 w-7" onClick={() => dispatch(setFilterSidebarOpen(false))} />
                    <DialogContent>
                      <SearchSidebar
                        byPriceRange={updatedSearchResults.byPrice}
                        byColor={updatedSearchResults.byColors}
                        byCategory={updatedSearchResults.byCategory}
                        filters={filters}
                        setFilters={setFilters}
                        isMobileMenu={true}
                      />
                    </DialogContent>
                  </div>
                </Drawer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
