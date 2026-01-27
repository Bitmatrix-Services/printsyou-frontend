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
import {EnclosureProduct} from '@components/home/product/product.types';

type Params = Promise<{uniqueCategoryName: string[]}>;
type SearchParams = Promise<any>;

const CategoryPage = async (props: {params: Params; searchParams: SearchParams}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;

  let uniqueName = params.uniqueCategoryName.join('/');

  const finalUrl = decodeURIComponent(uniqueName)
    .replace(/[™,®©'”‘’".]/g, '')
    .replace(/---|--|–/g, '-')
    .replace(/[½%+’&]/g, '')
    .replace(/\s+/g, '');

  if (uniqueName !== finalUrl) {
    permanentRedirect(`/categories/${finalUrl}`, RedirectType.replace);
  }

  const [categoriesRes, response] = await Promise.all([getAllCategories(), getCategoryDetailsByUniqueName(uniqueName)]);

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

  let currentUrl: any = category && `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}`;
  if (productsByCategoryPaged?.number > 0) {
    currentUrl = `${currentUrl}?page=${productsByCategoryPaged?.number + 1}`;
  }

  const breadcrumbSchema = generateBreadcrumbSchema(category);
  const productCatalogSchema =
    category && productsByCategoryPaged
      ? generateProductCatalogSchema(category, productsByCategoryPaged, currentUrl)
      : null;

  return (
    <section key={uniqueName}>
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}}
      />
      {productCatalogSchema ? (
        <script
          id="product-catalog-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(productCatalogSchema)}}
        />
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
  const category: Category | null = response?.payload ?? null;

  const currentPage = +(searchParams.page ?? '1');
  const ld = await getProductsLdForCategoryPage(category?.id ?? '', currentPage.toString());
  const totalPages: number = ld?.payload.totalPages ?? 1;

  if (currentPage > totalPages) notFound();

  const canonicalURL = `${process.env.FE_URL}categories/${category?.uniqueCategoryName}${
    currentPage > 1 ? `?page=${currentPage}` : ''
  }`;

  const descriptors: IconDescriptor[] = [];
  if (currentPage > 1) {
    descriptors.push({
      rel: 'prev',
      url: `${process.env.FE_URL}categories/${category?.uniqueCategoryName}${
        currentPage - 1 === 1 ? '' : `?page=${currentPage - 1}`
      }`
    });
  }
  if (currentPage < totalPages) {
    descriptors.push({
      rel: 'next',
      url: `${process.env.FE_URL}categories/${category?.uniqueCategoryName}?page=${currentPage + 1}`
    });
  }

  return {
    title: `${category?.metaTitle || category?.categoryName} ${category?.suffix ?? ''} | PrintsYou`,
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

const generateBreadcrumbSchema = (category: Category | null) => {
  if (!category?.crumbs) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ...(category.crumbs ?? []),
      {sequenceNumber: 1, uniqueCategoryName: '', name: 'Promotional Products'},
      {sequenceNumber: 0, uniqueCategoryName: '', name: 'Home'}
    ]
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
      .map(item => ({
        '@type': 'ListItem',
        position: item.sequenceNumber + 1,
        name: item.name,
        item:
          item.sequenceNumber === 0
            ? `${process.env.FE_URL}`
            : `${process.env.FE_URL}categories/${item.uniqueCategoryName}`
      }))
  };
};

const generateProductCatalogSchema = (category: Category, productsByCategoryPaged: any, currentUrl: string) => {
  return {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    url: currentUrl,
    mainEntity: {
      '@context': 'http://schema.org',
      '@type': 'OfferCatalog',
      '@id': `${currentUrl}#catalog`,
      name: category.categoryName,
      url: currentUrl,
      offerCount: productsByCategoryPaged.totalElements,
      itemOffered: {
          '@type': "OfferCatalog",
          '@id': "https://printsyou.com/categories/apparel/hi-vis-custom-safety-vests#catalog",
          name: category.categoryName,
          url: "https://printsyou.com/categories/apparel/hi-vis-custom-safety-vests",
          numberOfItems: productsByCategoryPaged.totalElements,
          itemListElement: (productsByCategoryPaged.content ?? []).map((product: EnclosureProduct) => ({
              '@type': 'Product',
              '@id': `${process.env.NEXT_PUBLIC_FE_URL}products/${product.uniqueProductName}`,
              url: `${process.env.NEXT_PUBLIC_FE_URL}products/${product.uniqueProductName}`,
              name: product.productName,
              description: product.metaDescription,
              sku: product.sku,
              image: {
                  '@type': "ImageObject",
                  url: `${process.env.ASSETS_SERVER_URL}${product?.imageUrl}`,
                  width: 800,
                  height: 800,
                  caption: product?.productName
              },
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
    },
    primaryImageOfPage: {
        '@type': "ImageObject",
        url: `${process.env.ASSETS_SERVER_URL}${category?.imageUrl}`,
        width: 800,
        height: 800,
        caption: category.metaTitle
    },
    isPartOf: {
      '@type': 'CollectionPage',
      name: category.categoryName,
      url: `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}`
    },
    hasPart: [
      {
        '@type': 'WebPage',
        name: 'Previous Page',
        url:
          productsByCategoryPaged.number > 1
            ? `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}?page=${productsByCategoryPaged.number}`
            : productsByCategoryPaged.number === 1
              ? `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}`
              : null
      },
      {
        '@type': 'WebPage',
        name: 'Next Page',
        url:
          productsByCategoryPaged.number + 1 < productsByCategoryPaged.totalPages
            ? `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}?page=${productsByCategoryPaged.number + 2}`
            : null
      }
    ].filter(page => page.url !== null)
  };
};
