'use client';
import React, {FC, useCallback, useRef} from 'react';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import {SectionHeading} from '@components/home/section-heading.component';
import {Navigation} from 'swiper/modules';
import {breakpoints} from '@utils/constants';
import {ProductCard} from '@components/home/product/product-card.component';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import {v4 as uuidv4} from 'uuid';

interface IProductSection {
  title: string;
  productList: any[];
  navNumber: number;
  showAllUrl?: string;
}

export const ProductSliderSection: FC<IProductSection> = ({title, productList, navNumber, showAllUrl}) => {
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
    <>
      <SectionHeading title={title} showAllUrl={showAllUrl} />
      <div className="featured-swiper relative">
        <button type="button" className={`swiper-button-prev swiper-nav-prev-${navNumber}`} onClick={handlePrev}>
          <IoIosArrowBack />
        </button>
        <button type="button" className={`swiper-button-next swiper-nav-next-${navNumber}`} onClick={handleNext}>
          <IoIosArrowForward />
        </button>
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: `.swiper-nav-next-${navNumber}`,
            prevEl: `.swiper-nav-prev-${navNumber}`
          }}
          ref={sliderRef}
          breakpoints={breakpoints}
        >
          {productList?.map(product => (
            <SwiperSlide key={uuidv4()}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};
