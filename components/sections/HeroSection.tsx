import React, {FC, useRef} from 'react';
import Link from 'next/link';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import {BannerList} from '@store/slices/category/category';
import ArrowRightIcon from '@components/icons/ArrowRightIcon';
import Container from '@components/globals/Container';

const slidesData = [
  {
    backgroundImage: '/assets/hero-banner-1.png',
    title: 'All Your Favorite Items up to',
    off: '35% OFF'
  },
  {
    backgroundImage: '/assets/hero-banner-1.png',
    title: 'All Your Favorite Items up to',
    off: '35% OFF'
  },
  {
    backgroundImage: '/assets/hero-banner-1.png',
    title: 'All Your Favorite Items up to',
    off: '35% OFF'
  },
  {
    backgroundImage: '/assets/hero-banner-1.png',
    title: 'All Your Items up to',
    off: '50% OFF'
  },
  {
    backgroundImage: '/assets/hero-banner-1.png',
    title: 'All Your Favorite Items up to',
    off: '35% OFF'
  },
  {
    backgroundImage: '/assets/hero-banner-1.png',
    title: 'All Your Favorite Items up to',
    off: '35% OFF'
  },
  {
    backgroundImage: '/assets/hero-banner-1.png',
    title: 'All Your Favorite Items up to',
    off: '35% OFF'
  }
];

interface IHeroSection {
  bannerList: BannerList[];
}

const HeroSection: FC<IHeroSection> = ({bannerList = []}) => {
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
          {bannerList.map((banner, index) => (
            <SwiperSlide key={banner.id}>
              <div
                className="slide-item bg-center bg-cover"
                style={{
                  //   backgroundImage: `url(${banner.bannerUrl})`
                  backgroundImage: `url(${banner.bannerUrl})`
                }}
              >
                <Container>
                  <div className="py-14 lg:py-20 min-h-[16rem] md:min-h-[28rem] max-w-[35rem] flex flex-col justify-center">
                    <h3 className="font-poppins text-headingColor font-extralight uppercase text-4xl sm:text-6xl xl:text-7xl mb-5">
                      {slidesData[index]?.title ?? ''}
                      <span className="ml-2 text-secondary-500 font-bold">
                        {slidesData[index]?.off ?? ''}
                      </span>
                    </h3>

                    <div>
                      <Link
                        href={banner.bannerCategory.ucategoryName}
                        className="py-3 px-16 text-base font-light inline-flex items-center gap-1 btn-primary"
                      >
                        <span>Shop Now</span>
                        <ArrowRightIcon />
                      </Link>
                    </div>
                  </div>
                </Container>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSection;
