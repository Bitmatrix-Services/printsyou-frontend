'use client';
import React, {useState, useEffect} from 'react';
import Image, {ImageProps} from 'next/image';
import {Skeleton} from '@mui/joy';

const FALLBACK_IMAGE = '/assets/logo-full.png';
const ASSETS_URL = 'https://printsyouassets.s3.amazonaws.com';

// Helper to build proper image URL with leading slash
const buildImageUrl = (src: string | undefined | null): string => {
  // Handle null/undefined/empty
  if (!src || src.trim() === '') return FALLBACK_IMAGE;

  // If already a full URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) return src;

  // If it's a local path starting with /, return as-is
  if (src.startsWith('/assets/') || src.startsWith('/images/')) return src;

  // Get assets URL - prefer env var, fallback to hardcoded
  const assetsUrl = (process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || ASSETS_URL).replace(/\/$/, '');

  // Ensure leading slash for S3 paths (without double slashes)
  const normalizedPath = src.startsWith('/') ? src : `/${src}`;

  return `${assetsUrl}${normalizedPath}`;
};

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
  skeletonRounded?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = props => {
  const {src, fallbackSrc = FALLBACK_IMAGE, skeletonRounded, priority, alt, ...rest} = props;

  // Build the image URL immediately
  const initialUrl = buildImageUrl(src as string);
  const [imgSrc, setImgSrc] = useState(initialUrl);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Update when src prop changes
  useEffect(() => {
    const newUrl = buildImageUrl(src as string);
    if (newUrl !== imgSrc) {
      setImgSrc(newUrl);
      setHasError(false);
      setLoading(true);
    }
  }, [src]);

  // Handle image load error
  const handleError = () => {
    console.error('[ImageWithFallback] Failed to load:', imgSrc);
    setImgSrc(fallbackSrc);
    setHasError(true);
    setLoading(false);
  };

  // Handle successful image load
  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && !hasError && (
        <Skeleton
          sx={{borderRadius: skeletonRounded ? '1rem' : ''}}
          variant="overlay"
          animation="pulse"
          width="100%"
          height="100%"
        />
      )}
      <Image
        alt={alt || 'Product Image'}
        src={imgSrc}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        {...rest}
      />
    </>
  );
};
