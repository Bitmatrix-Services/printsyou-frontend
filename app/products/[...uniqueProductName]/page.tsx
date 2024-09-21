import React from 'react';
import {getProductDetailsByUniqueName} from '@components/home/product/product-apis';
import {ProductDetails} from '@components/home/product/product-details.component';
import {Product} from '@components/home/product/product.types';
import moment from 'moment';
import {permanentRedirect, RedirectType} from 'next/navigation';

const ProductsPage = async ({params}: {params: {uniqueProductName: string[]}}) => {
  let uniqueName = params.uniqueProductName.join('/');

  const finalUrl = decodeURIComponent(uniqueName)
    .replaceAll('---', '-')
    .replaceAll('--', '-')
    .replaceAll("'", '')
    .replaceAll('™', '')
    .replaceAll('®', '')
    .replaceAll('½', '')
    .replaceAll('"', '')
    .replaceAll('.', '')
    .replaceAll('%', '')
    .replaceAll('”', '')
    .replaceAll('+', '')
    .replaceAll('’', '')
    .replaceAll('&', 'amp')
    .replaceAll(' ', '');

  if (uniqueName !== finalUrl) {
    permanentRedirect(`/products/${finalUrl}`, RedirectType.replace);
  }

  const response = await getProductDetailsByUniqueName(uniqueName);
  let product: Product | null = null;

  if (response?.payload) product = response.payload;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product?.productName,
            image: (product?.productImages ?? []).map(item => `${process.env.ASSETS_SERVER_URL}${item.imageUrl}`),
            description: product?.metaDescription ?? '',
            sku: product?.sku,
            offers: {
              '@type': 'Offer',
              url: `${process.env.FE_URL}${product?.uniqueProductName}`,
              itemCondition: 'https://schema.org/NewCondition',
              availability: 'https://schema.org/InStock',
              priceCurrency: 'USD',
              priceValidUntil: product?.saleEndDate
                ? moment(product?.saleEndDate, 'MMMM DD, YYYY').format('YYYY-MM-DD')
                : null,
              price: [...(product?.priceGrids ?? [])].sort((a, b) => a.countFrom - b.countFrom).pop()?.price,
              shippingDetails: {
                '@type': 'OfferShippingDetails',
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
              }
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageGallery',
            url: `${process.env.FE_URL}${product?.uniqueProductName}`,
            associatedMedia: (product?.productImages ?? []).map((image, index) => ({
              '@type': 'ImageObject',
              contentUrl: `${process.env.ASSETS_SERVER_URL}${image.imageUrl}`,
              text: image.altText ? image.altText : `${product?.productName} + ${index + 1}`
            }))
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: (product?.crumbs ?? [])
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
              .map(item => ({
                '@type': 'ListItem',
                position: item.sequenceNumber + 1,
                name: item.name,
                item: `${process.env.FE_URL}/${item.uniqueCategoryName}`
              }))
          })
        }}
      />
      <ProductDetails product={product} />
    </>
  );
};

export default ProductsPage;

export async function generateMetadata({params}: {params: {uniqueProductName: string[]}}) {
  const response = await getProductDetailsByUniqueName(params.uniqueProductName.join('/'));

  let product: Product | null = null;

  if (response?.payload) product = response.payload;

  return {
    title: `${product?.metaTitle || product?.productName}`,
    description: product?.metaDescription || '',
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
