import React from 'react';
import {fetchRelatedProductDetails, getProductDetailsByUniqueName} from '@components/home/product/product-apis';
import {ProductDetails} from '@components/home/product/product-details.component';
import {EnclosureProduct, PriceGrids, Product} from '@components/home/product/product.types';
import moment from 'moment';
import {permanentRedirect, RedirectType} from 'next/navigation';

type Params = Promise<{uniqueProductName: string[]}>;

const normalizeUrl = (url: string) =>
  decodeURIComponent(url)
    .replace(/[™,®©'”‘’"]/g, '')
    .replace(/,000/g, 'k')
    .replace(/[½¼]/g, '')
    .replace(/---|--|–/g, '-')
    .replace(
      /[\s+%:&,°üè]/g,
      match => ({' ': '', '+': '', '%': '', ':': '', '&': 'amp', '°': '', ü: 'u', è: 'e'})[match] || match
    );

const ProductsPage = async ({params}: {params: Params}) => {
  const {uniqueProductName} = await params;
  const uniqueName = uniqueProductName.join('/');
  const finalUrl = normalizeUrl(uniqueName);

  if (uniqueName !== finalUrl) {
    permanentRedirect(`/products/${finalUrl}`, RedirectType.replace);
  }

  const response = await getProductDetailsByUniqueName(uniqueName);
  const product: Product | null = response?.payload ?? null;

  const relatedProductResponse = product ? await fetchRelatedProductDetails(product.id) : null;

  // @ts-ignore
  const relatedProducts: EnclosureProduct[] | null = relatedProductResponse?.payload.content ?? null;

  let minPrice: PriceGrids | null = null;
  let maxPrice: PriceGrids | null = null;

  const isProductOnSale: boolean = product?.saleEndDate ? moment(product.saleEndDate).isAfter(moment()) : false;

  const sortedPricing = (product?.priceGrids ?? []).filter(item => item.price !== 0).sort((a, b) => a.price - b.price);

  if (sortedPricing.length > 0) {
    minPrice = sortedPricing[0];
    maxPrice = sortedPricing[sortedPricing.length - 1];
  }

  const size = product?.additionalFieldProductValues?.find(it =>
    it?.fieldName?.toLowerCase().includes('approximate size')
  );

  const colors = product?.additionalFieldProductValues?.find(item =>
    item?.fieldName?.toLowerCase().includes('colors available')
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
