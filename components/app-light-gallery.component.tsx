import dynamic from 'next/dynamic';
import React, {FC} from 'react';
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
import {ImageWithFallback} from '@components/globals/Image-with-fallback';

const LightGallery = dynamic(() => import('lightgallery/react'), {
  ssr: false
});

interface AppLightGalleryProps {
  productImages: any[];
  productName: string;
  showOne?: boolean;
}

export const AppLightGallery: FC<AppLightGalleryProps> = ({productImages, productName, showOne = false}) => {
  return (
    <LightGallery
      enableSwipe
      escKey
      mode="lg-slide"
      mobileSettings={{closeOnTap: true}}
      plugins={[lgZoom, lgAutoplay, lgComment, lgFullscreen, lgHash, lgPager, lgRotate, lgShare, lgThumbnail, lgVideo]}
    >
      {productImages &&
        productImages
          .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          .map((image, index) => (
            <a
              key={image.imageUrl}
              className={`${
                showOne && index === 0 ? 'block' : !showOne && index !== 0 ? 'block' : 'hidden'
              } gallery-item cursor-pointer ${
                !showOne ? 'min-w-[6.25rem]' : 'max-w-[28rem] mx-auto'
              } ${!showOne ? 'h-[7rem]' : 'max-h-[28rem]'}`}
              data-src={image ? `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${image?.imageUrl}` : ''}
            >
              <span className={`block relative aspect-square ${!showOne ? 'border border-[#eceef1]' : ''}`}>
                <ImageWithFallback
                  width={!showOne ? 100 : 403}
                  height={!showOne ? 100 : 403}
                  className="object-contain"
                  src={image.imageUrl}
                  priority={showOne}
                  alt={
                    image?.altText ??
                    (productName.startsWith('.')
                      ? `${productName.substring(1)} ${index + 1}`
                      : `${productName} ${index + 1}`)
                  }
                />
              </span>
            </a>
          ))}
    </LightGallery>
  );
};
