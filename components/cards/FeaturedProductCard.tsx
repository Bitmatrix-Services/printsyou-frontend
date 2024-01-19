import React, {FC, useState} from 'react';
import Link from 'next/link';
import Dialog from '@mui/material/Dialog';
import dynamic from 'next/dynamic';
import lgZoom from 'lightgallery/plugins/zoom';
import sanitizeHtml from 'sanitize-html';
import {Product} from '@store/slices/product/product';
import {ShoppingCartIcon} from '@heroicons/react/24/outline';
import CloseIcon from '@mui/icons-material/Close';
import ImageWithFallback from '@components/ImageWithFallback';
import {ClientSideFeaturedProductCard} from '@components/cards/client-side-feature-product-card.component';
import getConfig from 'next/config';
import Image from 'next/image';
import {ChevronRightIcon} from '@heroicons/react/24/solid';
import {RadioGroup} from '@headlessui/react';
import ApproxTabView from '@components/tabsData/ApproxTabView';

const config = getConfig();

const LightGallery = dynamic(() => import('lightgallery/react'), {
  ssr: false
});

export interface FeaturedProductCardProps {
  product: Product;
  isModal?: boolean;
}

const pages = [{name: 'Women'}, {name: 'Bag'}];

const colors = [
  {name: 'red', bgColor: 'bg-[#9C1F35]', selectedColor: 'ring-[#9C1F35]'},
  {name: 'yellow', bgColor: 'bg-[#EDD146]', selectedColor: 'ring-[#EDD146]'},
  {name: 'pink', bgColor: 'bg-[#EB84B0]', selectedColor: 'ring-[#EB84B0]'},
  {name: 'black', bgColor: 'bg-[#333333]', selectedColor: 'ring-[#333333]'}
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const InnerFeaturedProductCard: FC<FeaturedProductCardProps> = ({
  isModal = true,
  product
}) => {
  const [isViewProductModalOpen, setIsViewProductModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [activeTab, setActiveTab] = useState('Approx. Size');

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Link
        href={`products/${product.uniqueProductName}`}
        className="group relative bg-white cursor-pointer"
      >
        <div className="min-h-[21.40rem] border border-[#edeff2]">
          {[...product.priceGrids].sort((a, b) => b.countFrom - a.countFrom)[0]
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
            <div className="flex gap-2 mt-4 mb-4">
              <span className="text-xs text-[#888] mr-auto">Kids Section</span>
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
                      /
                    </span>
                    <span className="text-xs text-[#222] font-light">
                      Per Item
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Link
            href={`/order_request?item_id=${product.id}`}
            className="h-16 w-16 flex items-center justify-center bg-white group-hover:bg-primary-500 group-hover:border-primary-500 border-l border-[#edeff2]"
          >
            <ShoppingCartIcon className="h-7 w-7" />
          </Link>
        </div>
      </Link>
      {isModal && (
        <Dialog
          open={isViewProductModalOpen}
          onClose={() => setIsViewProductModalOpen(false)}
          classes={{paper: 'rounded-none min-w-[95%] xl:min-w-[62.5rem]'}}
        >
          <div className="sticky top-0 z-10 bg-white border-b border-[#ddd] py-3 px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 mr-auto">
                <Image
                  style={{minWidth: 22}}
                  width={22}
                  height={22}
                  src="/assets/bag-icon.png"
                  alt="..."
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
          <div className="bg-grey pt-6 px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <figure>
                <div>
                  <LightGallery mode="lg-fade" plugins={[lgZoom]}>
                    <a
                      className="cursor-pointer"
                      data-src={
                        product?.productImages?.[0]
                          ? `${config.publicRuntimeConfig.ASSETS_SERVER_URL}${product.productImages[0].imageUrl}`
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
                <div className="gallery-container custom-scrollbar">
                  <LightGallery mode="lg-fade" plugins={[lgZoom]}>
                    {product?.productImages?.map((image, index) => (
                      <a
                        key={index}
                        className="gallery-item cursor-pointer min-w-[3.75rem] w-[3.75rem] h-[3.75rem]"
                        data-src={`${config.publicRuntimeConfig.ASSETS_SERVER_URL}${image.imageUrl}`}
                      >
                        <span className="block relative min-w-[3.75rem] w-[3.75rem] h-[3.75rem] border border-[#eceef1]">
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
              <figure>
                <div className="max-w-sm">
                  <nav className="flex mb-4">
                    <ol role="list" className="flex items-center space-x-4">
                      <li>
                        <div>
                          <span className="text-xs font-medium text-[#807D7E]">
                            <span>Shop</span>
                          </span>
                        </div>
                      </li>
                      {pages.map(page => (
                        <li key={page.name}>
                          <div className="flex items-center">
                            <ChevronRightIcon
                              className="h-4 w-4 flex-shrink-0 text-[#807D7E]"
                              aria-hidden="true"
                            />
                            <span className="ml-4 text-xs font-medium text-[#807D7E]">
                              {page.name}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </nav>

                  {/* <h6 className="mb-2 text-sm font-semibold text-body">
                    ITEM#:{' '}
                    <span className="text-primary-500">{product?.sku}</span>
                  </h6> */}
                  {/* <span>{product?.prefix}</span> */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize text-[#3C4242]">
                    <span
                      className="line-clamp-2"
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
                  <div className="mt-4">
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
                  </div>
                </div>
                {product && (
                  <div className="mt-5">
                    <h5 className="mb-2 text-[#3C4242] text-lg capitalize">
                      Product Description
                    </h5>
                    <div
                      className="priceGridBody text-[#807D7E] marker:text-primary-500"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(product.productDescription)
                      }}
                    ></div>
                  </div>
                )}
                <div className="overflow-auto">
                  {product?.priceGrids &&
                    [...product.priceGrids].sort(
                      (a, b) => a.countFrom - b.countFrom
                    )[0].countFrom !== 0 && (
                      <table className="w-full">
                        <tbody>
                          <tr className="one">
                            {[...product.priceGrids]
                              .sort((a, b) => a.countFrom - b.countFrom)
                              .map(row => (
                                <td className="headcell" key={row.id}>
                                  {row.countFrom} Items
                                </td>
                              ))}
                          </tr>
                          <tr className="two">
                            {product?.priceGrids &&
                              [...product.priceGrids]
                                .sort((a, b) => a.countFrom - b.countFrom)
                                .map(row => (
                                  <td className="pricecell" key={row.id}>
                                    <div className="prive-value flex items-end justify-center gap-1 text-lg font-bold text-headingColor">
                                      <div className="value">
                                        <span className="sale">
                                          ${row.price?.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="prive-value flex items-end justify-center gap-1 text-sm font-normal text-[#888]">
                                      <div className="value line-through">
                                        <span className="sale">
                                          ${row.price?.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                ))}
                          </tr>
                        </tbody>
                      </table>
                    )}
                </div>
                {/* <div className="mt-4 w-full bg-[#f6f7f8] p-4 rounded-xl">
                  <ul className="text-xs text-mute3 font-bold product-card__categories">
                    {product?.additionalRows &&
                      [...product.additionalRows]
                        ?.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                        .map(row => (
                          <li key={row.id}>
                            <span className="pt-[2px] block">
                              Please add{' '}
                              <span className="text-red-500">
                                ${row.priceDiff?.toFixed(2)}
                              </span>{' '}
                              {row.name}
                            </span>
                          </li>
                        ))}
                  </ul>
                </div> */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/order_request?item_id=${product.id}`}
                    className="flex justify-center items-center gap-2 w-full text-center py-2 px-6 btn-primary"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span className="text-sm font-light capitalize">
                      Place Order
                    </span>
                  </Link>
                  <Link
                    href={`/more_info?item_id=${product.id}`}
                    className="block w-full text-center uppercase py-2 px-6 text-headingColor border border-headingColor hover:text-white hover:bg-black rounded"
                  >
                    <span className="text-sm font-semibold capitalize">
                      More Info
                    </span>
                  </Link>
                </div>
              </figure>
            </div>
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="col">
                <div>
                  <h4 className="mb-6 text-[1.375rem] text-[#3C4242] font-normal capitalize pl-4 border-l-2 border-primary-500">
                    Additional Information
                  </h4>
                  <div className="flex flex-wrap gap-6 pb-6">
                    {['Approx. Size', 'Colors Available', 'Price Includes'].map(
                      tab => (
                        <button
                          key={tab}
                          className={`tab-link-2 ${
                            activeTab === tab ? 'active' : ''
                          }`}
                          type="button"
                          onClick={() => handleTabClick(tab)}
                        >
                          {tab}
                        </button>
                      )
                    )}
                  </div>
                  <div>
                    {activeTab === 'Approx. Size' && <ApproxTabView />}
                    {activeTab === 'Colors Available' && <div>hello</div>}
                    {activeTab === 'Price Includes' && <div>hello</div>}
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="h-full flex flex-col">
                  <div className="mt-auto bg-white aspect-video rounded-2xl">
                    <img
                      className="h-full w-full rounded-2xl"
                      src="https://images.unsplash.com/photo-1682685797898-6d7587974771?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=".."
                    />
                  </div>
                </div>
              </div>
            </div>
            {/*  Accordion */}
            {/* <div className="mt-6">
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
                          <span
                            className="flex-1 text-left"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(row.fieldValue ?? '', {
                                allowedTags: ['p', 'span', 'td', 'b'],
                                allowedAttributes: {
                                  span: ['style'],
                                  td: ['style']
                                }
                              })
                            }}
                          ></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div> */}
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
