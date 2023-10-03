import React from 'react';
import Container from '@components/globals/Container';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {ChevronRightIcon, HomeIcon} from '@heroicons/react/24/solid';
import lgZoom from 'lightgallery/plugins/zoom';

const LightGallery = dynamic(() => import('lightgallery/react'), {
  ssr: false
});
const imageUrls = [
  'https://www.identity-links.com/img/ucart/images/pimage/147330/001.jpg',
  'https://www.identity-links.com/img/ucart/images/p_photo1665689014/147330/popup.jpg',
  'https://www.identity-links.com/img/ucart/images/p_photo1665689015/147330/popup.jpg',
  'https://www.identity-links.com/img/ucart/images/p_photo1665689016/147330/popup.jpg',
  'https://www.identity-links.com/img/ucart/images/p_photo1665689017/147330/popup.jpg'
];

const ProductDetails = () => {
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
                  src={'/assets/product.jpg'}
                  alt="..."
                />
              </div>
              <div className="gallery-container">
                <LightGallery mode="lg-fade" plugins={[lgZoom]}>
                  {imageUrls.map((imageUrl, index) => (
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
                  ITEM#: <span className="text-primary-500">POP113</span>
                </h6>
                <h3 className="text-3xl my-5  font-semibold capitalize">
                  Promotional PopGrip Wood POPSockets
                </h3>
              </div>
              <div className="mb-12">
                <h4 className="text-xl font-bold capitalize py-[19px]">
                  Description
                </h4>
                <ul className="text-sm space-y-3 text-[#757a84] pl-5 list-disc marker:text-[#febe40] marker:text-lg">
                  <li>
                    Get on the latest trend bandwagon with our custom printed
                    PopGrip Wood&nbsp;POPSockets!
                  </li>
                  <li>
                    Our PopGrip Wood sticks flat to the back of your phone,
                    tablet or case with its easy to rinse and repositional
                    gel.&nbsp;
                  </li>
                  <li>
                    Once extended, the&nbsp;PopGrip Wood becomes a media stand
                    for your device, a photo or texting grip, or simply lower it
                    for a video chat.
                  </li>
                  <li>
                    This item can be used on the back of any brand phone.&nbsp;
                  </li>
                  <li>
                    Available in Bamboo and Rosewood, the unique wood finish
                    lends perfectly to a classic laser engraving
                  </li>
                  <li>
                    Custom PopGrip Backer Cards available at an addition cost.
                    Call for additional pricing.{' '}
                  </li>
                </ul>
              </div>
              <div className="mt-8 overflow-auto">
                <table className="w-full">
                  <tbody>
                    <tr className="one">
                      <td className="headcell">50</td>
                      <td className="headcell">100</td>
                      <td className="headcell">500</td>
                      <td className="headcell">1000</td>
                    </tr>
                    <tr className="two">
                      <td className="pricecell">
                        <div className="prive-value flex items-end gap-1">
                          <div className="deno font-semibold text-xl">$</div>
                          <div className="value font-semibold text-3xl font-oswald">
                            <span className="sale">11.65</span>
                          </div>
                        </div>
                      </td>
                      <td className="pricecell">
                        <div className="prive-value flex items-end gap-1">
                          <div className="deno font-semibold text-xl">$</div>
                          <div className="value font-semibold text-3xl font-oswald">
                            <span className="sale">11.82</span>
                          </div>
                        </div>
                      </td>
                      <td className="pricecell">
                        <div className="prive-value flex items-end gap-1">
                          <div className="deno font-semibold text-xl">$</div>
                          <div className="value font-semibold text-3xl font-oswald">
                            <span className="sale">11.73</span>
                          </div>
                        </div>
                      </td>
                      <td className="pricecell">
                        <div className="prive-value flex items-end gap-1">
                          <div className="deno font-semibold text-xl">$</div>
                          <div className="value font-semibold text-3xl font-oswald">
                            <span className="sale">11.65</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 w-full bg-greyLight rounded-xl">
                <ul className="text-xs text-mute3 font-bold product-card__categories">
                  <li>
                    <span className="pt-[2px] block">
                      Please add <span className="text-red-500">$30.00</span>{' '}
                      Setup Fee
                    </span>
                  </li>
                  <li>
                    <span className="pt-[2px] block">
                      Please add <span className="text-red-500">$95.00</span>{' '}
                      Full Color Set Up Fee
                    </span>
                  </li>
                  <li>
                    <span className="pt-[2px] block">
                      Please add <span className="text-red-500">$0.65</span>{' '}
                      Full Color Imprint
                    </span>
                  </li>
                  <li>
                    <span className="pt-[2px] block">
                      Please add <span className="text-red-500">$0.25</span>{' '}
                      Additional Spot Color Imprint
                    </span>
                  </li>
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
                  <table className="w-full border-separate border-spacing-y-12 ">
                    <tbody>
                      <tr className="border-b border-black pb-5">
                        <td className="label">
                          <b className="brown">Approximate Size: </b>
                        </td>
                        <td>
                          Expanded: 1.53&quot; x 1.53&quot; x 0.9&quot; <br />
                          Collapsed: 1.53&quot; x 1.53&quot; x 0.26&quot;
                        </td>
                      </tr>
                      <tr className="mb-[50px] border-b border-black">
                        <td className="label">
                          <b className="brown">Colors Available: </b>
                        </td>
                        <td>Bamboo, Rosewood</td>
                      </tr>

                      <tr>
                        <td className="label">
                          <b className="brown">Imprint Area: </b>
                        </td>
                        <td>1.3&quot; Diameter</td>
                      </tr>
                      <tr>
                        <td className="label">
                          <b className="brown">Price Includes: </b>
                        </td>
                        <td>One Location Laser Engrave</td>
                      </tr>
                    </tbody>
                  </table>
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
