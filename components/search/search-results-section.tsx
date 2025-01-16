'use client';
import React, {FC} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import PaginationHeader from '@components/globals/pagination-header';
import {SearchProductCard} from '@components/search/search-product-card';
import {EnclosureProduct} from '@components/home/product/product.types';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {LuListFilter} from 'react-icons/lu';
import {setFilterSidebarOpen} from '../../store/slices/cart/cart.slice';
import {useDispatch} from 'react-redux';
import {scrollIntoProductsView} from '@utils/utils';

interface CategoryDetailsSectionProps {
  products: EnclosureProduct[];
  totalProducts: number;
  totalPages: number;
  isLoading: boolean;
  isPageLoading: boolean;
}

export interface IQueryParams {
  keywords?: string;
  page?: string;
  minPrice?: string;
  maxPrice?: string;
  colors?: string;
  category?: string;
  filter?: string;
  size?: string;
  tag?: string;
}

export const SearchResultsSection: FC<CategoryDetailsSectionProps> = ({
  products,
  totalPages,
  isLoading,
  totalProducts,
  isPageLoading
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const {keywords, page, filter, size, tag}: IQueryParams = Object.fromEntries(
    ['keywords', 'page', 'minPrice', 'maxPrice', 'colors', 'category', 'filter', 'size', 'tag'].map(param => [
      param,
      searchParams.get(param)
    ])
  );

  const handleQueryUpdate = (value: string | number, queryName: string) => {
    scrollIntoProductsView();

    const params = new URLSearchParams(searchParams);
    params.set(queryName, value.toString());
    if (queryName === 'size' || queryName === 'filter') {
      params.set('page', '1');
    }
    window.history.pushState(null, '', `${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 items-center">
        <div className="flex justify-between mt-10">
          <div className="flex justify-between flex-col">
            <h1 className="text-[#000] font-normal text-xl leading-[22px] mb-3 ">
              {(keywords || tag) && (
                <span>
                  Search Results for{' '}
                  <span>
                    <q>
                      <span className="text-primary-500">
                        {keywords
                          ? keywords
                          : tag === 'newAndExclusive'
                            ? 'New and Exclusive'
                            : tag === 'featured'
                              ? 'Featured'
                              : tag === 'under1Dollar'
                                ? 'Under $1'
                                : 'Most Popular'}
                      </span>
                    </q>
                  </span>
                </span>
              )}
            </h1>
            <div className="text-[#000] font-light text-xs  mb-3">
              Displaying &nbsp;
              {page && size && totalPages ? (
                <>
                  <span className="font-semibold text-primary-500">
                    {(parseInt(page) - 1) * parseInt(size) + 1} -{' '}
                    {Math.min(parseInt(page) * parseInt(size), totalProducts)}
                  </span>
                  &nbsp; of&nbsp;
                  <span className="font-semibold text-primary-500">{totalProducts}</span>
                </>
              ) : (
                <span className="font-semibold text-primary-500">0</span>
              )}
              &nbsp;results for&nbsp;
              <span className="font-semibold text-primary-500">{keywords}</span>
            </div>
          </div>
          <div className="md:hidden flex justify-between items-center">
            <div
              className="py-2 px-3 flex gap-2 border-2 items-center justify-center border-gray-300 rounded-md w-full capitalize"
              onClick={() => dispatch(setFilterSidebarOpen(true))}
            >
              Filters
              <LuListFilter className="h-5 w-5" />
            </div>
          </div>
        </div>

        <section className="bg-white pb-8 lg:pb-12">
          <div className="hidden lg:block">
            {products.length > 0 && !isPageLoading && (
              <PaginationHeader
                paginationId={'pagination-header-1'}
                pageNumber={(page && parseInt(page)) || 1}
                setPageNumber={(value: number) => handleQueryUpdate(value, 'page')}
                pageSize={(size && parseInt(size)) || 20}
                setPageSize={(value: string | number) => handleQueryUpdate(value, 'size')}
                totalPages={totalPages}
                sort={filter || 'priceLowToHigh'}
                setSort={(value: string) => handleQueryUpdate(value, 'filter')}
              />
            )}
          </div>

          <div>
            {isLoading ? (
              <div className="flex justify-center align-middle items-center h-[20rem]">
                <CircularLoader />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {products?.map(product => <SearchProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
          {products.length > 0 && !isPageLoading && (
            <PaginationHeader
              paginationId={'pagination-header-2'}
              pageNumber={(page && parseInt(page)) || 1}
              setPageNumber={(value: string | number) => handleQueryUpdate(value, 'page')}
              pageSize={(size && parseInt(size)) || 20}
              setPageSize={(value: string | number) => handleQueryUpdate(value, 'size')}
              totalPages={totalPages}
              sort={filter || 'priceLowToHigh'}
              setSort={(value: string) => handleQueryUpdate(value, 'filter')}
            />
          )}
          {products.length <= 0 && !isLoading && (
            <div className="m-16 flex items-center justify-center">
              <h4>No Products Found</h4>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
