'use client';
import React, {useState, useEffect} from 'react';
import Image, {ImageProps} from 'next/image';
import {Skeleton} from '@mui/joy';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = props => {
  const {src, fallbackSrc = '/assets/logo.png', alt, ...rest} = props;
  const [imgSrc, setImgSrc] = useState(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${src}`);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setImgSrc(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${src}`);
  }, [src]);

  return (
    <>
      {loading && <Skeleton variant="overlay" animation="pulse" width="100%" height="100%" />}
      <Image
        alt={alt}
        src={imgSrc}
        priority
        onError={() => setImgSrc(fallbackSrc)}
        onLoad={() => setLoading(false)}
        {...rest}
      />
    </>
  );
};
