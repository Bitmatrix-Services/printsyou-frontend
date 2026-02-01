'use client';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import React, {FC, Fragment, Suspense, useEffect, useMemo, useRef, useState} from 'react';
import {EnclosureProduct, Product, ProductImage} from '@components/home/product/product.types';
import {Container} from '@components/globals/container.component';
import {ProductImageComponent} from '@components/home/product/product-image-section.component';
import {ProductDescriptionComponent} from '@components/home/product/product-description-section.component';
import {OrderTimeline} from '@components/home/product/order-timeline.component';
import {TrustBadges} from '@components/home/product/trust-badges.component';
import {ProductFAQ} from '@components/home/product/product-faq.component';
import {CustomerReviews} from '@components/home/product/customer-reviews.component';
import {MobileStickyCta} from '@components/home/product/mobile-sticky-cta.component';
import sanitizeHtml from 'sanitize-html';
import dynamic from 'next/dynamic';
import {SliderSkeleton} from '@components/home/home-component';
import {notFound} from 'next/navigation';

const RelatedProductsSection = dynamic(
  () => import('@components/home/product/related-products.component').then(mod => mod.RelatedProductsSection),
  {
    ssr: false,
    loading: SliderSkeleton
  }
);

interface IProductDetails {
  product: Product | null;
  relatedProducts: EnclosureProduct[] | null;
}

export const ProductDetails: FC<IProductDetails> = ({product, relatedProducts}) => {
  if (!product) notFound();
  const [images, setImages] = useState<ProductImage[]>([]);
  const productDescriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product?.productImages?.length > 0) {
      setImages(product.productImages);
    } else if (product.productColors?.length > 0) {
      const imagesFromColors = Array.from(
        new Map(
          product.productColors.map((color, index) => [
            color.coloredProductImage,
            {
              imageUrl: color.coloredProductImage ?? '',
              sequenceNumber: index + 1
            }
          ])
        ).values()
      );
      setImages(imagesFromColors);
    }
  }, [product.productImages, product.productColors]);

  const sortedImages = useMemo(() => {
    return images.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }, [images]);

  const scrollToElement = () => {
    if (productDescriptionRef.current) {
      const yOffset = -120;
      const yPosition = productDescriptionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: yPosition, behavior: 'smooth'});
    }
  };

  const formattedDescription = useMemo(() => {
    if (!product?.productDescription) return '';

    let description = product.productDescription;
    if (!description.startsWith('<p')) {
      description = `<p style="text-align: justify;">${description}`;
      description = description.replace('<ul>', '</p> <p>&nbsp;</p> <ul>');
    } else if (!description.includes('<p>&nbsp;</p>')) {
      description = description.replace('<ul>', '</p> <p>&nbsp;</p> <ul>');
    }
    return sanitizeHtml(description);
  }, [product?.productDescription]);

  // Extract production time from additional fields
  const productionTime = useMemo(() => {
    const productionField = product?.additionalFieldProductValues?.find(
      f => f.fieldName.toLowerCase().includes('production')
    );
    if (productionField) {
      const match = productionField.fieldValue.match(/(\d+)/);
      return match ? parseInt(match[1]) : 4;
    }
    return 4;
  }, [product?.additionalFieldProductValues]);

  const shippingTime = useMemo(() => {
    const shippingField = product?.additionalFieldProductValues?.find(
      f => f.fieldName.toLowerCase().includes('shipping')
    );
    if (shippingField) {
      const match = shippingField.fieldValue.match(/(\d+)-?(\d+)?/);
      return match ? `${match[1]}-${match[2] || match[1]}` : '8-10';
    }
    return '8-10';
  }, [product?.additionalFieldProductValues]);

  return (
    <>
      <Breadcrumb prefixTitle="Products" list={product.crumbs ?? []} />
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 my-8 items-start">
          <div className="space-y-4">
            <ProductImageComponent
              productName={product.productName}
              productImages={sortedImages}
              outOfStock={product.outOfStock}
            />

            {/* Trust Badges - Desktop only, under gallery */}
            <div className="hidden lg:block">
              <TrustBadges />
            </div>
          </div>

          <div className="space-y-4">
            <Suspense fallback={<SliderSkeleton />}>
              <ProductDescriptionComponent
                product={product}
                handleScroll={scrollToElement}
                images={sortedImages}
                setImages={setImages}
                relatedProductsLink
              />
            </Suspense>

            {/* Order Timeline */}
            <OrderTimeline productionDays={productionTime} shippingDays={shippingTime} />
          </div>
        </div>

        {/* Trust Badges - Mobile only */}
        <div className="my-8 lg:hidden">
          <TrustBadges />
        </div>

        {/* Description Section */}
        <div ref={productDescriptionRef} className="flex flex-col md:flex-row gap-12 my-6">
          <div className="flex-1">
            <h4 className="text-2xl font-semibold mb-6">Overview</h4>
            <div
              id="product-overview"
              data-productid={product.id}
              className="product-description"
              dangerouslySetInnerHTML={{__html: formattedDescription}}
            />
          </div>

          <div className="hidden md:flex flex-col w-12">
            <div className="flex-1 bg-mute4/10 h-full w-1" />
          </div>

          <div className="flex-1">
            <h4 className="text-2xl font-semibold mb-6">Additional Information</h4>
            <div className="space-y-2">
              {product.additionalFieldProductValues?.map(({fieldName, fieldValue}) => (
                <Fragment key={fieldValue}>
                  <div className="product-additional-info-heading capitalize">
                    <strong>{fieldName.toLowerCase()}:</strong>
                  </div>
                  <ul>
                    <li className="text-mute2">
                      {fieldValue.includes('<table') ? (
                        <span
                          className="font-normal text-md text-base description-table"
                          dangerouslySetInnerHTML={{__html: fieldValue}}
                        />
                      ) : fieldValue ? (
                        <div
                          className="product-additional-info-value capitalize"
                          dangerouslySetInnerHTML={{__html: fieldValue.toLowerCase()}}
                        />
                      ) : (
                        <span className="font-normal text-md text-base text-mute2">N/A</span>
                      )}
                    </li>
                  </ul>
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="my-8">
          <ProductFAQ productId={product.id} />
        </div>

        {/* Customer Reviews */}
        <div className="my-8">
          <CustomerReviews
            productId={product.id}
            averageRating={product.averageRating}
            totalReviews={product.reviewCount}
          />
        </div>

        <Suspense fallback={<SliderSkeleton />}>
          <RelatedProductsSection relatedProducts={relatedProducts} />
        </Suspense>
      </Container>

      {/* Mobile Sticky CTA */}
      <MobileStickyCta product={product} />
    </>
  );
};
