import React from 'react';
import Link from 'next/link';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';

import Container from '../globals/Container';
import {FeaturedCard} from '../cards/FeaturedCard';

const FeaturedSection = () => {
  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 10
    },

    600: {
      slidesPerView: 2,
      spaceBetween: 10
    },

    800: {
      slidesPerView: 3,
      spaceBetween: 20
    },

    1024: {
      slidesPerView: 4,
      spaceBetween: 20
    }
  };

  return (
    <section className="bg-white py-8 lg:py-20">
      <Container>
        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-6">
          <h2 className="text-3xl lg:text-4xl font-normal text-center md:text-left md:mr-auto">
            Under{' '}
            <strong className="font-extrabold text-[#58c6f1]">a Buck</strong>
          </h2>
          <Link
            className="hidden md:block py-6 px-20 text-xs tracking-[3.5px] font-bold btn-outline-1"
            href="!#"
          >
            VIEW MORE
          </Link>
        </div>
        <Swiper
          modules={[Navigation]}
          navigation
          breakpoints={breakpoints}
          className="featured-swiper"
        >
          <SwiperSlide>
            <FeaturedCard isModal={true} isSale={false} />
          </SwiperSlide>
          <SwiperSlide>
            <FeaturedCard isModal={true} isSale={false} />
          </SwiperSlide>
          <SwiperSlide>
            <FeaturedCard isModal={true} isSale={false} />
          </SwiperSlide>
          <SwiperSlide>
            <FeaturedCard isModal={true} isSale={false} />
          </SwiperSlide>
          <SwiperSlide>
            <FeaturedCard isModal={true} isSale={false} />
          </SwiperSlide>
        </Swiper>
        <div className="mt-12 mb-6 md:hidden text-center">
          <Link
            className="py-6 px-20 text-xs tracking-[3.5px] font-bold btn-outline-1"
            href="!#"
          >
            VIEW MORE
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedSection;
