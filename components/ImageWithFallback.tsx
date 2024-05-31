import React, {useState, useEffect} from 'react';
import Image, {ImageProps} from 'next/image';
import getConfig from 'next/config';
import {Skeleton} from '@mui/material';

const config = getConfig();

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = props => {
  const {src, fallbackSrc = '/assets/logo.png', alt, ...rest} = props;
  const [imgSrc, setImgSrc] = useState(
    `${config.publicRuntimeConfig.ASSETS_SERVER_URL}${src}`
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setImgSrc(`${config.publicRuntimeConfig.ASSETS_SERVER_URL}${src}`);
  }, [src]);

  return (
    <>
      {loading && (
        <div
          className="items-center flex justify-center "
          style={{height: '100%', width: '100%'}}
        >
          <Skeleton
            variant="rounded"
            animation="pulse"
            width="90%"
            height="90%"
          />
        </div>
      )}
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

export default ImageWithFallback;
