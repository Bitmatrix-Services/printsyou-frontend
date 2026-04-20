import React, {FC, useMemo, useState, useEffect, useCallback} from 'react';
import {createPortal} from 'react-dom';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {FaPlay, FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import {IoClose} from 'react-icons/io5';

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

// Lightbox Modal Component
const LightboxModal: FC<{
  media: ProductMedia[];
  currentIndex: number;
  productName: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}> = ({media, currentIndex, productName, onClose, onNavigate}) => {
  const [mounted, setMounted] = useState(false);

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia?.mediaType === 'VIDEO' || isVideoUrl(currentMedia?.imageUrl || '');
  const mediaUrl = `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${currentMedia?.imageUrl}`;

  const handlePrev = useCallback(() => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : media.length - 1);
  }, [currentIndex, media.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate(currentIndex < media.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, media.length, onNavigate]);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, handlePrev, handleNext]);

  if (!mounted || !currentMedia) return null;

  const altText = currentMedia?.altText ?? `${productName} ${currentIndex + 1}`;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 2147483647,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        color: 'white'
      }}>
        <span style={{fontSize: '14px'}}>{currentIndex + 1} / {media.length}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          <IoClose size={28} />
        </button>
      </div>

      {/* Main content area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0 60px',
        minHeight: 0
      }}>
        {/* Prev button */}
        {media.length > 1 && (
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FaChevronLeft size={20} />
          </button>
        )}

        {/* Media display */}
        <div style={{
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isVideo ? (
            <video
              key={mediaUrl}
              controls
              autoPlay
              playsInline
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 200px)',
                backgroundColor: '#000'
              }}
            >
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={mediaUrl}
              alt={altText}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 200px)',
                objectFit: 'contain'
              }}
            />
          )}
        </div>

        {/* Next button */}
        {media.length > 1 && (
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FaChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Caption */}
      <div style={{
        textAlign: 'center',
        color: 'white',
        padding: '10px',
        fontSize: '14px'
      }}>
        {altText}
      </div>

      {/* Thumbnails */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '15px 20px',
        overflowX: 'auto',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        {media.map((item, idx) => {
          const isItemVideo = item.mediaType === 'VIDEO' || isVideoUrl(item.imageUrl);
          const hasVideoThumbnail = isItemVideo && item.videoThumbnail;
          const itemMediaUrl = `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${item.imageUrl}`;
          const thumbUrl = hasVideoThumbnail
            ? `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${item.videoThumbnail}`
            : !isItemVideo
              ? itemMediaUrl
              : null;

          return (
            <div
              key={item.imageUrl}
              onClick={() => onNavigate(idx)}
              style={{
                width: '70px',
                height: '70px',
                flexShrink: 0,
                cursor: 'pointer',
                border: idx === currentIndex ? '2px solid white' : '2px solid transparent',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: isItemVideo ? '#1a1a1a' : undefined
              }}
            >
              {thumbUrl ? (
                <img
                  src={thumbUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : isItemVideo ? (
                <video
                  src={itemMediaUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  preload="metadata"
                  muted
                  playsInline
                />
              ) : null}
              {isItemVideo && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.3)'
                }}>
                  <FaPlay style={{color: 'white', fontSize: '16px'}} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const AppLightGallery: FC<AppLightGalleryProps> = ({productImages, productName, showOne = false}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortedProductImages = useMemo(
    () => [...productImages].sort((a, b) => a.sequenceNumber - b.sequenceNumber),
    [productImages]
  );

  const handleMediaClick = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Gallery thumbnails */}
      <div className={showOne ? '' : 'flex gap-3 overflow-auto'}>
        {sortedProductImages.map((media, index) => {
          const isVideo = media.mediaType === 'VIDEO' || isVideoUrl(media.imageUrl);
          const mediaUrl = `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${media.imageUrl}`;
          const altText =
            media?.altText ??
            (productName.startsWith('.')
              ? `${productName.substring(1)} ${index + 1}`
              : `${productName} ${index + 1}`);

          return (
            <div
              key={media.imageUrl}
              className={`${
                showOne && index === 0 ? 'block' : !showOne && index !== 0 ? 'block' : 'hidden'
              } gallery-item cursor-pointer ${
                !showOne ? 'flex-shrink-0' : 'max-w-[28rem] mx-auto'
              }`}
              onClick={() => handleMediaClick(index)}
            >
              <span className={`block relative overflow-hidden ${!showOne ? 'border border-[#eceef1] w-[6.25rem] h-[6.25rem]' : 'w-[28rem] h-[28rem] max-w-full aspect-square'}`}>
                {isVideo ? (
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
                      <video
                        src={mediaUrl}
                        className="w-full h-full object-contain"
                        preload="metadata"
                        muted
                        playsInline
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                      <div className={`${!showOne ? 'w-8 h-8' : 'w-12 h-12'} rounded-full bg-white/90 flex items-center justify-center shadow-lg`}>
                        <FaPlay className={`${!showOne ? 'w-3 h-3' : 'w-5 h-5'} text-red-500 ml-0.5`} />
                      </div>
                    </div>
                  </div>
                ) : (
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
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <LightboxModal
          media={sortedProductImages}
          currentIndex={currentIndex}
          productName={productName}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setCurrentIndex}
        />
      )}
    </>
  );
};
