import React, {FC, useEffect, useState} from 'react';
import {notFound, usePathname, useRouter, useSearchParams} from 'next/navigation';
import axios from 'axios';
import PaginationHeader from '@components/globals/pagination-header';
import {EnclosureProduct} from '@components/home/product/product.types';
import {ProductRoutes} from '@utils/routes/be-routes';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {IQueryParams} from '@components/search/search-results-section';
import {allowableSearchParams} from '@utils/constants';
import {ProductCard} from '@components/home/product/product-card.component';
import {Category} from '@components/home/home.types';
import {scrollIntoProductsView} from '@utils/utils';

interface ProductsSectionProps {
  category: Category;
}

export const ProductsSection: FC<ProductsSectionProps> = ({category}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const [productsByCategory, setProductsByCategory] = useState<EnclosureProduct[]>([]);

  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  const {page, filter, size}: IQueryParams = Object.fromEntries(
    ['page', 'filter', 'size'].map(param => [param, searchParams.get(param)])
  );

  useEffect(() => {
    if (category.id) {
      getProductByCategory();
    }
  }, [category.id, size, filter, page]);

  useEffect(() => {
    scrollIntoProductsView();
  }, [size, filter, page]);

  const getProductByCategory = async () => {
    try {
      setIsLoading(true);
      let query = `${process.env.NEXT_PUBLIC_API_BASE_URL}${ProductRoutes.ProductByCategoryId}/${category.id}?page=${page ?? 1}&size=${size ?? 20}&filter=${filter ?? 'priceLowToHigh'}&minPrice=0&maxPrice=10000`;
      if (maxPrice && minPrice) {
        query += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }
      const {data} = await axios.get(query);

      setTotalElements(data.payload.totalElements);

      if (data.payload.content.length > 0) {
        setProductsByCategory(data.payload.content);
        setTotalPages(data.payload.totalPages);
        if (page && parseInt(page) > data.payload.totalPages) notFound();
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

  useEffect(() => {
    let script = document.getElementById('OfferCatalogue');

    if (!script) {
      script = document.createElement('script');
      script.id = 'OfferCatalogue';
      script.setAttribute('type', 'application/ld+json');
    }

    script.innerHTML = JSON.stringify({
      '@context': 'http://schema.org',
      '@type': 'WebPage',
      url: `${process.env.NEXT_PUBLIC_FE_URL}${category.uniqueCategoryName}`,
      mainEntity: {
        '@context': 'http://schema.org',
        '@type': 'OfferCatalog',
        name: category.categoryName,
        url: `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}`,
        numberOfItems: totalElements,
        itemListElement: (productsByCategory ?? []).map(product => ({
          '@type': 'Product',
          url: `${process.env.NEXT_PUBLIC_FE_URL}products/${product.uniqueProductName}`,
          name: product.productName,
          image: product.imageUrl,
          offers: {
            price: [...(product.priceGrids ?? [])].sort((a, b) => a.price - b.price).shift()?.price,
            priceCurrency: 'USD',
            availability: 'http://schema.org/InStock',
            itemCondition: 'NewCondition'
          }
        }))
      }
    });
    document.head.appendChild(script);
  }, [productsByCategory, category.uniqueCategoryName, totalElements]);

  return (
    <section className="bg-white pt-8 md:pt-10 lg:pt-16">
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
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-4 md:gap-6 lg:gap-6">
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
