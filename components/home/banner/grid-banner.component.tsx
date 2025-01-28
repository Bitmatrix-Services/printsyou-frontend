'use client';
import React, {FC} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {BannerList} from '@components/home/home.types';

interface IGridBannerComponentProps {
  banner: BannerList;
}

export const GridBannerComponent: FC<IGridBannerComponentProps> = ({banner}) => {
  return (
    <div className="w-full max-w-[120rem] mx-auto md:px-2 lg:px-8 2xl:px-[12rem] relative">
      <div key={banner.id} className="grid sm:grid-rows-2 lg:grid-rows-2 xl:grid-rows-1 xl:grid-cols-8">
        {/*  tagline section */}
        <div className="banner-text-section font-century-gothic xl:col-span-3">
          <div className="flex flex-col justify-center items-start xl:max-w-[32rem] text-start text-white px-5 lg:px-8 py-8 h-full font-normal text-4xl lg:text-5xl tracking-wide leading-extra-loose lg:leading-extra-loose">
            <h1>Carry in Style: The Perfect Tote for Every Occasion</h1>
            <div className="mt-4 w-full">
              <Link
                href={`/categories/bags-duffels-amp-accessories/tote-bags-nylon-amp-polyester`}
                className="block xl:inline-block text-lg text-[#005c90] align-middle text-center bg-white px-4 lg:px-8 py-3 tablet:py-1 md:py-1 xl:py-3 font-normal font-century-gothic hover:bg-blue-100"
                dangerouslySetInnerHTML={{__html: 'Buy Tote Bags and Gifts'}}
              ></Link>
            </div>
          </div>
        </div>

        {/*  center image section */}
        <div className="relative min-h-[150px] md:min-h-[170px] lg:min-h-full w-full xl:col-span-3">
          <Image
            className="object-cover"
            src={`https://printsyouassets.s3.amazonaws.com/static-assets/banners/FullToteBag.png`}
            alt="Image 2"
            fill
          />
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-1 sm:grid-rows-2 tablet:grid-rows-1 md:grid-rows-2 lg:grid-rows-1 px-4 lg:px-6 md:px-4 xl:px-4 gap-4 lg:gap-32 xl:gap-4 mt-4 md:pt-5 tablet:mt-5 lg:mt-4 xl:mt-0 xl:pt-0 xl:col-span-2">
          <ShortImageTitleSection
            textColor={'white'}
            heading={'Made in USA'}
            ucategoryName={'made-in-usa'}
            bannerUrl={'static-assets/banners/made-in-usa-banner.jpg'}
          />
          <ShortImageTitleSection
            heading={'Pet Products'}
            ucategoryName={'pet-products'}
            bannerUrl={'static-assets/banners/pet-supplies.jpg'}
          />
        </div>
      </div>
    </div>
  );
};

interface IShortImageTitleSection {
  ucategoryName: String;
  heading: String;
  bannerUrl: String;
  textColor?: String;
}

const ShortImageTitleSection: FC<IShortImageTitleSection> = ({ucategoryName, heading, bannerUrl, textColor}) => {
  return (
    <div className="relative min-h-[180px] md:min-h-[170px] tablet:min-h-[200px] lg:min-h-[200px] lg:w-full">
      <Image
        className="object-cover tablet:object-cover md:object-cover"
        src={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${bannerUrl}`}
        alt="Image 4"
        fill
      />
      <div
        className={`absolute font-century-gothic ${textColor === 'white' ? 'text-white' : 'text-[#3aa4dc]'} bottom-4 ml-6 mb-10 text-left font-normal`}
      >
        <div className="text-2xl mb-1" dangerouslySetInnerHTML={{__html: heading}}></div>
        <Link href={`/categories/${ucategoryName}`} className="text-lg underline ">
          Shop Now
        </Link>
      </div>
    </div>
  );
};
