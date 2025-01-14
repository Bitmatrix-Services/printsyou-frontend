'use client';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import React, {FC, Fragment, useEffect, useRef, useState} from 'react';
import {Product, ProductImage} from '@components/home/product/product.types';
import {Container} from '@components/globals/container.component';
import {ProductImageComponent} from '@components/home/product/product-image-section.component';
import {ProductDescriptionComponent} from '@components/home/product/product-description-section.component';
import {notFound} from 'next/navigation';
import sanitizeHtml from 'sanitize-html';

interface IProductDetails {
  product: Product | null;
  relatedProducts?: Product[];
}

export const ProductDetails: FC<IProductDetails> = ({product}) => {
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
              <ProductImageComponent productName={product.productName} productImages={images} />
              <ProductDescriptionComponent
                product={product}
                handleScroll={() => scrollToElement()}
                images={images}
                setImages={setImages}
              />
            </div>

            {/* description section  */}

            <div ref={productDescriptionRef} className="flex flex-col md:flex-row capitalize gap-12 my-6">
              <div className="flex-1">
                <h4 className="text-2xl font-semibold mb-6">overview</h4>

                <div
                  className="product-description"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(product.productDescription)
                  }}
                ></div>
              </div>

              <div className="hidden md:flex flex-col w-12">
                <div className="flex-1 bg-mute4/10 h-full w-1" />
              </div>

              <div className="flex-1">
                <h4 className="text-2xl font-semibold mb-6">additional information</h4>

                <div className="space-y-2">
                  {product.additionalFieldProductValues?.map(item => (
                    <Fragment key={item.fieldValue}>
                      <div>
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
                                className="product-additional-info-value"
                                dangerouslySetInnerHTML={{
                                  __html: item.fieldValue
                                }}
                              />
                            ) : (
                              <span className="font-normal text-md text-base text-mute2">N/A</span>
                            )}
                          </li>
                        </ul>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/*<ProductSliderSection title="related products" productList={relatedProducts} navNumber={1} />*/}

            {/* Rating review section  */}

            {/*<div className="my-8">*/}
            {/*  <div className="flex flex-col lg:flex-row lg:justify-between items-center lg:items-start gap-4">*/}
            {/*    <div className="flex-grow">*/}
            {/*      <h4 className="text-xl lg:text-2xl xl:text-3xl font-bold capitalize">Review</h4>*/}
            {/*    </div>*/}
            {/*  </div>*/}

            {/*  <div className="flex gap-6 items-center flex-col md:flex-row my-6">*/}
            {/*    <div className="flex flex-col justify-center items-center capitalize rounded-md bg-secondary-100/50 p-6">*/}
            {/*      <p className="text-5xl font-bold">4.7</p>*/}
            {/*      <div className=" flex mt-2 mb-4  gap-1">*/}
            {/*        <ViewRating rating={4.7} />*/}
            {/*      </div>*/}

            {/*      <p className=" text-sm font-medium ">*/}
            {/*        customer rating <span className="text-sm font-normal text-mute3">(934,516)</span>*/}
            {/*      </p>*/}
            {/*    </div>*/}

            {/*    <div className="flex-1 ">*/}
            {/*      <div className="flex gap-2 flex-col ">*/}
            {/*        {new Array(5).fill(0).map(rating => (*/}
            {/*          <div className="flex items-center" key={rating}>*/}
            {/*            {[1, 2, 3, 4, 5].map(rating => (*/}
            {/*              <IoMdStar key={rating} className="text-primary-500 w-6 h-6" />*/}
            {/*            ))}*/}
            {/*            <div className="w-2/4 h-1 mx-4 bg-gray-300 rounded-2 ">*/}
            {/*              <div className="h-1 w-[70%] bg-primary-500 rounded"></div>*/}
            {/*            </div>*/}
            {/*            <span className="text-sm font-medium text-gray-500">70%</span>*/}
            {/*          </div>*/}
            {/*        ))}*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/*<div className="flex flex-col gap-6">*/}
            {/*  <h4 className="text-2xl font-semibold">Customer feedback</h4>*/}

            {/*  {new Array(3).fill(0).map((item, i) => (*/}
            {/*    <CustomerReviewItem key={i} />*/}
            {/*  ))}*/}
            {/*</div>*/}

            {/* end Rating review section  */}
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
