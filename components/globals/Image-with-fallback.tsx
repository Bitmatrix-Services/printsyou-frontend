'use client';
import React, {useEffect, useState} from 'react';
import Image, {ImageProps} from 'next/image';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
  skeletonRounded?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = props => {
  const {src, fallbackSrc = '/assets/logo-full.png', skeletonRounded, priority, loading: loadingProp, alt, ...rest} = props;
  const [imgSrc, setImgSrc] = useState(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${src}`);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${src}`);
    setHasError(false);
  }, [src]);

  return (
    <Image
      alt={alt}
      src={hasError ? fallbackSrc : (src ? imgSrc : '/assets/logo-full.png')}
      priority={priority}
      loading={priority ? 'eager' : loadingProp}
      onError={() => setHasError(true)}
      fetchPriority={priority ? 'high' : 'auto'}
      // Use blur placeholder for non-priority images to prevent CLS
      placeholder={priority ? 'empty' : 'empty'}
      {...rest}
    />
  );
};
