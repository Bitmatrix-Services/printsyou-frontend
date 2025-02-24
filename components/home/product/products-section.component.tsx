import React, {FC, useEffect, useState} from 'react';
import {notFound, usePathname, useRouter, useSearchParams} from 'next/navigation';
import PaginationHeader from '@components/globals/pagination-header';
import {EnclosureProduct} from '@components/home/product/product.types';
import {IQueryParams} from '@components/search/search-results-section';
import {ProductCard} from '@components/home/product/product-card.component';
import {Category} from '@components/home/home.types';
import {Skeleton} from '@mui/joy';
import {allowableSearchParams} from '@utils/constants';

interface ProductsSectionProps {
  category: Category;
  pagedData: any;
}

export const ProductsSection: FC<ProductsSectionProps> = ({category, pagedData}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [productsByCategory, setProductsByCategory] = useState<EnclosureProduct[]>([]);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  const {page, filter, size}: IQueryParams = Object.fromEntries(
    ['page', 'filter', 'size'].map(param => [param, searchParams.get(param)])
  );

  useEffect(() => {
    if (pagedData.content.length > 0) {
      setProductsByCategory(pagedData.content);
      setTotalPages(pagedData.totalPages);
      if (page && parseInt(page) > pagedData.totalPages) notFound();
    }
    setIsPageLoading(false);
    setIsLoading(false);
  }, [pagedData]);

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
    <section className="bg-white pt-8 md:pt-10">
      {category.categoryName ? (
        <h2 className="text-xl mb-0 font-bold capitalize">
          {category.prefix && <span>{category.prefix}</span>}
          {category.categoryName} Products
          {category.suffix && <span>{category.suffix}</span>}
        </h2>
      ) : null}
      {productsByCategory?.length > 0 && !isPageLoading && (
        <PaginationHeader
          pageNumber={(page && parseInt(page)) || 1}
          setPageNumber={(value: string | number) => handleQueryUpdate(value, 'page')}
          pageSize={(size && parseInt(size)) || 24}
          setPageSize={(value: string | number) => handleQueryUpdate(value, 'size')}
          totalPages={totalPages}
          sort={filter || 'priceLowToHigh'}
          setSort={(value: string) => handleQueryUpdate(value, 'filter')}
        />
      )}

      <div
        id="product-card-container"
        className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4 md:gap-6 lg:gap-6"
      >
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
          : productsByCategory?.map((product, index) => (
              <ProductCard key={product.id} product={product} imagePriority={index < 4} />
            ))}
      </div>

      {productsByCategory?.length > 0 && !isPageLoading && (
        <PaginationHeader
          pageNumber={(page && parseInt(page)) || 1}
          setPageNumber={(value: string | number) => handleQueryUpdate(value, 'page')}
          pageSize={(size && parseInt(size)) || 24}
          setPageSize={(value: string | number) => handleQueryUpdate(value, 'size')}
          totalPages={totalPages}
          sort={filter || 'priceLowToHigh'}
          setSort={(value: string) => handleQueryUpdate(value, 'filter')}
        />
      )}

      {productsByCategory.length <= 0 && !isLoading && (
        <div className="m-16 flex items-center justify-center">
          <h4>No Products Found</h4>
        </div>
      )}
    </section>
  );
};
