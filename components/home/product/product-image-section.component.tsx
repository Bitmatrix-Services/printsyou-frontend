'use client';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Thumbs} from 'swiper/modules';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {breakpoints} from '@utils/constants';
import * as React from 'react';
import {FC, useState} from 'react';
import {Product} from '@components/home/product/product.types';

interface IProductImageSection {
  product: Product;
}

export const ProductImageComponent: FC<IProductImageSection> = ({product}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div>
      {/* Swiper for large image display */}
      <Swiper
        spaceBetween={5}
        thumbs={{swiper: thumbsSwiper}}
        modules={[Thumbs]}
        className="mySwiper2 border border-gray-200 rounded"
      >
        {product?.productImages
          .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          ?.map((image, index) => (
            <SwiperSlide key={`${image.imageUrl}${image.altText}`}>
              <div
                className="relative w-full aspect-[16/9] cursor-pointer"
                onClick={() => setThumbsSwiper(image.imageUrl)}
              >
                <ImageWithFallback
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="object-contain"
                  src={image.imageUrl}
                  priority={index < 5}
                  alt={
                    image?.altText ??
                    (product.productName.startsWith('.')
                      ? `${product.productName.substring(1)} ${index + 1}`
                      : `${product.productName} ${index + 1}`)
                  }
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Swiper for thumbnail images */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={5}
        freeMode
        navigation
        watchSlidesProgress
        modules={[Navigation, Thumbs]}
        breakpoints={breakpoints}
        className="slider-swipper-2 mt-6"
        slidesPerView="auto"
      >
        {product?.productImages
          ?.map((image, index) => (
            <SwiperSlide
              key={`${image.imageUrl}${image.sequenceNumber}`}
              className="w-20 h-20 border border-gray-200 rounded"
            >
              <div
                className="relative w-full h-full cursor-pointer flex justify-center items-center"
                onClick={() => setThumbsSwiper(image.imageUrl)}
              >
                <ImageWithFallback
                  className="object-contain size-16"
                  height={96}
                  width={96}
                  priority={index < 5}
                  src={image.imageUrl}
                  alt={image.altText ?? `${product.productName} ${index + 1}`}
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};
