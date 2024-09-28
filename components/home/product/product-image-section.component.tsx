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
import {AppLightGallery} from '@components/app-light-gallery.component';

interface IProductImageSection {
  product: Product;
}

const LightGallery = dynamic(() => import('lightgallery/react'), {
  ssr: false
});

export const ProductImageComponent: FC<IProductImageSection> = ({product}) => {
  return (
    <figure className="order-first">
      <div className="sticky top-0">
        <div className="md:pt-8 border border-gray-200">
          <AppLightGallery productName={product.productName} productImages={product.productImages} showOne={true} />
        </div>
        <div className="gallery-container">
          <AppLightGallery productName={product.productName} productImages={product.productImages} />
        </div>
      </div>
    </figure>
  );
};
