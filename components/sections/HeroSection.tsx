import React, {FC, useRef} from 'react';
import Link from 'next/link';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import {BannerList} from '@store/slices/category/category';
import Image from 'next/image';
import getConfig from "next/config";

const config = getConfig();

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
              <div className="relative">
                <Image
                  className="absolute top-0 left-0"
                  src={`${config.publicRuntimeConfig.ASSETS_SERVER_URL}${banner.bannerUrl}`}
                  alt="banner"
                  fill
                  objectFit="cover"
                />
                <div className="relative z-10">
                  <div className="h-[25rem] px-6 py-6 md:px-20 max-w-[40rem] flex flex-col justify-center text-center">
                    <h3
                      className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-5"
                      dangerouslySetInnerHTML={{__html: banner.heading}}
                    ></h3>
                    <div
                      className="text-white text-base space-y-2"
                      dangerouslySetInnerHTML={{__html: banner.tagLines}}
                    ></div>
                    <div className="mt-8">
                      <Link
                        href={`/${banner.bannerCategory.ucategoryName}`}
                        className="py-4 px-20 text-sm tracking-[3.5px] font-bold btn-primary"
                      >
                        SHOP NOW
                      </Link>
                    </div>
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
