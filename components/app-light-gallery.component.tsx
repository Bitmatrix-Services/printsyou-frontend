import dynamic from 'next/dynamic';
import React, {FC, useMemo} from 'react';
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
import {FaPlay} from 'react-icons/fa';

const LightGallery = dynamic(() => import('lightgallery/react'), {
  ssr: false
});

interface ProductMedia {
  imageUrl: string;
  sequenceNumber: number;
  altText?: string | null;
  mediaType?: 'IMAGE' | 'VIDEO';
  videoThumbnail?: string | null;
}

interface AppLightGalleryProps {
  productImages: ProductMedia[];
  productName: string;
  showOne?: boolean;
}

// Helper to detect video from URL if mediaType not set
const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

// Helper to get video MIME type
const getVideoMimeType = (url: string): string => {
  const ext = url.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    m4v: 'video/x-m4v'
  };
  return mimeTypes[ext || ''] || 'video/mp4';
};

export const AppLightGallery: FC<AppLightGalleryProps> = ({productImages, productName, showOne = false}) => {
  const sortedProductImages = useMemo(
    () => [...productImages].sort((a, b) => a.sequenceNumber - b.sequenceNumber),
    [productImages]
  );

  return (
    <LightGallery
      enableSwipe
      escKey
      mode="lg-slide"
      mobileSettings={{closeOnTap: true}}
      plugins={[lgZoom, lgAutoplay, lgComment, lgFullscreen, lgHash, lgPager, lgRotate, lgShare, lgThumbnail, lgVideo]}
      videojs
      videojsOptions={{controls: true}}
    >
      {sortedProductImages &&
        sortedProductImages.map((media, index) => {
          const isVideo = media.mediaType === 'VIDEO' || isVideoUrl(media.imageUrl);
          const mediaUrl = `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${media.imageUrl}`;
          const altText =
            media?.altText ??
            (productName.startsWith('.')
              ? `${productName.substring(1)} ${index + 1}`
              : `${productName} ${index + 1}`);

          // For videos, we use data-video attribute with video source info
          const videoData = isVideo
            ? JSON.stringify({
                source: [
                  {
                    src: mediaUrl,
                    type: getVideoMimeType(media.imageUrl)
                  }
                ],
                attributes: {
                  preload: 'metadata',
                  controls: true,
                  playsinline: true
                }
              })
            : undefined;

          // Thumbnail for videos - use videoThumbnail if available, otherwise use first frame
          const thumbnailUrl = isVideo && media.videoThumbnail
            ? `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${media.videoThumbnail}`
            : mediaUrl;

          return (
            <a
              key={media.imageUrl}
              className={`${
                showOne && index === 0 ? 'block' : !showOne && index !== 0 ? 'block' : 'hidden'
              } gallery-item cursor-pointer ${
                !showOne ? 'flex-shrink-0' : 'max-w-[28rem] mx-auto'
              }`}
              data-src={isVideo ? undefined : mediaUrl}
              data-video={videoData}
              data-poster={isVideo ? thumbnailUrl : undefined}
              data-sub-html={`<h4>${altText}</h4>`}
            >
              <span className={`block relative overflow-hidden ${!showOne ? 'border border-[#eceef1] w-[6.25rem] h-[6.25rem]' : 'w-[28rem] h-[28rem] max-w-full aspect-square'}`}>
                {isVideo ? (
                  // Video thumbnail with play button overlay
                  <div className="relative w-full h-full bg-gray-900">
                    {media.videoThumbnail ? (
                      <ImageWithFallback
                        width={!showOne ? 100 : 403}
                        height={!showOne ? 100 : 403}
                        className="object-contain w-full h-full"
                        src={media.videoThumbnail}
                        priority={showOne || index <= 5}
                        alt={altText}
                      />
                    ) : (
                      // If no thumbnail, show video element for first frame
                      <video
                        src={mediaUrl}
                        className="w-full h-full object-contain"
                        preload="metadata"
                        muted
                        playsInline
                      />
                    )}
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                      <div className={`${!showOne ? 'w-8 h-8' : 'w-12 h-12'} rounded-full bg-white/90 flex items-center justify-center shadow-lg`}>
                        <FaPlay className={`${!showOne ? 'w-3 h-3' : 'w-5 h-5'} text-red-500 ml-0.5`} />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular image
                  <ImageWithFallback
                    width={!showOne ? 100 : 403}
                    height={!showOne ? 100 : 403}
                    className="object-contain"
                    src={media.imageUrl}
                    priority={showOne || index <= 5}
                    alt={altText}
                  />
                )}
              </span>
            </a>
          );
        })}
    </LightGallery>
  );
};
