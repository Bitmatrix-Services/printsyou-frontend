import React, {FC} from 'react';
import {useRouter} from 'next/router';
import {Product} from '@store/slices/product/product';
import PaginationHeader from '@components/globals/PaginationHeader';
import {FeaturedProductCard} from '@components/cards/FeaturedProductCard';
import {ChevronRightIcon} from '@heroicons/react/24/outline';
import {HomeIcon} from '@heroicons/react/24/solid';
import Link from 'next/link';
import {CircularLoader} from "@components/globals/CircularLoader";

interface CategoryDetailsSectionProps {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  isLoading: boolean;
  isPageLoading: boolean;
}

const SearchResultsSection: FC<CategoryDetailsSectionProps> = ({
  products,
  totalPages,
  isLoading,
  totalProducts,
  isPageLoading
}) => {
  const router = useRouter();
  const {filter, size, page, keywords, tag}: any = router.query;

  const handleQueryUpdate = (value: string | number, queryName: string) => {
    let updatedQuery = {...router.query, [queryName]: value};
    router.push({
      pathname: router.pathname,
      query: updatedQuery
    });
  };

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 items-center promo-products">
        <div className="mb-6">
          <div className="flex text-sm font-medium mt-6 items-center">
            <Link href={'/'}>
              <HomeIcon className="h-4 w-4 mr-1 text-primary" />
            </Link>
            <ChevronRightIcon className="h-3 w-3 mr-1" />
            Search Results
          </div>
        </div>
        <div className="flex justify-between flex-col md:flex-row">
          <div className="text-[#000] font-extralight text-xl leading-[22px] mb-3 ">
            {(keywords || tag) && (
              <span>
                {' '}
                Search Results for{' '}
                <span>
                  "
                  <span className="text-[#4598ff] underline">
                    {keywords
                      ? keywords
                      : tag === 'newAndExclusive'
                      ? 'New and Exclusive'
                      : 'Most Popular'}
                  </span>
                  "
                </span>
              </span>
            )}
          </div>
          <div className="text-[#000] font-light text-xs  mb-3">
            Displaying{' '}
            <span className="font-semibold">
              {(page - 1) * size + 1} - {Math.min(page * size, totalProducts)}
            </span>{' '}
            of <span className="font-semibold">{totalProducts}</span> results
            for <span className="font-semibold"> {router.query.keywords}</span>
          </div>
        </div>

        <section className="bg-white py-8 lg:py-12">
          {products.length > 0 && !isPageLoading && (
            <PaginationHeader
              pageNumber={parseInt(page) || 1}
              setPageNumber={(value: string | number) =>
                handleQueryUpdate(value, 'page')
              }
              pageSize={size || 24}
              setPageSize={(value: string | number) =>
                handleQueryUpdate(value, 'size')
              }
              totalPages={totalPages}
              sort={filter || 'priceLowToHigh'}
              setSort={(value: string | number) =>
                handleQueryUpdate(value, 'filter')
              }
            />
          )}

          <div>
            {isLoading ? (
              <div className="flex justify-center align-middle items-center h-[20rem]">
                <CircularLoader/>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {products?.map(product => (
                  <FeaturedProductCard
                    key={product.id}
                    isModal={true}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
          {products.length > 0 && !isPageLoading && (
            <PaginationHeader
              pageNumber={parseInt(page) || 1}
              setPageNumber={(value: string | number) =>
                handleQueryUpdate(value, 'page')
              }
              pageSize={size || 24}
              setPageSize={(value: string | number) =>
                handleQueryUpdate(value, 'size')
              }
              totalPages={totalPages}
              sort={filter || 'priceLowToHigh'}
              setSort={(value: string | number) =>
                handleQueryUpdate(value, 'filter')
              }
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

export default SearchResultsSection;
