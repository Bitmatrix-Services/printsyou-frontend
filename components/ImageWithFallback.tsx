import React, {useState, useEffect} from 'react';
import Image, {ImageProps} from 'next/image';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = props => {
  const {src, fallbackSrc = '/assets/logo.png', alt, ...rest} = props;
  const [imgSrc, setImgSrc] = useState(
    `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${src}`
  );

  useEffect(() => {
    setImgSrc(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${src}`);
  }, [src]);

  return (
    <Image
      alt={alt}
      {...rest}
      src={imgSrc}
      priority
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export default ImageWithFallback;
