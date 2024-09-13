'use client';
import React, {FC} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import PaginationHeader from '@components/globals/pagination-header';
import {SearchProductCard} from '@components/search/search-product-card';
import {EnclosureProduct} from '@components/home/product/product.types';
import {allowableSearchParams} from '@utils/constants';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {v4 as uuidv4} from 'uuid';

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
  const {keywords, page, filter, size, tag}: IQueryParams = Object.fromEntries(
    ['keywords', 'page', 'minPrice', 'maxPrice', 'colors', 'category', 'filter', 'size', 'tag'].map(param => [
      param,
      searchParams.get(param)
    ])
  );

  const handleQueryUpdate = (value: string | number, queryName: string) => {
    const currentQuery = getUpdatedQueryParams();
    let updatedQuery = {...currentQuery, [queryName]: value};
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
        <div className="flex justify-between flex-col mt-10">
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
                            ? 'Just a Buck'
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

        <section className="bg-white pb-8 lg:pb-12">
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

          <div>
            {isLoading ? (
              <div className="flex justify-center align-middle items-center h-[20rem]">
                <CircularLoader />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {products?.map(product => <SearchProductCard key={uuidv4()} product={product} />)}
              </div>
            )}
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
