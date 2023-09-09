import React, {FC} from 'react';
import OverviewCard from '@components/cards/OverviewCard';
import Link from 'next/link';

const identityitems = [
  {
    image: '/assets/artwork.svg',
    heading: 'In-House embroidery and art department'
  },
  {
    image: '/assets/ordering.svg',
    heading: 'Exclusive promotional products'
  },
  {
    image: '/assets/shipping.svg',
    heading: '35 years in the business'
  },
  {
    image: '/assets/tos.svg',
    heading: 'Trained Product Service Specialists'
  },
  {
    image: '/assets/testi.svg',
    heading: 'Offices in Chicago, Miami, Houston and Denver'
  },
  {
    image: '/assets/blog.svg',
    heading: '35 years in the business'
  }
];

interface OverviewArtworkSectionProps {
  setTabValue: any;
}

const OverviewArtworkSection: FC<OverviewArtworkSectionProps> = ({
  setTabValue
}) => {
  return (
    <section className="w-full  xl:flex justify-center items-center pt-20 pb-24">
      <div className="lg:flex justify-center items-center gap-12 text-center lg:text-left">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {identityitems.map((items, index) => {
            return (
              <OverviewCard
                key={index}
                index={index}
                image={items.image}
                heading={items.heading}
                setTabValue={setTabValue}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OverviewArtworkSection;
