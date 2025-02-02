import React from 'react';
import {fetchRelatedProductDetails, getProductDetailsByUniqueName} from '@components/home/product/product-apis';
import {ProductDetails} from '@components/home/product/product-details.component';
import {EnclosureProduct, PriceGrids, Product} from '@components/home/product/product.types';
import moment from 'moment';
import {permanentRedirect, RedirectType} from 'next/navigation';

type Params = Promise<{uniqueProductName: string[]}>;

const ProductsPage = async (props: {params: Params}) => {
  const params = await props.params;
  let uniqueName = params.uniqueProductName.join('/');

  const finalUrl = decodeURIComponent(uniqueName)
    .replaceAll(',000', 'k')
    .replaceAll('½', '')
    .replaceAll('¼', '')
    .replaceAll('½/', '')
    .replaceAll('---', '-')
    .replaceAll('-–-', '-')
    .replaceAll('--', '-')
    .replaceAll("'", '')
    .replaceAll('™', '')
    .replaceAll('®', '')
    .replaceAll('"', '')
    .replaceAll('.', '')
    .replaceAll('%', '')
    .replaceAll('”', '')
    .replaceAll('+', '')
    .replaceAll('’', '')
    .replaceAll('&', 'amp')
    .replaceAll(' ', '')
    .replaceAll('è', 'e')
    .replaceAll('©', '')
    .replaceAll('ü', 'u')
    .replaceAll(':', '')
    .replaceAll(',', '')
    .replaceAll('°', '')
    .replaceAll('‘', '');

  if (uniqueName !== finalUrl) {
    permanentRedirect(`/products/${finalUrl}`, RedirectType.replace);
  }

  const response = await getProductDetailsByUniqueName(uniqueName);
  let product: Product | null = null;
  let relatedProducts: EnclosureProduct[] | null = null;
  if (response?.payload) {
    product = response.payload;
    const relatedProductResponse = await fetchRelatedProductDetails(product.id);
    if (relatedProductResponse?.payload) {
      //@ts-ignore
      relatedProducts = relatedProductResponse.payload.content;
    }
  }

  let minPrice: PriceGrids | null = null;
  let maxPrice: PriceGrids | null = null;

  const isProductOnSale: boolean = product?.saleEndDate ? moment(product?.saleEndDate).isAfter(moment()) : false;

  const sortedPricing = (product?.priceGrids ?? []).filter(item => item.price !== 0).sort((a, b) => a.price - b.price);
  if (sortedPricing.length > 0) {
    minPrice = sortedPricing[0];
    maxPrice = sortedPricing[sortedPricing.length - 1];
  }

  const size = (product?.additionalFieldProductValues ?? []).find(
    it => 'approximate size'.indexOf(it?.fieldName.toLowerCase()) > -1
  );

  const colors = (product?.additionalFieldProductValues ?? []).find(
    item => 'colors available'.indexOf(item?.fieldName.toLowerCase()) > -1
  );

  return (
    <section key={uniqueName}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product?.productName,
            image: (product?.productImages ?? []).map(item => `${process.env.ASSETS_SERVER_URL}${item.imageUrl}`),
            description: (product?.metaDescription ?? product?.description ?? '').replace(/<[^>]+>/g, ''),
            sku: product?.sku,
            url: `${process.env.FE_URL}products/${product?.uniqueProductName}`,
            category: [
              ...(product?.crumbs ?? []),
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
            ]
              .sort((a, b) => b.sequenceNumber - a.sequenceNumber)
              .map(item => item.name)
              .join(' > '),
            size: size ? size.fieldValue.replaceAll(/<\/?[^>]+(>|$)/g, '') : 'Standard',
            color: colors ? colors.fieldValue.replaceAll(/<\/?[^>]+(>|$)/g, '') : '',
            brand: {
              '@type': 'Brand',
              name: 'PrintsYou'
            },
            manufacturer: {
              '@type': 'Organization',
              name: 'PrintsYou'
            },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'USD',

              lowPrice: isProductOnSale && minPrice?.salePrice ? minPrice?.salePrice : minPrice?.price,
              highPrice: isProductOnSale && maxPrice?.salePrice ? maxPrice?.salePrice : maxPrice?.price,
              offerCount: (product?.priceGrids ?? []).length,
              offers: (product?.priceGrids ?? [])
                .filter(item => item.price !== 0)
                .map(item => ({
                  '@type': 'Offer',
                  price: isProductOnSale && item.salePrice ? item.salePrice : item.price,
                  additionalType: item.priceType,
                  priceCurrency: 'USD',
                  itemCondition: 'https://schema.org/NewCondition',
                  availability: 'https://schema.org/InStock',
                  priceValidUntil:
                    isProductOnSale && product?.saleEndDate
                      ? moment(product?.saleEndDate).format('YYYY-MM-DD')
                      : moment().add(1, 'year').format('YYYY-MM-DD'),
                  eligibleQuantity: {
                    '@type': 'QuantitativeValue',
                    minValue: item.countFrom
                  }
                })),

              availability: 'https://schema.org/InStock',
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                  '@type': 'MonetaryAmount',
                  minValue: 3.49,
                  maxValue: 50.0,
                  currency: 'USD'
                },
                shippingDestination: {
                  '@type': 'DefinedRegion',
                  addressCountry: 'US'
                },
                deliveryTime: {
                  '@type': 'ShippingDeliveryTime',
                  handlingTime: {
                    '@type': 'QuantitativeValue',
                    minValue: 0,
                    maxValue: 3,
                    unitCode: 'DAY'
                  },
                  transitTime: {
                    '@type': 'QuantitativeValue',
                    minValue: 1,
                    maxValue: 7,
                    unitCode: 'DAY'
                  },
                  cutOffTime: '23:30:00-05:00',
                  businessDays: {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: [
                      'https://schema.org/Monday',
                      'https://schema.org/Tuesday',
                      'https://schema.org/Wednesday',
                      'https://schema.org/Thursday',
                      'https://schema.org/Friday',
                      'https://schema.org/Saturday'
                    ]
                  }
                }
              },

              additionalProperty: (product?.additionalRows ?? []).map(item => ({
                '@type': 'PropertyValue',
                name: item.name,
                value: `$${item.priceDiff}`
              }))
            }
          })
        }}
      />
      {/*<Script*/}
      {/*  id="images-product-page-ld-schema"*/}
      {/*  type="application/ld+json"*/}
      {/*  dangerouslySetInnerHTML={{*/}
      {/*    __html: JSON.stringify({*/}
      {/*      '@context': 'https://schema.org',*/}
      {/*      '@type': 'ImageGallery',*/}
      {/*      url: `${process.env.FE_URL}${product?.uniqueProductName}`,*/}
      {/*      associatedMedia: (product?.productImages ?? []).map((image, index) => ({*/}
      {/*        '@type': 'ImageObject',*/}
      {/*        contentUrl: `${process.env.ASSETS_SERVER_URL}${image.imageUrl}`,*/}
      {/*        text: image.altText ? image.altText : `${product?.productName} + ${index + 1}`*/}
      {/*      }))*/}
      {/*    })*/}
      {/*  }}*/}
      {/*/>*/}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: (
              (product?.crumbs && [
                ...(product?.crumbs ?? []),
                {
                  sequenceNumber: 1,
                  uniqueCategoryName: '',
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
              .map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: `${process.env.FE_URL}${index === 0 ? '' : index === 1 ? 'categories' : item.sequenceNumber === 100 ? `products/${item.uniqueCategoryName}` : `categories/${item.uniqueCategoryName}`}`
              }))
          })
        }}
      />
      <ProductDetails product={product} relatedProducts={relatedProducts} />
    </section>
  );
};

export default ProductsPage;

export async function generateMetadata(props: {params: Params}) {
  const params = await props.params;

  const response = await getProductDetailsByUniqueName(params.uniqueProductName.join('/'));

  let product: Product | null = null;

  if (response?.payload) product = response.payload;

  const lowestPrice = (product?.priceGrids ?? [])
    .filter(item => item.price && item.price !== 0)
    .sort((a, b) => a.price - b.price);

  let minimumPrice = 0;
  if (lowestPrice.length > 0) minimumPrice = lowestPrice[0].price;

  return {
    title: `${product?.prefix ?? 'Promotional'} ${product?.metaTitle || product?.productName}${product?.suffix ? ` ${product?.suffix}` : ''} ${minimumPrice}$`,
    description: product?.metaDescription || '',
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical: `${process.env.FE_URL}products/${product?.uniqueProductName}`
    },
    openGraph: {
      images: (product?.productImages || []).map((value, index) => ({
        url: `${process.env.ASSETS_SERVER_URL}${value.imageUrl}`,
        alt: value.altText ?? `${product?.productName} ${index + 1}`
      })),
      description: product?.metaDescription ?? '',
      title: product?.productName
    }
  };
}
