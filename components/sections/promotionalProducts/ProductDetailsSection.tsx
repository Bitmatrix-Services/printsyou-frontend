import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ChevronRightIcon, HomeIcon} from '@heroicons/react/24/solid';
import ProductSubCategoriesSection from './ProductSubCategoriesSection';
import ProductsSection from '../specials/ProductsSection';

const ProductDetailsSection = () => {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 items-center promo-products">
        <div>
          <div className="flex text-sm font-medium mb-6 items-center text-[#787b82]">
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
            <div className="text-[#303541]">Apparel</div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="pt-2 pb-8 mb-10">
            <div className="text-[#303541] font-light text-[32px] leading-[41.6px] mb-3">
              Promotional Custom Printed Apparel
            </div>
            <p className=" font-normal text-mute3  text-[16px] py-2 font-poppins">
              Custom printed apparel and promotional logo clothing is an
              excellent way to display your logo while showing a fashion
              statement. Employees and clients alike will be proud to wear a
              custom printed shirt, or embroidered polo with your corporate
              logo. Any type of clothing can be imprinted or embroidered. From
              t-shirts, polos, and sweatshirts, to boxers, shorts, and jackets,
              we are the source for all your custom corporate apparel.
            </p>
            <p className=" font-normal text-mute3  text-[16px] py-2 font-poppins">
              Everyone can appreciate custom apparel. Not only does it make a
              great handout or giveaway, but it also makes a statement about
              your brand and identity. Whether worn at trade shows and
              conventions, in the office, or just for recreation, personalized
              apparel will be a long lasting promotion that will be the perfect
              fit.
            </p>
            <p className=" font-normal text-mute3  text-[16px] py-2 font-poppins">
              Give us a call or send us an email, and one of our apparel
              professionals will be happy to speak with you to help you design
              and create your custom printed apparel.
            </p>
          </div>
        </div>
        <ProductSubCategoriesSection />
        <ProductsSection isModal={true} isSale={false} isContainer={false} />
      </div>
    </div>
  );
};

export default ProductDetailsSection;
