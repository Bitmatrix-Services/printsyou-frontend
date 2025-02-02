'use client';
import React, {FC, useMemo, useRef} from 'react';
import {BannerList} from '@components/home/home.types';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import {GridBannerComponent} from '@components/home/banner/grid-banner.component';
import {FullBannerComponent} from '@components/home/banner/full-banner.component';

interface IHeroSection {
  bannersList: BannerList[];
}

export const HeroSection: FC<IHeroSection> = ({bannersList = []}) => {
  const sliderRef = useRef<SwiperRef>(null);
  const groupAndSortBanners = (data: BannerList[]): Record<string, BannerList[]> => {
    const grouped = data.reduce((acc: Record<string, BannerList[]>, item) => {
      const type = item.type;
      acc[type] = acc[type] || [];
      acc[type].push(item);
      return acc;
    }, {});

    Object.keys(grouped).forEach(type => {
      grouped[type].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    });

    return grouped;
  };
  const typeSortedBanners = useMemo(() => {
    return groupAndSortBanners(bannersList);
  }, [bannersList]);

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
          {Object.entries(typeSortedBanners).map(([bannerType, items]) => (
            <SwiperSlide key={bannerType}>
              {bannerType.includes('grid') && items.length === 4 ? (
                <GridBannerComponent banner={items} />
              ) : bannerType.includes('full') && items.length === 1 ? (
                <FullBannerComponent banner={items[0]} />
              ) : null}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
