import React, {FC} from 'react';
import Link from 'next/link';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';

import Container from '../globals/Container';
import {FeaturedProductCard} from '../cards/FeaturedProductCard';
import {Product} from '@store/slices/product/product';

interface FeaturedSectionProps {
  title: string;
  subTitle: string;
  titleColor?: string;
  subTitleColor?: string;
  products: Product[];
}

const FeaturedSection: FC<FeaturedSectionProps> = ({
  title,
  subTitle,
  subTitleColor,
  titleColor,
  products
}) => {
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
    <section className="bg-white pt-8 lg:pt-20">
      <Container>
        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-6">
          <h2
            className={`text-3xl lg:text-4xl font-normal text-center md:text-left md:mr-auto`}
          >
            <span
              className={`${titleColor && 'font-extrabold'} ${
                titleColor && titleColor
              }`}
            >
              {title}{' '}
            </span>
            <span
              className={`${subTitleColor && 'font-extrabold'}  text-[${
                subTitleColor ? subTitleColor : 'black'
              }]`}
            >
              {subTitle}
            </span>
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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(product => (
            <SwiperSlide key={product}>
              <FeaturedProductCard product={''} />
            </SwiperSlide>
          ))}
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
