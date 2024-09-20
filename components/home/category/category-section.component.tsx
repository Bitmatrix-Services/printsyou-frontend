'use client';

import React, {FC, useCallback, useRef} from 'react';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import {SectionHeading} from '@components/home/section-heading.component';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import {CategoryCard} from '@components/home/category/category-card.component';
import {Category} from '@components/home/home.types';

interface ICategorySection {
  categoryList: Category[];
  navNumber: number;
}

export const CategorySection: FC<ICategorySection> = ({categoryList = [], navNumber}) => {
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
      <SectionHeading title="Categories" />
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
          slidesPerView="auto"
        >
          {categoryList?.map(category => (
            <SwiperSlide key={category.id} className="w-44">
              <CategoryCard category={category} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};
