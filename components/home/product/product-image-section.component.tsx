'use client';
import * as React from 'react';
import {FC} from 'react';
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
import {ProductImage} from '@components/home/product/product.types';

interface IProductImageSection {
  productName: string;
  productImages: ProductImage[];
}

export const ProductImageComponent: FC<IProductImageSection> = ({productName, productImages}) => {
  return (
    <figure className="order-first">
      <div className="sticky top-0">
        <div className="md:pt-8 border border-gray-200">
          <AppLightGallery productName={productName} productImages={productImages} showOne={true} />
        </div>
        <div className="gallery-container">
          <AppLightGallery productName={productName} productImages={productImages} />
        </div>
      </div>
    </figure>
  );
};
