import React, {FC, useState} from 'react';
import Link from 'next/link';
import Dialog from '@mui/material/Dialog';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dynamic from 'next/dynamic';
import lgZoom from 'lightgallery/plugins/zoom';
import sanitizeHtml from 'sanitize-html';
import {Product} from '@store/slices/product/product';
import {ShoppingBagIcon} from '@heroicons/react/24/outline';
import CloseIcon from '@mui/icons-material/Close';
import {getProductDescription, getProductPriceGridTable} from '@utils/utils';
import ImageWithFallback from '@components/ImageWithFallback';
import {ClientSideFeaturedProductCard} from '@components/cards/client-side-feature-product-card.component';

const LightGallery = dynamic(() => import('lightgallery/react'), {
  ssr: false
});

export interface FeaturedProductCardProps {
  product: Product;
  isModal?: boolean;
}

export const InnerFeaturedProductCard: FC<FeaturedProductCardProps> = ({
  isModal = true,
  product
}) => {
  const [isViewProductModalOpen, setIsViewProductModalOpen] = useState(false);

  return (
    <>
      <Link
        href={`products/${product.uniqueProductName}`}
        className="tp-product group relative bg-white cursor-pointer"
      >
        <div className="p-6 min-h-[21.40rem] border border-[#edeff2]">
          <div className="block relative h-48 w-48 mx-auto group">
            {isModal && (
              <button
                onClick={e => {
                  setIsViewProductModalOpen(true);
                  e.preventDefault();
                }}
                type="button"
                className="h-[3.125rem] w-[3.125rem] bg-primary-500 hover:bg-body text-white bg-center bg-no-repeat transition-all duration-300 absolute z-20 top-0 left-0 opacity-0 group-hover:opacity-100"
                style={{
                  backgroundImage: 'url("/assets/icon-search-white.png")',
                  backgroundSize: '24px auto'
                }}
              />
            )}

            <ImageWithFallback
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              className="object-contain"
              src={product?.productImages?.[0]?.imageUrl}
              alt="product"
            />
          </div>
          <div
            className={`block mt-4  ${
              isModal
                ? 'text-xl font-extrabold min-h-[60px] text-center'
                : 'text-[18px] font-semibold text-[#303541] text-center'
            } `}
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(product?.productName)
            }}
          ></div>
        </div>
        <div className="border border-[#edeff2] flex">
          <div className="py-2 flex-1 flex gap-3 items-center px-5 group-hover:bg-primary-500 group-hover:text-white">
            <div className="as-low text-xs font-semibold mr-auto">
              AS LOW AS
            </div>
            <div className="prive-value flex items-end gap-1">
              {[...product.priceGrids].sort(
                (a, b) => b.countFrom - a.countFrom
              )[0]?.salePrice > 0 && (
                <div className="prive-value flex items-end gap-1">
                  <div className="deno font-semibold text-lg">$</div>
                  <div className="value font-bold text-2xl font-oswald">
                    <span className="sale line-through">
                      {[...product.priceGrids]
                        .sort((a, b) => b.countFrom - a.countFrom)[0]
                        ?.salePrice?.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="prive-value flex items-end gap-1">
                <div className="deno font-semibold text-xl">$</div>
                <div className="value font-semibold text-2xl xl:text-4xl font-oswald">
                  <span className="sale">
                    {(product.priceGrids ?? [])
                      .sort((a, b) => a.price - b.price)[0]
                      .price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Link
            href={`/order_request?item_id=${product.id}`}
            className="h-16 w-16 flex items-center justify-center bg-white group-hover:bg-black group-hover:border-black group-hover:text-white border-l border-[#edeff2]"
          >
            <ShoppingBagIcon className="h-7 w-7" />
          </Link>
        </div>
      </Link>
      {isModal && (
        <Dialog
          open={isViewProductModalOpen}
          onClose={() => setIsViewProductModalOpen(false)}
          classes={{paper: 'rounded-none min-w-[95%] xl:min-w-[62.5rem]'}}
        >
          <div className="p-3 mb-3 text-end">
            <button
              type="button"
              onClick={() => setIsViewProductModalOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <figure>
                <div className="max-w-sm">
                  <h6 className="mb-2 text-sm font-semibold text-body">
                    ITEM#:{' '}
                    <span className="text-primary-500">{product?.sku}</span>
                  </h6>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize">
                    {product?.prefix} {product?.productName}
                  </h3>
                </div>
                <div className="mt-4 overflow-auto">
                  {product?.priceGrids &&
                  [...product.priceGrids].sort(
                    (a, b) => a.countFrom - b.countFrom
                  )[0].countFrom !== 0 ? (
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
                                      <span className="sale">
                                        {row.price.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              ))}
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    product && (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                              getProductPriceGridTable(
                                product.productDescription
                              )?.heading?.outerHTML ?? '',
                              {
                                allowedTags: ['p', 'span', 'td', 'b'],
                                allowedAttributes: {
                                  span: ['style'],
                                  td: ['style']
                                }
                              }
                            )
                          }}
                        ></div>
                        <div
                          className="border"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                              getProductPriceGridTable(
                                product.productDescription
                              )?.priceTable?.outerHTML ?? '',
                              {
                                allowedTags: [
                                  'table',
                                  'tbody',
                                  'tr',
                                  'span',
                                  'td',
                                  'br',
                                  'b'
                                ],
                                allowedAttributes: {
                                  span: ['style'],
                                  td: ['style']
                                }
                              }
                            )
                          }}
                        ></div>
                      </>
                    )
                  )}
                </div>
                <div className="mt-4 w-full bg-[#f6f7f8] p-4 rounded-xl">
                  <ul className="text-xs text-mute3 font-bold product-card__categories">
                    {product?.additionalRows &&
                      [...product.additionalRows]
                        ?.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                        .map(row => (
                          <li key={row.id}>
                            <span className="pt-[2px] block">
                              Please add{' '}
                              <span className="text-red-500">
                                ${row.priceDiff.toFixed(2)}
                              </span>{' '}
                              {row.name}
                            </span>
                          </li>
                        ))}
                  </ul>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/order_request?item_id=${product.id}`}
                    className="block w-full text-center uppercase py-5 px-8 text-white bg-primary-500 hover:bg-body border border-[#eaeaec] text-sm font-bold"
                  >
                    PLACE ORDER
                  </Link>
                  <Link
                    href={`/more_info?item_id=${product.id}`}
                    className="block w-full text-center uppercase py-5 px-8 text-body bg-white hover:bg-body hover:text-white border border-[#eaeaec] text-sm font-bold"
                  >
                    REQUEST MORE INFO
                  </Link>
                </div>
              </figure>
              <figure className="order-first lg:order-last">
                <div>
                  <LightGallery mode="lg-fade" plugins={[lgZoom]}>
                    <a
                      className="cursor-pointer"
                      data-src={
                        product?.productImages?.[0]
                          ? `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${product.productImages[0].imageUrl}`
                          : ''
                      }
                    >
                      <span className="block relative aspect-square">
                        <ImageWithFallback
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          fill
                          className="object-contain"
                          src={product?.productImages?.[0]?.imageUrl}
                          alt=""
                        />
                      </span>
                    </a>
                  </LightGallery>
                </div>
                <div className="gallery-container">
                  <LightGallery mode="lg-fade" plugins={[lgZoom]}>
                    {product?.productImages?.map((image, index) => (
                      <a
                        key={index}
                        className="gallery-item cursor-pointer min-w-[6.25rem] w-[6.25rem] h-[6.25rem]"
                        data-src={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${image.imageUrl}`}
                      >
                        <span className="block relative aspect-square border border-[#eceef1]">
                          <ImageWithFallback
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            fill
                            className="object-contain"
                            src={image.imageUrl}
                            alt=""
                          />
                        </span>
                      </a>
                    ))}
                  </LightGallery>
                </div>
              </figure>
            </div>
            {/*  Accordion */}
            <div className="mt-6">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h4 className="text-xl font-bold capitalize">Description</h4>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="px-4">
                    <ul className="text-sm space-y-1 pb-4 pl-5 list-disc marker:text-[#febe40] marker:text-lg">
                      {product &&
                        getProductDescription(product.productDescription)?.map(
                          row => <li key={row}>{row}</li>
                        )}
                    </ul>
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <h4 className="text-xl font-bold capitalize">
                    Additional Information
                  </h4>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="overflow-auto">
                    <div className="w-full">
                      {product?.additionalFieldProductValues?.map(row => (
                        <div
                          className="px-4 pb-4 flex flex-col md:flex-row gap-4"
                          key={row.fieldValue}
                        >
                          <span className="label min-w-[300px]">
                            <b className="brown">{row.fieldName}: </b>
                          </span>
                          <span className="flex-1 text-left">
                            {row.fieldValue}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export const FeaturedProductCard: FC<FeaturedProductCardProps> = ({
  ...props
}) => {
  return <ClientSideFeaturedProductCard {...props} />;
};
