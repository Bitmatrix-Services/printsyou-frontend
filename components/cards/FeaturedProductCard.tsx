import React, {FC, useState} from 'react';
import Link from 'next/link';
import Dialog from '@mui/material/Dialog';
import sanitizeHtml from 'sanitize-html';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import {PriceGrids, Product} from '@store/slices/product/product';
import {
  InformationCircleIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import CloseIcon from '@mui/icons-material/Close';
import ImageWithFallback from '@components/ImageWithFallback';
import {ClientSideFeaturedProductCard} from '@components/cards/client-side-feature-product-card.component';
import Image from 'next/image';
import CartModal from '@components/globals/CartModal';
import {useAppDispatch} from '@store/hooks';
import {setIsCartModalOpen} from '@store/slices/cart/cart.slice';

export interface FeaturedProductCardProps {
  product: Product;
  isModal?: boolean;
}

// const colors = [
//   {name: 'red', bgColor: 'bg-[#9C1F35]', selectedColor: 'ring-[#9C1F35]'},
//   {name: 'yellow', bgColor: 'bg-[#EDD146]', selectedColor: 'ring-[#EDD146]'},
//   {name: 'pink', bgColor: 'bg-[#EB84B0]', selectedColor: 'ring-[#EB84B0]'},
//   {name: 'black', bgColor: 'bg-[#333333]', selectedColor: 'ring-[#333333]'}
// ];

export const InnerFeaturedProductCard: FC<FeaturedProductCardProps> = ({
  isModal = true,
  product
}) => {
  const dispatch = useAppDispatch();
  const [isViewProductModalOpen, setIsViewProductModalOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState('');

  const countFrom: Set<PriceGrids['countFrom']> = new Set();
  const byRowTypeObjects: Record<
    PriceGrids['priceType'],
    PriceGrids['price'][]
  > = {};

  if (product) {
    product?.priceGrids?.length > 0 &&
      [...product.priceGrids]
        ?.sort((a, b) => a.countFrom - b.countFrom)
        .forEach(gridItem => {
          countFrom.add(gridItem.countFrom);
          if (!(gridItem.priceType in byRowTypeObjects)) {
            byRowTypeObjects[gridItem.priceType] = [];
          }
          byRowTypeObjects[gridItem.priceType].push(gridItem.price);
        });
  }

  return (
    <>
      <Link
        href={`/products/${product.uniqueProductName}`}
        className="group relative bg-white cursor-pointer"
      >
        <div className="min-h-[18rem] border border-[#edeff2]">
          {product?.priceGrids?.length > 0 &&
            [...product.priceGrids].sort((a, b) => b.countFrom - a.countFrom)[0]
              ?.salePrice > 0 && (
              <div className="prive-value inline-block bg-secondary-500 text-white py-1 px-3 text-sm font-light">
                <span className="deno">$</span>
                <span className="value">
                  <span className="sale line-through">
                    {[...product.priceGrids]
                      .sort((a, b) => b.countFrom - a.countFrom)[0]
                      ?.salePrice?.toFixed(2)}
                  </span>
                </span>
              </div>
            )}
          <div className="px-4 pb-4">
            <div className="flex my-4 justify-end">
              {/* <span className="text-xs text-[#888] mr-auto">Kids Section</span> */}
              {isModal && (
                <button
                  type="button"
                  onClick={e => {
                    setIsViewProductModalOpen(true);
                    e.preventDefault();
                  }}
                  className="text-xs font-semibold text-secondary-500 hover:text-secondary-600"
                >
                  Quick View
                </button>
              )}
            </div>
            <div
              title={product?.productName}
              className="line-clamp-2 mb-6 text-lg leading-snug font-semibold text-[#303541] text-center"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(product?.productName)
              }}
            ></div>
            <div className="block relative">
              <ImageWithFallback
                width={155}
                height={155}
                className="object-contain mx-auto"
                src={product?.productImages?.[0]?.imageUrl}
                alt="product"
              />
            </div>
          </div>
        </div>
        <div className="border border-[#edeff2] flex">
          <div className="py-2 px-3 mr-auto">
            <div className="as-low text-xs font-light text-black">
              AS LOW AS
            </div>
            <div className="prive-value flex items-end gap-1">
              <div className="prive-value flex items-end gap-1 text-[#444] text-lg font-semibold">
                <div>
                  <span className="deno">$</span>
                  <span className="value">
                    <span className="sale">
                      {(product.priceGrids ?? [])
                        .sort((a, b) => a.price - b.price)[0]
                        ?.price?.toFixed(2)}
                      <span className="font-normal text-mute2">/</span>
                    </span>
                    <span className="text-xs text-[#222] font-light">
                      Per Item
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={e => {
              e.preventDefault();
              dispatch(setIsCartModalOpen(true));
            }}
            // href={`/order_request?item_id=${product.id}`}
            className="h-16 w-8 md:w-16 flex items-center justify-center bg-white group-hover:bg-primary-500 group-hover:border-primary-500 border-l border-[#edeff2]"
          >
            <ShoppingCartIcon className="h-7 w-7" />
          </div>
        </div>
      </Link>
      {isModal && (
        <Dialog
          open={isViewProductModalOpen}
          onClose={() => setIsViewProductModalOpen(false)}
          classes={{paper: 'rounded-none min-w-[95%] xl:min-w-[62.5rem]'}}
        >
          <div className="sticky top-15 z-10 bg-white border-b border-[#ddd] py-3 px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 mr-auto">
                <Image
                  style={{minWidth: 22}}
                  width={22}
                  height={22}
                  src="/assets/bag-icon.png"
                  alt="shopping bag"
                />
                <span className="text-base font-semibold text-[#3F4646]">
                  Quick View
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsViewProductModalOpen(false)}
                className="text-[#A5A5A5]"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
          <div className="bg-white pt-6 px-8 pb-8">
            <div className="pt-6 px-8 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <figure className="col-span-2">
                  <div className="sticky top-15">
                    <div>
                      <span className="block relative aspect-square">
                        <ImageWithFallback
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          fill
                          className="object-contain"
                          src={
                            selectedGalleryImage !== ''
                              ? selectedGalleryImage
                              : product?.productImages?.[0]?.imageUrl
                          }
                          alt="product gallery mega"
                        />
                      </span>
                    </div>
                    <div className="gallery-container custom-scrollbar cursor-pointer flex flex-wrap col-span-2 gap-2">
                      {product?.productImages
                        ?.filter(item => !item.imageUrl.includes('/small/'))
                        .map((image, index) => (
                          <a
                            key={index}
                            onMouseLeave={() => setSelectedGalleryImage('')}
                            onMouseEnter={() =>
                              setSelectedGalleryImage(image.imageUrl)
                            }
                            className="gallery-item min-w-[3.75rem] w-[3.75rem] h-[3.75rem]"
                          >
                            <span className="block relative min-w-[3.75rem] w-[3.75rem] h-[3.75rem] border border-[#eceef1]">
                              <ImageWithFallback
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                fill
                                className="object-contain"
                                src={image.imageUrl}
                                alt="product gallery"
                              />
                            </span>
                          </a>
                        ))}
                    </div>
                  </div>
                </figure>
                <div className="flex flex-col col-span-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize text-[#3C4242]">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(product?.productName ?? '', {
                            allowedTags: ['p', 'span', 'td', 'b'],
                            allowedAttributes: {
                              span: ['style'],
                              td: ['style']
                            }
                          })
                        }}
                      ></span>
                    </h3>

                    {/* Color picker */}
                    {/* <div className="mt-4">
                    <h2 className="mb-3 text-sm font-medium text-[#3F4646]">
                      Colours Available{' '}
                    </h2>

                    <RadioGroup
                      value={selectedColor}
                      onChange={setSelectedColor}
                      className="mt-2"
                    >
                      <RadioGroup.Label className="sr-only">
                        Choose a color
                      </RadioGroup.Label>
                      <div className="flex items-center space-x-3">
                        {colors.map(color => (
                          <RadioGroup.Option
                            key={color.name}
                            value={color}
                            className={({active, checked}) =>
                              classNames(
                                color.selectedColor,
                                active && checked ? 'ring ring-offset-1' : '',
                                !active && checked ? 'ring-2' : '',
                                'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                              )
                            }
                          >
                            <RadioGroup.Label as="span" className="sr-only">
                              {color.name}
                            </RadioGroup.Label>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                color.bgColor,
                                'w-5 h-5 rounded-full border border-black border-opacity-10'
                              )}
                            />
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div> */}
                  </div>
                  {product && (
                    <div className="mt-5">
                      <h4 className="text-headingColor mb-3 text-lg font-normal capitalize inline-block border-b border-[#ddd] after:mt-1 after:block after:w-1/2 after:h-1 after:bg-primary-500">
                        Product Description
                      </h4>
                      <div
                        className="priceGridBody text-[#807D7E] marker:text-primary-500"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(product.productDescription)
                        }}
                      ></div>
                    </div>
                  )}
                  <div className="overflow-auto">
                    {product?.priceGrids?.length > 0 &&
                      [...product.priceGrids].sort(
                        (a, b) => a.countFrom - b.countFrom
                      )[0].countFrom !== 0 && (
                        <table className="w-full">
                          <tbody>
                            <tr className="one">
                              <td
                                className="headcell font-bold text-lg"
                                colSpan={countFrom.size + 1}
                              >
                                Pricing
                              </td>
                            </tr>
                            <tr className="one">
                              {Object.keys(byRowTypeObjects).length === 1 &&
                                Object.keys(byRowTypeObjects).map(
                                  item =>
                                    item &&
                                    item != 'null' && (
                                      <td key={item} className="headcell"></td>
                                    )
                                )}
                              {Array.from(countFrom).map(row => (
                                <td className="headcell" key={row}>
                                  {row} Items
                                </td>
                              ))}
                            </tr>
                            {Object.keys(byRowTypeObjects)
                              .sort((a: string, b: string) =>
                                a.localeCompare(b)
                              )
                              .map(row => {
                                return (
                                  <tr key={row} className="two">
                                    {row && row != 'null' && (
                                      <td className="pricecell font-bold text-left">
                                        {row}
                                      </td>
                                    )}
                                    {byRowTypeObjects[row].map(cell => (
                                      <td className="pricecell" key={cell}>
                                        {cell < 0.01 ? '-' : `$${cell}`}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      )}
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <div
                      // href={`/order_request?item_id=${product.id}`}
                      className="flex justify-center items-center gap-2 w-full text-center py-4 px-6 btn-primary"
                      onClick={() => setIsCartModalOpen(true)}
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                      <span className="text-sm font-light capitalize">
                        Add To Cart
                      </span>
                    </div>
                    <Link
                      href={`/more_info?item_id=${product.id}`}
                      className="flex justify-center items-center gap-2 w-full text-center py-4 px-6 text-headingColor border border-headingColor hover:text-white hover:bg-black rounded"
                    >
                      <InformationCircleIcon className="h-5 w-5" />
                      <span className="text-sm font-light capitalize">
                        More Info
                      </span>
                    </Link>
                  </div>
                  <div className="mt-10">
                    <h4 className="text-headingColor mb-3 text-lg font-normal capitalize inline-block border-b border-[#ddd] after:mt-1 after:block after:w-1/2 after:h-1 after:bg-primary-500">
                      Additional Information
                    </h4>
                    <div className="grid grid-cols-1  gap-2">
                      {product.additionalFieldProductValues?.map(item => (
                        <div key={item.fieldName} className=" mt-3">
                          <h4 className="mb-6 text-[1.375rem] unde text-[#3C4242] font-normal capitalize pl-4 border-l-2 border-primary-500">
                            {item.fieldName}
                          </h4>
                          <div className="ml-5">
                            {item.fieldValue.includes('<table') ? (
                              <span
                                className="font-normal text-md text-base description-table"
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtml(item.fieldValue)
                                }}
                              ></span>
                            ) : item.fieldValue ? (
                              <span className="font-normal text-md text-base text-mute2">
                                <ReactReadMoreReadLess
                                  charLimit={145}
                                  readMoreText={'Read more'}
                                  readLessText={'Read less'}
                                  readMoreClassName={'text-secondary-500'}
                                  readLessClassName={'text-secondary-500'}
                                >
                                  {item.fieldValue}
                                </ReactReadMoreReadLess>
                              </span>
                            ) : (
                              <span className="font-normal text-md text-base text-mute2">
                                N/A
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      <CartModal product={product} addToCartText={'Add to cart'} />
    </>
  );
};

export const FeaturedProductCard: FC<FeaturedProductCardProps> = ({
  ...props
}) => {
  return <ClientSideFeaturedProductCard {...props} />;
};
