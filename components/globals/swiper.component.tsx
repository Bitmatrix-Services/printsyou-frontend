'use client';

import React, {FC, ReactNode, useRef} from 'react';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';

interface IHeroSection {
  dataList: any[];
  children: (_: any) => ReactNode;
}

export const SwiperSlider: FC<IHeroSection> = ({dataList = [], children}) => {
  const sliderRef = useRef<SwiperRef>(null);

  return (
    <section className="bg-grey">
      <div className="relative">
        <Swiper
          ref={sliderRef}
          loop
          modules={[Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          pagination={{clickable: true}}
          className="hero-swiper"
        >
          {(dataList ?? []).map(listItem => (
            <SwiperSlide key={listItem.id}>{children && children(listItem)}</SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
