import {
  getAllSiblingCategories,
  getCategoryDetailsByUniqueName,
  getProductByCategoryWithFilers,
  getProductsLdForCategoryPage
} from '@components/home/category/category.apis';
import {CategoryDetails} from '@components/home/category/category-details.component';
import {Category} from '@components/home/home.types';
import {notFound, permanentRedirect, RedirectType} from 'next/navigation';
import {getAllCategories} from '@components/home/home-apis';
import {IconDescriptor} from 'next/dist/lib/metadata/types/metadata-types';
import React from 'react';
import {EnclosureProduct, Product} from '@components/home/product/product.types';

type Params = Promise<{uniqueCategoryName: string[]}>;
type SearchParams = Promise<any>;

const CategoryPage = async (props: {params: Params; searchParams: SearchParams}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;

  let uniqueName = params.uniqueCategoryName.join('/');

  const finalUrl = decodeURIComponent(uniqueName)
    .replaceAll('---', '-')
    .replaceAll('--', '-')
    .replaceAll("'", '')
    .replaceAll('™', '')
    .replaceAll('®', '')
    .replaceAll('½', '')
    .replaceAll('"', '')
    .replaceAll('.', '-')
    .replaceAll('%', '')
    .replaceAll('”', '')
    .replaceAll('+', '')
    .replaceAll('’', '')
    .replaceAll('&', 'amp')
    .replaceAll(' ', '');

  if (uniqueName !== finalUrl) {
    permanentRedirect(`/categories/${finalUrl}`, RedirectType.replace);
  }
  const categoriesRes = await getAllCategories();
  const response = await getCategoryDetailsByUniqueName(uniqueName);
  const siblingCat = await getAllSiblingCategories(response?.payload?.id!!);

  let category: Category | null = null;
  let productsByCategoryPaged: any | null = null;

  if (response?.payload) {
    category = response.payload;
    productsByCategoryPaged = await getProductByCategoryWithFilers(category.id, searchParams);
  }

  let allCategories: Category[] = [];
  if (siblingCat?.payload) allCategories = categoriesRes.payload;
  let siblingCategories: Category[] = [];
  if (siblingCat?.payload) siblingCategories = siblingCat.payload;

  return (
    <section key={uniqueName}>
      {/*{searchParams.page && (*/}
      {/*  <Head>*/}
      {/*    <meta name="robots" content="noindex,nofollow,noodp,noydir" />*/}
      {/*  </Head>*/}
      {/*)}*/}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: (
              (category?.crumbs && [
                ...(category?.crumbs ?? []),
                {
                  sequenceNumber: 1,
                  uniqueCategoryName: 'categories',
                  name: 'Promotional Products'
                },
                {
                  sequenceNumber: 0,
                  uniqueCategoryName: '',
                  name: 'Home'
                }
              ]) ??
              []
            )
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
              .map(item => ({
                '@type': 'ListItem',
                position: item.sequenceNumber + 1,
                name: item.name,
                item: `${process.env.FE_URL}categories/${item.uniqueCategoryName}`
              }))
          })
        }}
      />
      {category && productsByCategoryPaged && productsByCategoryPaged.content.length > 0 ? (
        <>
          {/*<script*/}
          {/*  type="application/ld+json"*/}
          {/*  dangerouslySetInnerHTML={{*/}
          {/*    __html: JSON.stringify({*/}
          {/*      '@type': 'ItemList',*/}
          {/*      '@context': 'http://schema.org',*/}
          {/*      '@id': `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}#pagination`,*/}
          {/*      name: `${category.categoryName} - Pagination`,*/}
          {/*      description: `Pagination for the ${category.categoryName} category`,*/}
          {/*      numberOfItems: productsByCategoryPaged.totalPages,*/}
          {/*      mainEntityOfPage: {*/}
          {/*        '@type': 'WebPage',*/}
          {/*        '@id': `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}`*/}
          {/*      },*/}
          {/*      itemListElement:*/}
          {/*        productsByCategoryPaged.totalPages &&*/}
          {/*        Array.from({length: productsByCategoryPaged.totalPages}, (_, index) => ({*/}
          {/*          '@type': 'ListItem',*/}
          {/*          position: index + 1,*/}
          {/*          url:*/}
          {/*            index == 0*/}
          {/*              ? category && `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}`*/}
          {/*              : category &&*/}
          {/*                `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}?page=${index + 1}`*/}
          {/*        }))*/}
          {/*    })*/}
          {/*  }}*/}
          {/*/>*/}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@type': 'ItemList',
                '@context': 'http://schema.org',
                '@id': `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}#featured-products`,
                name: `Featured ${category.categoryName}`,
                description: `A list of featured ${category.categoryName}`,
                numberOfItems: (productsByCategoryPaged.content ?? []).filter(
                  (item: EnclosureProduct) => !item.outOfStock
                ).length,
                itemListElement:
                  productsByCategoryPaged.totalPages &&
                  (productsByCategoryPaged.content ?? [])
                    .filter((item: EnclosureProduct) => !item.outOfStock)
                    .map((product: EnclosureProduct, index: any) => ({
                      '@type': 'ListItem',
                      position: index + 1,
                      item: {
                        '@type': 'Product',
                        url: `${process.env.NEXT_PUBLIC_FE_URL}products/${product.uniqueProductName}`,
                        name: product.productName,
                        image: product.imageUrl,
                        offers: {
                          '@type': 'Offer',
                          price: [...(product.priceGrids ?? [])]
                            .filter(item => item.price !== 0)
                            .sort((a, b) => a.price - b.price)
                            .shift()?.price,
                          priceCurrency: 'USD',
                          availability: 'http://schema.org/InStock',
                          itemCondition: 'http://schema.org/NewCondition'
                        }
                      }
                    }))
              })
            }}
          />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'http://schema.org',
                '@type': 'WebPage',
                url: `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}`,
                mainEntity: {
                  '@context': 'http://schema.org',
                  '@type': 'OfferCatalog',
                  '@id': `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}#catalog`,
                  name: category.categoryName,
                  url: `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}`,
                  numberOfItems: productsByCategoryPaged.totalElements,
                  itemListElement: (productsByCategoryPaged.content ?? []).map((product: EnclosureProduct) => ({
                    '@type': 'Product',
                    '@id': `${process.env.NEXT_PUBLIC_FE_URL}products/${product.uniqueProductName}`,
                    url: `${process.env.NEXT_PUBLIC_FE_URL}products/${product.uniqueProductName}`,
                    name: product.productName,
                    description: product.metaDescription,
                    sku: product.sku,
                    image: `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${product.imageUrl}`,
                    offers: {
                      price: [...(product.priceGrids ?? [])]
                        .filter(item => item.price !== 0)
                        .sort((a, b) => a.price - b.price)
                        .shift()?.price,
                      priceCurrency: 'USD',
                      availability: product.outOfStock ? 'http://schema.org/OutOfStock' : 'http://schema.org/InStock',
                      itemCondition: 'http://schema.org/NewCondition',
                      seller: {
                        '@type': 'Organization',
                        name: 'PrintsYou'
                      }
                    }
                  }))
                }
              })
            }}
          />
        </>
      ) : null}
      <CategoryDetails
        allCategories={allCategories}
        category={category}
        pagedData={productsByCategoryPaged}
        siblingCategories={siblingCategories}
      />
    </section>
  );
};

export default CategoryPage;

export async function generateMetadata(props: {params: Params; searchParams: SearchParams}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const response = await getCategoryDetailsByUniqueName(params.uniqueCategoryName.join('/'));

  const pageNumberQuery = searchParams.page;
  const currentPage = +(pageNumberQuery ?? '1');

  const ld = await getProductsLdForCategoryPage(response?.payload?.id!!, currentPage + '');

  let totalPages: number = ld?.payload['totalPages'];

  if (currentPage > totalPages) notFound();

  let category: Category | null = null;
  if (response?.payload) category = response.payload;

  let canonicalURL: string = `${process.env.FE_URL}categories/${category?.uniqueCategoryName}`;
  if (currentPage > 1) {
    canonicalURL = `${canonicalURL}?page=${currentPage}`;
  }

  const descriptors: IconDescriptor[] = [];
  if (currentPage > 1) {
    descriptors.push({
      rel: 'prev',
      url: `${process.env.FE_URL}categories/${category?.uniqueCategoryName}${currentPage - 1 === 1 ? '' : `?page=${currentPage - 1}`}`
    });
  }

  if (currentPage < totalPages) {
    descriptors.push({
      rel: 'next',
      url: `${process.env.FE_URL}categories/${category?.uniqueCategoryName}?page=${currentPage + 1}`
    });
  }

  return {
    title: `${category?.prefix ?? 'Shop'} ${category?.metaTitle || category?.categoryName} ${category?.suffix ?? ''}`,
    description: category?.metaDescription || '',
    icons: {
      other: descriptors
    },
    alternates: {
      canonical: canonicalURL
    },
    openGraph: {
      images: category?.imageUrl
        ? [
            {
              url: `${process.env.ASSETS_SERVER_URL}${category?.imageUrl}`
            }
          ]
        : [],
      description: category?.metaDescription ?? '',
      title: category?.categoryName
    }
  };
}
