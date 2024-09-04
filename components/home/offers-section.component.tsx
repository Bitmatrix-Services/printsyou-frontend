import {Container} from '@components/globals/container.component';
import Image from 'next/image';
import React, {FC} from 'react';

interface IOffersSection {
  imageLeft?: boolean;
  tagLine?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  imageHeight?: number;
}

export const OffersSection: FC<IOffersSection> = ({
  imageLeft = false,
  tagLine,
  title,
  subtitle,
  description,
  imageUrl,
  imageHeight
}) => {
  return (
    <section className="bg-primary-500 bg-opacity-[12%] py-9 my-10">
      <Container>
        {tagLine ? (
          <h2 className="mb-14 text-center text-black font-extrabold text-2xl capitalize">{tagLine}</h2>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
          <div className={`col self-center ${!imageLeft ? 'order-1' : 'order-2'}`}>
            <h3 className="text-center mb-3 text-black font-extrabold text-4xl capitalize">{title}</h3>
            <h4 className="text-center mb-3 text-black font-extrabold text-2xl capitalize">{subtitle}</h4>
            <p className="text-lg md:text-xl">{description}</p>
          </div>
          <div className={`col relative ${imageLeft ? 'order-1' : 'order-2'}`} style={{height: imageHeight}}>
            <Image className="object-contain" fill src={imageUrl} alt={`${title}`} />
          </div>
        </div>
      </Container>
    </section>
  );
};
