'use client';
import React, {useEffect, useState, useMemo} from 'react';
import Image, {ImageProps} from 'next/image';
import {Skeleton} from '@mui/joy';

// Helper to build proper image URL with leading slash
const buildImageUrl = (src: string | undefined): string => {
  if (!src) return '/assets/logo-full.png';
  // If already a full URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  // Ensure leading slash
  const normalizedPath = src.startsWith('/') ? src : `/${src}`;
  // Get assets URL at runtime to ensure it's available
  const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com';
  return `${assetsUrl}${normalizedPath}`;
};

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
  skeletonRounded?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = props => {
  const {src, fallbackSrc = '/assets/logo-full.png', skeletonRounded, priority, alt, ...rest} = props;

  // Compute the final image URL
  const computedSrc = useMemo(() => buildImageUrl(src as string), [src]);
  const [imgSrc, setImgSrc] = useState(computedSrc);
  const [loading, setLoading] = useState(true);

  // Update imgSrc when src prop changes
  useEffect(() => {
    const newSrc = buildImageUrl(src as string);
    setImgSrc(newSrc);
  }, [src]);

  // Use computed source directly to avoid stale state issues
  const finalSrc = imgSrc || computedSrc || fallbackSrc;

  return (
    <>
      {loading && (
        <Skeleton
          sx={{borderRadius: skeletonRounded ? '1rem' : ''}}
          variant="overlay"
          animation="pulse"
          width="100%"
          height="100%"
        />
      )}
      <Image
        alt={alt}
        src={finalSrc}
        priority={priority}
        onError={() => setImgSrc(fallbackSrc)}
        onLoad={() => setLoading(false)}
        {...rest}
      />
    </>
  );
};
