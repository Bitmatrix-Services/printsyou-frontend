'use client';
import React, {FC, useEffect, useState} from 'react';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {Category} from '@components/home/home.types';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import Link from 'next/link';
import {notFound, usePathname, useRouter, useSearchParams} from 'next/navigation';
import CategoriesSidebar from '@components/home/category/categories-sidebar.component';
import {EnclosureProduct} from '@components/home/product/product.types';
import {IQueryParams} from '@components/search/search-results-section';
import {ProductRoutes} from '@utils/routes/be-routes';
import axios from 'axios';
import {allowableSearchParams} from '@utils/constants';
import PaginationHeader from '@components/globals/pagination-header';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {ProductCard} from '@components/home/product/product-card.component';

interface ICategoryDetails {
  allCategories: Category[];
  category: Category | null;
  siblingCategories: Category[];
}

export const CategoryDetails: FC<ICategoryDetails> = ({allCategories, category, siblingCategories}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(prevState => !prevState);
  };

  if (!category) notFound();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const [productsByCategory, setProductsByCategory] = useState<EnclosureProduct[]>([]);

  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    <div>
      <Breadcrumb prefixTitle="Promotional Category" list={category.crumbs ?? []} />
      <div className="w-full max-w-[120rem] mx-auto px-3 md:px-[3rem] tablet:px-[4rem] lg:px-[4rem] xl:px-[8rem] 2xl:px-[10rem] relative">
        <div className="flex flex-col md:flex-row mt-10">
          <div className="hidden lg:block">
            <CategoriesSidebar
              allCategories={allCategories}
              selectedCategory={category}
              siblingCategories={siblingCategories}
            />
          </div>
          <div>
            <section className="bg-secondary-300 bg-opacity-[12%]">
              <div className="md:grid md:grid-cols-12 flex flex-col gap-2 md:gap-6 lg:gap-6 px-8">
                <div className="md:col-span-9 py-9">
                  <h1 className="mb-3 text-black font-semibold text-3xl capitalize">
                    {category.prefix && <span>{category.prefix}</span>}
                    {category.categoryName}
                    {category.suffix && <span>{category.suffix}</span>}
                  </h1>
                  <span
                    className={`text-base font-normal text-mute ${isExpanded ? '' : 'see-less-more'}`}
                    dangerouslySetInnerHTML={{
                      __html: category.categoryDescription
                    }}
                  ></span>
                  <span onClick={handleToggle} className="text-blue-500 text-sm font-medium cursor-pointer">
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </span>
                </div>
                {category?.imageUrl && (
                  <div
                    className={`relative hidden md:block md:col-span-3 ${isExpanded ? 'h-full' : 'max-h-[14rem] my-10'}`}
                  >
                    <ImageWithFallback
                      src={category?.imageUrl}
                      alt={category.uniqueCategoryName}
                      className="object-contain"
                      fill
                    />
                  </div>
                )}
              </div>
            </section>
            {category.subCategories?.length > 0 ? (
              <h3 className="my-6 text-black font-semibold text-3xl capitalize">{category.categoryName} Categories</h3>
            ) : null}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-10">
              {(category.subCategories ?? [])?.map(subCategory => (
                <Link
                  href={`/categories/${subCategory.uniqueCategoryName}?size=20&filter=priceLowToHigh`}
                  className="flex flex-col border p-2"
                  key={subCategory.id}
                >
                  <div className="min-h-56 h-56 max-h-56  relative">
                    <ImageWithFallback
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain md:w-[60%] lg:w-[85%] "
                      fill
                      src={subCategory?.imageUrl}
                      alt={subCategory.categoryName}
                    />
                  </div>
                  <h6 className="text-lg font-normal text-center mt-4">{subCategory.categoryName}</h6>
                </Link>
              ))}
            </div>

            {/*  Sample section*/}
            {/*<section className="bg-primary-500 bg-opacity-[12%] my-8 py-10">*/}
            {/*    <Container>*/}
            {/*        <div className="flex flex-col md:flex-row lg:gap-24 md:gap-12 gap-6">*/}
            {/*            <div className="flex justify-center md:justify-start md:w-1/2">*/}
            {/*                <Image src="/assets/p-b-1.png" alt="" className="w-full h-auto object-contain"/>*/}
            {/*            </div>*/}
            {/*            <div className="flex flex-col justify-center gap-5 md:w-1/2">*/}
            {/*                <h3 className="mb-3 text-black font-extrabold lg:text-4xl md:text-2xl text-2xl capitalize">*/}
            {/*                    Celebrate Achievement with Custom Awards*/}
            {/*                </h3>*/}
            {/*                <p className=" text-mute3 text-lg md:text-xl">*/}
            {/*                    Create personalized gifts that are perfect for birthdays, holidays, and special moments.*/}
            {/*                    From photo*/}
            {/*                    books and custom puzzles to unique keepsakes, our range of personalized gifts will show*/}
            {/*                    your loved ones*/}
            {/*                    how much you care. Celebrate every occasion with a touch of creativity and*/}
            {/*                    thoughtfulness.*/}
            {/*                </p>*/}
            {/*                <button*/}
            {/*                    className="flex justify-start text-lg py-3 px-12 border-2 rounded-full border-primary-400 text-primary-500 w-fit">*/}
            {/*                    Get Started*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Container>*/}
            {/*</section>*/}
            {/*<ProductsSection*/}
            {/*  categoryId={category.id}*/}
            {/*  categoryName={category.categoryName}*/}
            {/*  prefix={category.prefix}*/}
            {/*  suffix={category.suffix}*/}
            {/*  uniqueCategoryName={category.uniqueCategoryName}*/}
            {/*/>*/}

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
          </div>
        </div>
        <div className=" lg:hidden block ">
          <CategoriesSidebar
            allCategories={allCategories}
            selectedCategory={category}
            siblingCategories={siblingCategories}
          />
        </div>
      </div>
    </div>
  );
};
