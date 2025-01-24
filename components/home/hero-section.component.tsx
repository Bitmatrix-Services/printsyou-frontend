'use client';

import React, {FC} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {SwiperSlider} from '@components/globals/swiper.component';
import {BannerList} from '@components/home/home.types';

interface IHeroSection {
  bannersList: BannerList[];
}

export const HeroSection: FC<IHeroSection> = ({bannersList = []}) => {
  return (
    <SwiperSlider dataList={bannersList.sort((a, b) => a.sequenceNumber - b.sequenceNumber)}>
      {banner => (
        <div key={banner.id} className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-2">
          {/*  tagline section */}
          <div className="banner-text-section font-century-gothic">
            <div className="flex flex-col justify-center items-start text-start text-white px-8 h-full font-normal text-5xl tracking-wide leading-extra-loose">
              <h1>Carry in Style: The Perfect Tote for Every Occasion</h1>
              <div className="mt-4">
                <Link
                  href={`/categories/bags-duffels-amp-accessories/tote-bags-nylon-amp-polyester`}
                  className="text-lg text-[#005c90] align-middle bg-white px-4 lg:px-8 py-4 font-normal font-century-gothic hover:bg-blue-100"
                  dangerouslySetInnerHTML={{__html: 'Buy Tote Bags and Gifts'}}
                ></Link>
              </div>
            </div>
          </div>

          {/*  center image section */}
          <div className="relative min-h-full w-full">
            <Image
              className="object-cover"
              src={`https://printsyouassets.s3.amazonaws.com/static-assets/banners/FullToteBag.png`}
              alt="Image 2"
              fill
            />
          </div>
          <div className="grid grid-rows-2 gap-1">
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
      )}
    </SwiperSlider>
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
    <div className="relative min-h-[13rem] w-full">
      <Image
        className="object-fill"
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
