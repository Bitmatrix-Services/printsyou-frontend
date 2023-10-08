import React from 'react';
import Container from '@components/globals/Container';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {ChevronRightIcon, HomeIcon} from '@heroicons/react/24/solid';
import lgZoom from 'lightgallery/plugins/zoom';
import {useRouter} from 'next/router';

import {getProductDescription, getProductImage} from '@utils/utils';

const LightGallery = dynamic(() => import('lightgallery/react'), {
  ssr: false
});

const ProductDetails = () => {
  const {query} = useRouter();

  const product = JSON.parse(query.product);

  console.log('product', product);

  return (
    <>
      <Container>
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <figure className="order-first ">
              <div>
                <div className="flex text-[10px] sm:text-sm md:text-[10px] lg:text-sm font-medium mb-6 items-center text-[#787b82]">
                  <Link href={'/'}>
                    <HomeIcon className="h-4 w-4 mr-1 text-[#febe40] " />
                  </Link>
                  <div>
                    <ChevronRightIcon className="h-3 w-3 mr-1 " />
                  </div>
                  <Link className=" mr-1 " href={'/'}>
                    Promotional Products
                  </Link>
                  <div>
                    <ChevronRightIcon className="h-3 w-3 mr-1 " />
                  </div>
                  <Link className=" mr-1 " href={'/'}>
                    Technology & Mobile
                  </Link>
                  <div>
                    <ChevronRightIcon className="h-3 w-3 mr-1 " />
                  </div>
                  <div className="text-[#303541]">Apparel</div>
                </div>
              </div>
              <div className="md:pt-8">
                <Image
                  sizes=""
                  style={{position: 'relative'}}
                  layout="resposive"
                  width={437}
                  height={281}
                  className="object-contain w-[85%]"
                  src={getProductImage(product.productImages)}
                  alt="..."
                />
              </div>
              <div className="gallery-container">
                <LightGallery mode="lg-fade" plugins={[lgZoom]}>
                  {product.productImages?.map((imageUrl, index) => (
                    <a
                      key={index}
                      className="gallery-item cursor-pointer min-w-[6.25rem] w-[6.25rem] h-[6.25rem]"
                      data-src={imageUrl}
                    >
                      <span className="block relative aspect-square border border-[#eceef1]">
                        <Image
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          fill
                          className="object-contain"
                          src={imageUrl}
                          alt={`gallery-image-${index}`}
                        />
                      </span>
                    </a>
                  ))}
                </LightGallery>
              </div>
            </figure>
            <figure className="pt-8">
              <div className="mb-10">
                <h6 className="mb-4 text-sm font-semibold text-body">
                  ITEM#: <span className="text-primary-500">{product.sku}</span>
                </h6>
                <h3 className="text-3xl my-5  font-semibold capitalize">
                  {product.prefix} {product.productName}
                </h3>
              </div>
              <div className="mb-12">
                <h4 className="text-xl font-bold capitalize py-[19px]">
                  Description
                </h4>
                <ul className="text-sm space-y-3 text-[#757a84] pl-5 list-disc marker:text-[#febe40] marker:text-lg">
                  {getProductDescription(product.productDescription)?.map(
                    row => <li key={row}>{row}</li>
                  )}
                </ul>
              </div>
              {product?.priceGrids &&
                [...product.priceGrids].sort(
                  (a, b) => a.countFrom - b.countFrom
                )[0].countFrom !== 0 && (
                  <div className="mt-4 overflow-auto">
                    <table className="w-full">
                      <tbody>
                        <tr className="one">
                          {[...product.priceGrids]
                            .sort((a, b) => a.countFrom - b.countFrom)
                            .map(row => (
                              <td className="headcell" key={row.id}>
                                {row.countFrom}
                              </td>
                            ))}
                        </tr>
                        <tr className="two">
                          {product?.priceGrids &&
                            [...product.priceGrids]
                              .sort((a, b) => a.countFrom - b.countFrom)
                              .map(row => (
                                <td className="pricecell" key={row.id}>
                                  <div className="prive-value flex items-end justify-center gap-1">
                                    <div className="deno font-semibold text-xl">
                                      $
                                    </div>
                                    <div className="value font-semibold text-3xl font-oswald">
                                      <span className="sale">{row.price}</span>
                                    </div>
                                  </div>
                                </td>
                              ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              <div className="mt-4 p-4 w-full bg-greyLight rounded-xl">
                <ul className="text-xs text-mute3 font-bold product-card__categories">
                  {product.additionalRows
                    .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                    .map(row => (
                      <li key={row.id}>
                        <span className="pt-[2px] block">
                          Please add{' '}
                          <span className="text-red-500">${row.priceDiff}</span>{' '}
                          {row.name}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="#!"
                  className="block w-full text-center py-5 px-8 text-white bg-primary-500 hover:bg-body border border-[#eaeaec] text-sm font-bold"
                >
                  PLACE ORDER
                </Link>
                <Link
                  href="#!"
                  className="block w-full text-center py-5 px-8 text-body bg-white hover:bg-body hover:text-white border border-[#eaeaec] text-sm font-bold"
                >
                  REQUEST MORE INFO
                </Link>
              </div>
              <div className="mt-12">
                <h4 className="text-xl font-bold capitalize py-[19px]">
                  Additional Information
                </h4>
                <div className="overflow-auto">
                  {product.additionalFieldProductValues?.map(row => (
                    <div className="px-4 pb-4 flex" key={row.fieldValue}>
                      <span className="label flex-1">
                        <b className="brown">{row.fieldName}: </b>
                      </span>
                      <span className="flex-auto text-left">
                        {row.fieldValue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </figure>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ProductDetails;
