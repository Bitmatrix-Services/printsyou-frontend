'use client';

import React, {FC, useCallback, useRef} from 'react';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import {CategoryCard} from '@components/home/category/category-card.component';
import {Category, Crumbs} from '@components/home/home.types';

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

    const hiVisSafetyVestCategory: Category = {
        categoryName: "Hi-Vis Custom Safety Vests",
        id: "75217bbf-205b-4b6e-bcf2-fb9d0415cc29",
        categoryDescription: "This is a dummy category description.",
        imageUrl: "category/8cad2710-e87b-4a86-871e-de4e1fb475dc/custom-safety-vest-ansi-class2.jpg",
        level: "1",
        prefix: "dummy-prefix",
        suffix: "dummy-suffix",
        uniqueCategoryName: "apparel/hi-vis-custom-safety-vests",
        subCategories: [],
        metaTitle: "Dummy Meta Title",
        metaDescription: "Dummy Meta Description",
        crumbs: [],
    };

  return (
    <>
      <div className="flex gap-6 items-baseline justify-start my-10">
        <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold capitalize">Featured Categories</h2>
      </div>

      <div className="featured-swiper relative">
        <button
          type="button"
          className={`hidden md:flex swiper-button-prev swiper-nav-prev-${navNumber}`}
          onClick={handlePrev}
        >
          <IoIosArrowBack />
        </button>
        <button
          type="button"
          className={`hidden md:flex swiper-button-next swiper-nav-next-${navNumber}`}
          onClick={handleNext}
        >
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
            <SwiperSlide key="hi-vis-safety-vests-category" className="w-44">
                <CategoryCard category={hiVisSafetyVestCategory} />
            </SwiperSlide>

          {categoryList?.map(category => (
            <SwiperSlide key={category.id} className="w-44">
              <CategoryCard category={category} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="md:hidden w-full flex flex-row gap-6 items-center justify-center mt-4">
          <button
            type="button"
            className={`w-[40px] h-[40px] flex rounded-full border-[2px] border-black`}
            onClick={handlePrev}
          >
            <IoIosArrowBack size={20} className="m-auto" />
          </button>
          <button
            type="button"
            className={`w-[40px] h-[40px] flex rounded-full border-[2px] border-black`}
            onClick={handleNext}
          >
            <IoIosArrowForward size={20} className="m-auto" />
          </button>
        </div>
      </div>
    </>
  );
};
