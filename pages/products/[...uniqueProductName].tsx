import React, {FC, useState} from 'react';
import Container from '@components/globals/Container';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';

import {GetServerSidePropsContext} from 'next';
import {PriceGrids, Product} from '@store/slices/product/product';
import {http} from 'services/axios.service';
import Breadcrumb from '@components/globals/Breadcrumb';
import {useRouter} from 'next/router';
import ImageWithFallback from '@components/ImageWithFallback';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';
import {resend} from 'pages/_app';
import getConfig from 'next/config';
import {ShoppingCartIcon} from '@heroicons/react/24/outline';

const config = getConfig();

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: FC<ProductDetailsProps> = ({product}) => {
  const [selectedGalleryImage, setSelectedGalleryImage] = useState('');
  const router = useRouter();

  const countFrom: Set<PriceGrids['countFrom']> = new Set();
  const byRowTypeObjects: Record<
    PriceGrids['priceType'],
    PriceGrids['price'][]
  > = {};

  product.priceGrids
    .sort((a, b) => a.countFrom - b.countFrom)
    .forEach(gridItem => {
      countFrom.add(gridItem.countFrom);
      if (!(gridItem.priceType in byRowTypeObjects)) {
        byRowTypeObjects[gridItem.priceType] = [];
      }
      byRowTypeObjects[gridItem.priceType].push(gridItem.price);
    });

  return (
    <>
      <NextSeo
        title={`${product.metaTitle || product.productName} | ${
          metaConstants.SITE_NAME
        }`}
        description={product.metaDescription || ''}
        openGraph={{
          images: (product.productImages || []).map(value => ({
            url: `${config.publicRuntimeConfig.ASSETS_SERVER_URL}${value.imageUrl}`
          }))
        }}
      />
      <Container>
        <div className="px-8 py-8">
          <div className="flex text-[10px] sm:text-sm md:text-[10px] lg:text-sm font-medium mb-6 items-center text-[#787b82]">
            <Breadcrumb
              prefixTitle="Promotional Products"
              queryParams={
                Array.isArray(router.query?.uniqueProductName)
                  ? router.query?.uniqueProductName
                  : []
              }
            />
          </div>
          <div className="bg-grey pt-6 px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* <div className="flex">
                <div className="gallery-container custom-scrollbar overflow-auto h-[95%] min-w-[15%] ">
                  {product?.productImages?.map((image, index) => (
                    <a
                      onMouseLeave={() => setSelectedGalleryImage('')}
                      onMouseEnter={() =>
                        setSelectedGalleryImage(image.imageUrl)
                      }
                      key={index}
                      className="gallery-item cursor-pointer min-w-[3.75rem] w-[3.75rem] h-[3.75rem]"
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
                </div>
                <div className="block relative aspect-square cursor-pointer w-[85%]">
                  <ImageWithFallback
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="object-contain"
                    src={
                      selectedGalleryImage !== ''
                        ? selectedGalleryImage
                        : product?.productImages?.[0]?.imageUrl
                    }
                    alt=""
                  />
                </div>
              </div> */}
              <figure>
                <div>
                  <a className="cursor-pointer">
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
                  </a>
                </div>
                <div className="gallery-container custom-scrollbar flex flex-wrap">
                  {product?.productImages?.map((image, index) => (
                    <a
                      key={index}
                      onMouseLeave={() => setSelectedGalleryImage('')}
                      onMouseEnter={() =>
                        setSelectedGalleryImage(image.imageUrl)
                      }
                      className="gallery-item cursor-pointer min-w-[3.75rem] w-[3.75rem] h-[3.75rem]"
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
              </figure>
              <div className="flex flex-col">
                <div className="max-w-sm">
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
                                item => item && <td className="headcell"></td>
                              )}
                            {Array.from(countFrom).map(row => (
                              <td className="headcell" key={row}>
                                {row} Items
                              </td>
                            ))}
                          </tr>
                          {Object.keys(byRowTypeObjects)
                            .sort((a: string, b: string) => a.localeCompare(b))
                            .map(row => {
                              return (
                                <tr key={row} className="two">
                                  {row && (
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
                <div className="pt-4 mt-auto flex flex-col sm:flex-row gap-3">
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
              </div>
            </div>
            <div className="mt-10">
              <h4 className="mb-6 text-[1.375rem] text-[#3C4242] font-normal capitalize pl-4 border-l-2 border-primary-500">
                Additional Information
              </h4>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {product.additionalFieldProductValues?.map(item => (
                  <div key={item.fieldName} className="col">
                    <h4 className="font-semibold mb-3">{item.fieldName}</h4>
                    <div className="font-normal text-base">
                      {item.fieldValue.includes('<table') ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(item.fieldValue)
                          }}
                        ></span>
                      ) : (
                        item.fieldValue
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const uniqueProductName = context.params?.uniqueProductName;

  try {
    let product = {};

    if (Array.isArray(uniqueProductName)) {
      const {data} = await http.get(
        `product?uProductName=${uniqueProductName.join('/')}`
      );
      product = data.payload;
    }

    return {props: {product}};
  } catch (error) {
    // if (Array.isArray(uniqueProductName)) {
    //   await resend.emails.send({
    //     from: 'onboarding@resend.dev',
    //     to: [
    //       'awais.tariqq@gmail.com',
    //       'saimali78941@gmail.com',
    //       'abdul.wahab394.aw@gmail.com'
    //     ],
    //     subject: 'Error in Product',
    //     html: `<h3>unique name of the product</h3>
    //   <h3>${uniqueProductName.join('/')}</h3>
    //   <h3>Error: ${error}</h3>`
    //   });
    // }
  }
};

export default ProductDetails;
