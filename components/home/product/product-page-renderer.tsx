import React from 'react';
import {fetchRelatedProductDetails, getProductDetailsByUniqueName} from '@components/home/product/product-apis';
import {getCategoryDetailsByUniqueName} from '@components/home/category/category.apis';
import {ProductDetails} from '@components/home/product/product-details.component';
import {EnclosureProduct, PriceGrids, Product} from '@components/home/product/product.types';
import {permanentRedirect, RedirectType} from 'next/navigation';
import dayjs from 'dayjs';
import {buildCategoryUrl, buildProductFullUrl, buildProductUrl, buildProductUrlBySlug, buildCategoryUrlBySlug, isCleanFormat} from '@utils/url-builder';

export type ProductPageParams = Promise<{uniqueProductName: string[]}>;

// skipCleanRedirect: set by the /[...slug] catch-all route, which reuses this
// renderer to show CLEAN products at their canonical (already-clean) URL -
// without this, the redirect below would fire again and loop against itself.
export const renderProductsPage = async ({
  params,
  skipCleanRedirect
}: {
  params: ProductPageParams;
  skipCleanRedirect?: boolean;
}) => {
  const {uniqueProductName} = await params;
  const uniqueName = uniqueProductName.join('/');
  const finalUrl = normalizeUrl(uniqueName);

  if (uniqueName !== finalUrl) {
    permanentRedirect(`/products/${finalUrl}`, RedirectType.replace);
  }

  const response = await getProductDetailsByUniqueName(uniqueName);
  const product: Product | null = response?.payload ?? null;

  // Guard: a product can go missing at its indexed URL if it was deleted, or moved to a
  // different category during taxonomy restructuring without a redirect being created
  // (a known gap in the restructuring tool - see 31-jul-2026 backend migration). Rather
  // than serving a bare 404 to a Google-indexed link, walk up the category path from most
  // specific to least specific (immediate parent first, root last) and redirect to the
  // first ancestor category that still resolves.
  if (!product) {
    const segments = finalUrl.split('/');
    for (let i = segments.length - 1; i > 0; i--) {
      const ancestorCategoryPath = segments.slice(0, i).join('/');
      const ancestorCategoryResponse = await getCategoryDetailsByUniqueName(ancestorCategoryPath);
      const ancestorCategory = ancestorCategoryResponse?.payload;
      if (ancestorCategory) {
        permanentRedirect(buildCategoryUrl(ancestorCategory), RedirectType.replace);
      }
    }
  }

  // Migrated/new products use CLEAN format (no /products/ prefix) - redirect
  // legacy-prefixed visits to the canonical clean URL instead of serving both.
  if (!skipCleanRedirect && product && isCleanFormat(product.urlFormat)) {
    permanentRedirect(buildProductUrl(product), RedirectType.replace);
  }

  const relatedProductResponse = product ? await fetchRelatedProductDetails(product.id) : null;

  // @ts-ignore
  const relatedProducts: EnclosureProduct[] | null = relatedProductResponse?.payload.content ?? null;

  const sortedPricing = (product?.priceGrids ?? []).filter(item => item.price !== 0).sort((a, b) => a.price - b.price);
  const minPrice = sortedPricing[0] || null;
  const maxPrice = sortedPricing[sortedPricing.length - 1] || null;

  const isProductOnSale = product?.saleEndDate ? dayjs(product.saleEndDate).isAfter(dayjs()) : false;

  const productSchema = generateProductSchema(product, isProductOnSale, minPrice, maxPrice);
  const breadcrumbSchema = generateBreadcrumbSchema(product);

  return (
    <section key={uniqueName}>
      <script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(productSchema)}}
      />
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}}
      />
      <ProductDetails product={product} relatedProducts={relatedProducts} />
    </section>
  );
};

export async function generateProductPageMetadata(props: {params: ProductPageParams}) {
  const params = await props.params;

  const response = await getProductDetailsByUniqueName(params.uniqueProductName.join('/'));
  const product: Product | null = response?.payload ?? null;

  const lowestPrice = (product?.priceGrids ?? [])
    .filter(item => item.price && item.price !== 0)
    .sort((a, b) => a.price - b.price);

  const minimumPrice = lowestPrice.length > 0 ? lowestPrice[0].price : 0;

  const productTitle = product?.metaTitle || product?.productName || 'Custom Product';
  const priceText = minimumPrice > 0 ? ` | From $${minimumPrice.toFixed(2)}` : '';

  // Only decorate with prefix/suffix when falling back to the plain product name - an
  // admin-authored metaTitle is already deliberately crafted and shouldn't get mangled.
  const decoratedTitle = !product?.metaTitle
    ? `${product?.prefix ? `${product.prefix} ` : ''}${productTitle}${product?.suffix ? ` ${product.suffix}` : ''}`
    : productTitle;

  return {
    title: `${decoratedTitle}${priceText} | PrintsYou`,
    description: product?.metaDescription || `Order custom ${productTitle} with fast turnaround. High-quality printing, competitive prices, and free shipping on qualifying orders. Get a quote today!`,
    robots: {index: true, follow: true},
    alternates: {canonical: product ? buildProductFullUrl(process.env.FE_URL || '', product) : undefined},
    openGraph: {
      images: (product?.productImages || []).map((value, index) => ({
        url: `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${value.imageUrl}`,
        alt: value.altText ?? `${product?.productName} ${index + 1}`
      })),
      description: product?.metaDescription ?? '',
      title: product?.productName
    }
  };
}

const generateProductSchema = (
  product: Product | null,
  isProductOnSale: boolean,
  minPrice: PriceGrids | null,
  maxPrice: PriceGrids | null
) => {
  if (!product) return null;

  // Filter out video files from images (Google schema only accepts images)
  // Sort by sequence_number to ensure correct order (sequence_number 1 = primary)
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
  const sortedImages = (product.productImages ?? [])
    .filter(item => imageExtensions.some(ext => item.imageUrl?.toLowerCase().endsWith(ext)))
    .sort((a, b) => (a.sequenceNumber ?? 999) - (b.sequenceNumber ?? 999));

  // Primary image (sequence_number 1) as string, rest as additional images array
  const primaryImage = sortedImages[0]
    ? `https://printsyouassets.s3.amazonaws.com/${sortedImages[0].imageUrl}`
    : `https://printsyouassets.s3.amazonaws.com/${product.productImages?.[0]?.imageUrl}`;
  const additionalImages = sortedImages.slice(1).map(item => `https://printsyouassets.s3.amazonaws.com/${item.imageUrl}`);

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.productName,
    image: primaryImage,
    ...(additionalImages.length > 0 && {additionalImage: additionalImages}),
    description: (product.metaDescription ?? product.description ?? '').replace(/<[^>]+>/g, ''),
    sku: product.sku,
    url: buildProductFullUrl(process.env.FE_URL || '', product),
    category: [
      {sequenceNumber: 0, uniqueCategoryName: '', name: 'Home'},
      {sequenceNumber: 1, uniqueCategoryName: '', name: 'Products'},
      ...(product.crumbs ?? [])
    ]
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
      .map(item => item.name)
      .join(' > '),
    size:
      product.additionalFieldProductValues
        ?.find(it => it?.fieldName?.toLowerCase().includes('approximate size'))
        ?.fieldValue.replaceAll(/<\/?[^>]+(>|$)/g, '') || 'Standard',
    color:
      product.additionalFieldProductValues
        ?.find(item => item?.fieldName?.toLowerCase().includes('colors available'))
        ?.fieldValue.replaceAll(/<\/?[^>]+(>|$)/g, '') || '',
    brand: {'@type': 'Brand', name: 'PrintsYou'},
    manufacturer: {'@type': 'Organization', name: 'PrintsYou'},
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: isProductOnSale && minPrice?.salePrice ? minPrice.salePrice : minPrice?.price,
      highPrice: isProductOnSale && maxPrice?.salePrice ? maxPrice.salePrice : maxPrice?.price,
      offerCount: (product.priceGrids ?? []).length,
      offers: (product.priceGrids ?? [])
        .filter(item => item.price !== 0)
        .map(item => ({
          '@type': 'Offer',
          price: isProductOnSale && item.salePrice ? item.salePrice : item.price,
          additionalType: item.priceType,
          priceCurrency: 'USD',
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
          priceValidUntil:
            isProductOnSale && product.saleEndDate
              ? dayjs(product.saleEndDate).format('YYYY-MM-DD')
              : dayjs().add(1, 'year').format('YYYY-MM-DD'),
          eligibleQuantity: {'@type': 'QuantitativeValue', minValue: item.countFrom, unitCode: 'C62'}
        })),
      availability: 'https://schema.org/InStock',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: minPrice && minPrice.price >= 500 ? 0 : 5.0,
          currency: 'USD'
        },
        freeShippingThreshold: {
          '@type': 'DeliveryChargeSpecification',
          freeShippingThreshold: {
            '@type': 'MonetaryAmount',
            value: 500,
            currency: 'USD'
          }
        },
        shippingDestination: {'@type': 'DefinedRegion', addressCountry: 'US'},
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {'@type': 'QuantitativeValue', minValue: 0, maxValue: 3, unitCode: 'DAY'},
          transitTime: {'@type': 'QuantitativeValue', minValue: 1, maxValue: 7, unitCode: 'DAY'}
        }
      }
    }
  };
};

const generateBreadcrumbSchema = (product: Product | null) => {
  if (!product?.crumbs) return null;

  const feUrl = process.env.FE_URL?.endsWith('/') ? process.env.FE_URL.slice(0, -1) : process.env.FE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ...(product.crumbs ?? []),
      {sequenceNumber: 1, uniqueCategoryName: '', name: 'Products', urlFormat: undefined},
      {sequenceNumber: 0, uniqueCategoryName: '', name: 'Home', urlFormat: undefined}
    ]
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
      .map((item, index) => {
        // Use urlFormat-aware builders so this matches the actual page URL - a stale
        // hardcoded /categories/ or /products/ prefix here misleads Google's rich results,
        // even though (unlike a rendered <Link>) it can't cause a visible redirect flash.
        let path: string;
        if (index === 0) {
          path = '/';
        } else if (item.sequenceNumber === 1) {
          path = '/categories';
        } else if (item.sequenceNumber === 100) {
          path = buildProductUrlBySlug(item.uniqueCategoryName, item.urlFormat);
        } else {
          path = buildCategoryUrlBySlug(item.uniqueCategoryName, item.urlFormat);
        }
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${feUrl}${path}`
        };
      })
  };
};

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
