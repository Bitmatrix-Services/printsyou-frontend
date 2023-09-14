import React, {FC} from 'react';
import OverviewCard from '@components/cards/OverviewCard';

const identityitems = [
  {
    image: '/assets/artwork.svg',
    heading: 'Artwork'
  },
  {
    image: '/assets/ordering.svg',
    heading: 'Ordering & Payments'
  },
  {
    image: '/assets/shipping.svg',
    heading: 'Shipping'
  },
  {
    image: '/assets/tos.svg',
    heading: 'Terms & Conditions'
  },
  {
    image: '/assets/testi.svg',
    heading: 'Testimonials'
  },
  {
    image: '/assets/blog.svg',
    heading: 'Promotional Blog'
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
      <div className="lg:flex justify-center items-centertext-center lg:text-left">
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
