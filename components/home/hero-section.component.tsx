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
      {(banner, index) => (
        <div className="relative h-full w-full">
          <Image
            className="object-contain lg:object-none"
            src={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${banner.bannerUrl}`}
            alt="banner"
            fill
            priority={index === 0}
          />
          <div className="relative z-10">
            <div className="h-[11rem] md:h-[15rem] lg:h-[25rem] pb-8 lg:pb-16 flex flex-col justify-end items-center text-center">
              <Link
                href={`/categories/${banner.bannerCategory.ucategoryName}?size=20&filter=priceLowToHigh`}
                className="w-[7rem] md:w-[12rem] md:block py-1 text-[10px] md:py-3 md:text-sm text-white font-normal md:font-bold border border-white rounded-full"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      )}
    </SwiperSlider>
  );
};
