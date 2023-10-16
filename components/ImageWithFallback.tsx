import React, {useState, useEffect} from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  [key: string]: any;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = props => {
  const {src, fallbackSrc, alt, ...rest} = props;
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
