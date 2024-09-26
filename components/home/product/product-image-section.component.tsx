'use client';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Thumbs} from 'swiper/modules';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {breakpoints} from '@utils/constants';
import * as React from 'react';
import {FC} from 'react';
import {Product} from '@components/home/product/product.types';
import dynamic from 'next/dynamic';
import lgZoom from 'lightgallery/plugins/zoom';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgComment from 'lightgallery/plugins/comment';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgHash from 'lightgallery/plugins/hash';
import lgPager from 'lightgallery/plugins/pager';
import lgRotate from 'lightgallery/plugins/rotate';
import lgShare from 'lightgallery/plugins/share';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgVideo from 'lightgallery/plugins/video';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-comments.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-pager.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-rotate.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-medium-zoom.css';

interface IProductImageSection {
  product: Product;
}

const LightGallery = dynamic(() => import('lightgallery/react'), {
  ssr: false
});

export const ProductImageComponent: FC<IProductImageSection> = ({product}) => {
  return (
    <div>
      <LightGallery
        enableSwipe
        escKey
        mode="lg-slide"
        mobileSettings={{closeOnTap: true}}
        plugins={[
          lgZoom,
          lgAutoplay,
          lgComment,
          lgFullscreen,
          lgHash,
          lgPager,
          lgRotate,
          lgShare,
          lgThumbnail,
          lgVideo
        ]}
      >
        {product?.productImages
          .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          ?.map((image, index) => (
            <a
              key={`${image.imageUrl}${image.altText}`}
              className={`${index === 0 ? 'block' : 'hidden'} border border-gray-200 rounded gallery-item cursor-pointer 
                        'max-w-[28rem] mx-auto'
                    'max-h-[28rem]`}
              data-src={image ? `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${image?.imageUrl}` : ''}
            >
              <div className="relative w-full aspect-[16/9] cursor-pointer">
                <ImageWithFallback
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="object-contain"
                  src={image?.imageUrl}
                  priority={index < 5}
                  alt={
                    image?.altText ??
                    (product.productName.startsWith('.')
                      ? `${product.productName.substring(1)} ${index + 1}`
                      : `${product.productName} ${index + 1}`)
                  }
                />
              </div>
            </a>
          ))}
      </LightGallery>
      {/*</Swiper>*/}

      {/* Swiper for thumbnail images */}
      <Swiper
        spaceBetween={5}
        freeMode
        navigation
        watchSlidesProgress
        modules={[Navigation, Thumbs]}
        breakpoints={breakpoints}
        className="slider-swipper-2 mt-6"
        slidesPerView="auto"
      >
        {product?.productImages?.map((image, index) => (
          <SwiperSlide
            key={`${image.imageUrl}${image.sequenceNumber}`}
            className={`w-20 h-20 border rounded border-gray-200`}
          >
            <div className="relative w-full h-full cursor-pointer flex justify-center items-center">
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
