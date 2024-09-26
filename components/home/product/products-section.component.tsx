'use client';
import React, {FC, useEffect, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import axios from 'axios';
import PaginationHeader from '@components/globals/pagination-header';
import {EnclosureProduct} from '@components/home/product/product.types';
import {ProductRoutes} from '@utils/routes/be-routes';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {IQueryParams} from '@components/search/search-results-section';
import {allowableSearchParams} from '@utils/constants';
import {ProductCard} from '@components/home/product/product-card.component';

interface ProductsSectionProps {
  categoryId: string;
  categoryName: string;
  prefix?: string;
  suffix?: string;
}

export const ProductsSection: FC<ProductsSectionProps> = ({categoryId, categoryName, prefix, suffix}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const [productsByCategory, setProductsByCategory] = useState<EnclosureProduct[]>([]);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  const {page, filter, size}: IQueryParams = Object.fromEntries(
    ['page', 'filter', 'size'].map(param => [param, searchParams.get(param)])
  );

  useEffect(() => {
    if (categoryId) getProductByCategory();
  }, [categoryId, size, filter, page]);

  const getProductByCategory = async () => {
    try {
      setIsLoading(true);
      let query = `${process.env.NEXT_PUBLIC_API_BASE_URL}${ProductRoutes.ProductByCategoryId}/${categoryId}?page=${page ?? 1}&size=${size ?? 20}&filter=${filter ?? 'priceLowToHigh'}&minPrice=0&maxPrice=10000`;
      if (maxPrice && minPrice) {
        query += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }
      const {data} = await axios.get(query);

      if (data.payload.content.length > 0) {
        setProductsByCategory(data.payload.content);
        setTotalPages(data.payload.totalPages);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsPageLoading(false);
      setIsLoading(false);
    }
  };
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
    <section className="bg-white pt-8 md:pt-10 lg:pt-16">
      {categoryName ? (
        <h2 className="text-xl mb-0 font-bold capitalize">
          {prefix && <span>{prefix}</span>}
          {categoryName} Products
          {suffix && <span>{suffix}</span>}
        </h2>
      ) : null}
      {productsByCategory?.length > 0 && !isPageLoading && (
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

      {isLoading ? (
        <div className="flex justify-center align-middle items-center h-[20rem]">
          <CircularLoader />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {productsByCategory?.map((product, index) => (
            <ProductCard imagePriority={index < 10} key={product.id} product={product} />
          ))}
        </div>
      )}
      {productsByCategory?.length > 0 && !isPageLoading && (
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

      {productsByCategory.length <= 0 && !isLoading && (
        <div className="m-16 flex items-center justify-center">
          <h4>No Products Found</h4>
        </div>
      )}
    </section>
  );
};
