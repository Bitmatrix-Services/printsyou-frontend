'use client';
import React, {FC} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import PaginationHeader from '@components/globals/pagination-header';
import {EnclosureProduct} from '@components/home/product/product.types';
import {LuListFilter} from 'react-icons/lu';
import {setFilterSidebarOpen} from '../../store/slices/cart/cart.slice';
import {useDispatch} from 'react-redux';
import {Skeleton} from '@mui/joy';
import {SearchProductCard} from '@components/search/search-product-card';
import {allowableSearchParams} from '@utils/constants';

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
  const router = useRouter();
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
    const currentQuery = getUpdatedQueryParams();
    let updatedQuery = {...currentQuery, [queryName]: value};
    if (queryName === 'size' || queryName === 'filter') {
      updatedQuery.page = '1';
    }
    router.push(`${pathname}?${new URLSearchParams(updatedQuery)}`);
  };

  const getUpdatedQueryParams = (): Record<string, any> => {
    let updatedQuery: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      if (~allowableSearchParams.indexOf(key)) {
        updatedQuery[key] = value;
      }
    });
    return updatedQuery;
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

          <div id="product-card-container" className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {isLoading
              ? Array.from({length: 12}, (_, index) => (
                  <div key={index} className="relative mt-10">
                    <Skeleton
                      sx={{borderRadius: '1rem'}}
                      animation="pulse"
                      variant={'rectangular'}
                      height={'200px'}
                      width={'100%'}
                    />
                  </div>
                ))
              : products?.map(product => <SearchProductCard key={product.id} product={product} />)}
          </div>

          {products.length > 0 && !isPageLoading && (
            <PaginationHeader
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
