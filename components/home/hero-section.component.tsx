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
    <SwiperSlider dataList={bannersList}>
      {banner => (
        <div className="relative">
          <Image
            className="absolute top-0 left-0"
            src={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${banner.bannerUrl}`}
            alt="banner"
            fill
            objectFit="cover"
          />
          <div className="relative z-10">
            <div className="h-[25rem] pl-48 pb-16 max-w-[40rem] flex flex-col justify-end text-center">
              {/*<h2*/}
              {/*  className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-5"*/}
              {/*  dangerouslySetInnerHTML={{__html: banner.heading}}*/}
              {/*></h2>*/}
              {/*<div className="text-white text-base space-y-2" dangerouslySetInnerHTML={{__html: banner.tagLines}}></div>*/}
              <div>
                <Link
                  href={`/categories/${banner.bannerCategory.ucategoryName}`}
                  className="py-4 px-14 text-sm text-white font-bold border border-white rounded-full mb-20"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </SwiperSlider>
  );
};
