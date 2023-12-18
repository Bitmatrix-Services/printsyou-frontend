import React, {FC, useCallback, useRef} from 'react';
import Link from 'next/link';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import {BannerList} from '@store/slices/category/category';

const slidesData = [
  {
    backgroundImage: '/assets/banner-1.png',
    title: 'Made In the USA Promotional Products',
    bulletPoints: [
      'Made In the USA Promotional Products',
      'Support Our Country',
      'Hundreds of Items To Choose From',
      'All Proudly Made In the USA'
    ]
  },
  {
    backgroundImage: '/assets/banner-2.png',
    title: 'Drinkware',
    bulletPoints: ['Bottles', 'Mugs', 'Tumblers', 'And Much More!']
  },
  {
    backgroundImage: '/assets/banner-3.png',
    title: 'Sunglasses',
    bulletPoints: []
  },
  {
    backgroundImage: '/assets/banner-4.png',
    title: 'Lip Balm',
    bulletPoints: []
  }
];

interface IHeroSection {
  bannerList: BannerList[];
}

const HeroSection: FC<IHeroSection> = ({bannerList = []}) => {
  const sliderRef = useRef<SwiperRef>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="bg-grey pt-8 lg:pt-20">
      <div className="max-w-[120rem] mx-auto px-4 md:px-8 xl:px-24 relative">
        <button
          type="button"
          className="swiper-button-prev"
          onClick={handlePrev}
        />
        <button
          type="button"
          className="swiper-button-next"
          onClick={handleNext}
        />
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
                className="slide-item bg-center"
                style={{
                  backgroundImage: `url(${banner.bannerUrl})`
                }}
              >
                <div className="h-[25rem] py-6 md:px-20 max-w-[40rem] flex flex-col justify-center text-center">
                  <h3 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-5">
                    {slidesData[index]?.title ?? ''}
                  </h3>
                  {slidesData[index] &&
                    slidesData[index]?.bulletPoints?.length > 0 && (
                      <div className="list">
                        <ul className="text-white text-base space-y-2">
                          {slidesData[index]?.bulletPoints?.map(
                            (point, pointIndex) => (
                              <li key={pointIndex}>{point}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  <div className="mt-8">
                    <Link
                      href={banner.bannerCategory.ucategoryName}
                      className="py-4 px-20 text-sm tracking-[3.5px] font-bold btn-primary"
                    >
                      SHOP NOW
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSection;
