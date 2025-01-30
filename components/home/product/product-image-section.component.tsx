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
  outOfStock: boolean;
}

export const ProductImageComponent: FC<IProductImageSection> = ({productName, productImages, outOfStock}) => {
  return (
    <figure className="order-first">
      <div className="sticky top-0">
        <div className="md:pt-8 border border-gray-200">
          <AppLightGallery productName={productName} productImages={productImages} showOne={true} />
          {outOfStock ? (
            <div className="absolute top-8 -left-5 w-[8rem] text-center bg-red-500 text-white text-xs px-3 py-1 font-bold transform -rotate-45 ">
              Out of Stock
            </div>
          ) : null}
        </div>
        <div className="gallery-container">
          <AppLightGallery productName={productName} productImages={productImages} />
        </div>
      </div>
    </figure>
  );
};
