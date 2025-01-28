'use client';

import React, {FC} from 'react';
import {SwiperSlider} from '@components/globals/swiper.component';
import {BannerList} from '@components/home/home.types';
import {GridBannerComponent} from '@components/home/banner/grid-banner.component';

interface IHeroSection {
  bannersList: BannerList[];
}

export const HeroSection: FC<IHeroSection> = ({bannersList = []}) => {
  console.log({bannersList});
  return (
    <SwiperSlider dataList={bannersList.sort((a, b) => a.sequenceNumber - b.sequenceNumber)}>
      {banner => <GridBannerComponent banner={banner} />}
    </SwiperSlider>
  );
};
