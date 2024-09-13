'use client';
import React, {FC, useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import axios from 'axios';
import PaginationHeader from '@components/globals/pagination-header';
import {ProductCard} from '@components/home/product/product-card.component';
import {Product} from '@components/home/product/product.types';
import {Container} from '@components/globals/container.component';
import {ProductRoutes} from '@utils/routes/be-routes';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {v4 as uuidv4} from 'uuid';

interface ProductsSectionProps {
  showModal?: boolean;
  categoryId: string;
  categoryName: string;
  prefix?: string;
  suffix?: string;
}

export const ProductsSection: FC<ProductsSectionProps> = ({showModal, categoryId, categoryName, prefix, suffix}) => {
  const searchParams = useSearchParams();
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const [productsByCategory, setProductsByCategory] = useState<Product[]>([]);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sort, setSort] = useState('priceLowToHigh');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  useEffect(() => {
    if (categoryId) getProductByCategory();
  }, [categoryId, pageSize, sort, minPrice, maxPrice, page]);

  const getProductByCategory = async () => {
    try {
      setIsLoading(true);
      let query = `${process.env.NEXT_PUBLIC_API_BASE_URL}${ProductRoutes.ProductByCategoryId}/${categoryId}?&size=${pageSize}&filter=${sort}&minPrice=0&maxPrice=10000`;
      if (maxPrice && minPrice) {
        query += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }
      if (page) {
        query += `&page=${page}`;
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

  return (
    <Container>
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
            pageNumber={page || 1}
            setPageNumber={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            sort={sort}
            setSort={value => setSort(value)}
          />
        )}

        {isLoading ? (
          <div className="flex justify-center align-middle items-center h-[20rem]">
            <CircularLoader />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {productsByCategory?.map(product => <ProductCard key={uuidv4()} showModal={showModal} product={product} />)}
          </div>
        )}
        {productsByCategory?.length > 0 && !isPageLoading && (
          <PaginationHeader
            pageNumber={page || 1}
            setPageNumber={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            sort={sort}
            setSort={value => setSort(value)}
          />
        )}

        {productsByCategory.length <= 0 && !isLoading && (
          <div className="m-16 flex items-center justify-center">
            <h4>No Products Found</h4>
          </div>
        )}
      </section>
    </Container>
  );
};
