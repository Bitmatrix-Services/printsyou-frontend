import React, {useState, useEffect} from 'react';
import Image, {ImageProps} from 'next/image';

interface ImageWithFallbackProps extends ImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = props => {
  const {src, fallbackSrc = '/assets/logo.png', alt, ...rest} = props;
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      alt={alt}
      {...rest}
      src={imgSrc}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export default ImageWithFallback;
