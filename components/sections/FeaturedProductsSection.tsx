import React, {FC} from 'react';
import Link from 'next/link';
import Container from '../globals/Container';
import {FeaturedProductCard} from '../cards/FeaturedProductCard';
import {Product} from '@store/slices/product/product';

interface FeaturedSectionProps {
  title: string;
  subTitle: string;
  titleColor?: string;
  subTitleColor?: string;
  products: Product[];
  navNumber?: string;
  viewMoreLink: string;
}

const FeaturedProductSection: FC<FeaturedSectionProps> = ({
  title,
  subTitle,
  products,
  viewMoreLink
}) => {
  return (
    <section className="bg-white pt-8 lg:pt-20">
      <Container>
        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-6">
          <h2
            className={`text-3xl lg:text-4xl font-normal text-headingColor text-center md:text-left md:mr-auto after:mt-3 lg:after:mt-5 after:block atfer:w-full after:h-1 after:bg-primary-500`}
          >
            <span className="mr-2">{title}</span>
            <span>{subTitle}</span>
          </h2>
          {viewMoreLink && (
            <Link
              className="hidden md:block py-2 px-8 text-sm font-semibold btn-outline-1"
              href={viewMoreLink}
            >
              View All
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 xl:gap-8">
          {products?.slice(0, 5).map(product => (
            <div className="col" key={product.id}>
              <FeaturedProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="mt-6 mb-6 md:hidden text-center">
          {viewMoreLink && (
            <Link
              className="py-2 px-8 text-sm font-semibold btn-outline-1"
              href={viewMoreLink}
            >
              View All
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProductSection;
