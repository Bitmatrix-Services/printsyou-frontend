import {getProductDetailsByUniqueName} from '@components/home/product/product-apis';
import {ProductDetails} from '@components/home/product/product-details.component';
import {Product} from '@components/home/product/product.types';
import {metaConstants} from '@utils/constants';
import Head from 'next/head';
import React from 'react';

const ProductsPage = async ({params}: {params: {uniqueProductName: string[]}}) => {
  const response = await getProductDetailsByUniqueName(params.uniqueProductName.join('/'));
  let product: Product | null = null;

  if (response?.payload) product = response.payload;

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              '@type': 'Product',
              name: product?.productName,
              image: (product?.productImages ?? []).map(item => `${process.env.ASSETS_SERVER_URL}${item.imageUrl}`),
              description: (product?.description ?? '').replace(/<[^>]+>/g, ''),
              sku: product?.sku,
              offers: {
                '@type': 'Offer',
                url: `${process.env.FE_URL}${product?.uniqueProductName}`,
                itemCondition: 'https://schema.org/NewCondition',
                availability: 'https://schema.org/InStock',
                priceCurrency: 'USD',
                price: [...(product?.priceGrids ?? [])].sort((a, b) => a.countFrom - b.countFrom).pop()?.price
              }
            })
          }}
        />
      </Head>
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
    title: `${product?.metaTitle || product?.productName} | ${metaConstants.SITE_NAME}`,
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
