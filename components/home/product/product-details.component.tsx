'use client';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import React, {FC, Fragment, Suspense, useEffect, useRef, useState} from 'react';
import {EnclosureProduct, Product, ProductImage} from '@components/home/product/product.types';
import {Container} from '@components/globals/container.component';
import {ProductImageComponent} from '@components/home/product/product-image-section.component';
import {ProductDescriptionComponent} from '@components/home/product/product-description-section.component';
import {notFound} from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import dynamic from 'next/dynamic';
import {SliderSkeleton} from '@components/home/home-component';

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

  const productDescriptionRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<ProductImage[]>([]);

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

  const scrollToElement = () => {
    if (productDescriptionRef.current) {
      productDescriptionRef.current.scrollIntoView({behavior: 'smooth'});
    }
  };
  return (
    <>
      {product ? (
        <>
          <Breadcrumb prefixTitle="Promotional Products" list={product.crumbs ?? []} />
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
              <ProductImageComponent
                productName={product.productName}
                productImages={images}
                outOfStock={product.outOfStock}
              />
              <ProductDescriptionComponent
                product={product}
                handleScroll={() => scrollToElement()}
                images={images}
                setImages={setImages}
                relatedProductsLink={true}
              />
            </div>

            {/* description section  */}

            <div ref={productDescriptionRef} className="flex flex-col md:flex-row gap-12 my-6">
              <div className="flex-1">
                <h4 className="text-2xl font-semibold mb-6">Overview</h4>

                <div
                  id="product-overview"
                  data-productid={product.id}
                  className="product-description"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(
                      (function () {
                        let description = product.productDescription;
                        if (!description.startsWith('<p')) {
                          description = '<p style="text-align: justify;">' + description;
                          description = description.replace('<ul>', '</p> <p>&nbsp;</p> <ul>');
                        } else if (!description.includes('<p>&nbsp;</p>')) {
                          description = description.replace('<ul>', '</p> <p>&nbsp;</p> <ul>');
                        }
                        return description;
                      })()
                    )
                  }}
                ></div>
              </div>

              <div className="hidden md:flex flex-col w-12">
                <div className="flex-1 bg-mute4/10 h-full w-1" />
              </div>

              <div className="flex-1">
                <h4 className="text-2xl font-semibold mb-6">Additional Information</h4>

                <div className="space-y-2">
                  {product.additionalFieldProductValues?.map(item => (
                    <Fragment key={item.fieldValue}>
                      <div className="product-additional-info-heading capitalize">
                        <strong>{item.fieldName.toLowerCase()}:</strong>
                      </div>
                      <ul>
                        <li className="text-mute2">
                          {item.fieldValue.includes('<table') ? (
                            <span
                              className="font-normal text-md text-base description-table"
                              dangerouslySetInnerHTML={{
                                __html: item.fieldValue
                              }}
                            ></span>
                          ) : item.fieldValue ? (
                            <div
                              className="product-additional-info-value capitalize"
                              dangerouslySetInnerHTML={{
                                __html: item.fieldValue.toLowerCase()
                              }}
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
            <Suspense fallback={<SliderSkeleton />}>
              <RelatedProductsSection relatedProducts={relatedProducts} />
            </Suspense>
          </Container>
        </>
      ) : (
        <div className="m-16 flex items-center justify-center">
          <h6>No Products Found</h6>
        </div>
      )}
    </>
  );
};
