'use client';
import React, {useEffect, useState} from 'react';
import Image, {ImageProps} from 'next/image';
import {Skeleton} from '@mui/joy';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
  skeletonRounded?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = props => {
  const {src, fallbackSrc = '/assets/logo-full.png', skeletonRounded, priority, alt, ...rest} = props;
  const [imgSrc, setImgSrc] = useState(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${src}`);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setImgSrc(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${src}`);
  }, [src]);

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
        src={src ? imgSrc : '/assets/logo-full.png'}
        priority={priority}
        onError={() => setImgSrc(fallbackSrc)}
        onLoad={() => setLoading(false)}
        {...rest}
      />
    </>
  );
};
