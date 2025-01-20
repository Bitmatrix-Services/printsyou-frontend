import React, {FC, useEffect, useState} from 'react';
import {notFound, usePathname, useRouter, useSearchParams} from 'next/navigation';
import axios from 'axios';
import PaginationHeader from '@components/globals/pagination-header';
import {EnclosureProduct} from '@components/home/product/product.types';
import {ProductRoutes} from '@utils/routes/be-routes';
import {IQueryParams} from '@components/search/search-results-section';
import {ProductCard} from '@components/home/product/product-card.component';
import {Category} from '@components/home/home.types';
import {Skeleton} from '@mui/joy';
import Head from 'next/head';
import {allowableSearchParams} from '@utils/constants';

interface ProductsSectionProps {
  category: Category;
}

export const ProductsSection: FC<ProductsSectionProps> = ({category}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
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
    <section className="bg-white pt-8 md:pt-10 lg:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          })
        }}
      />
      {page && (
        <Head>
          <meta name="robots" content="noindex,nofollow,noodp,noydir" />
        </Head>
      )}
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

      <div
        id="product-card-container"
        className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-4 md:gap-6 lg:gap-6"
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
          : productsByCategory?.map(product => <ProductCard key={product.id} product={product} />)}
      </div>

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
