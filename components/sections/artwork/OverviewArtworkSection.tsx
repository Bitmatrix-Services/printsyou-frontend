import React, {Dispatch as ReactDispatch, FC, SetStateAction} from 'react';

import OverviewCard from '@components/cards/OverviewCard';
import Container from '@components/globals/Container';

// icons
import ArtworkIcon from '@components/icons/ArtworkIcon';
import OrderingIcon from '@components/icons/OrderingIcon';
import ShippingIcon from '@components/icons/ShippingIcon';
import TosIcon from '@components/icons/TosIcon';
import TestiIcon from '@components/icons/TestiIcon';
import BlogIcon from '@components/icons/BlogIcon';

const tabSectionList = [
  {
    icon: <ArtworkIcon />,
    heading: 'Artwork'
  },
  {
    icon: <OrderingIcon />,
    heading: 'Ordering & Payments'
  },
  {
    icon: <ShippingIcon />,
    heading: 'Shipping'
  },
  {
    icon: <TosIcon />,
    heading: 'Terms & Conditions'
  },
  {
    icon: <TestiIcon />,
    heading: 'Testimonials'
  }
  // {
  //   icon: <BlogIcon />,
  //   heading: 'Promotional Blog'
  // }
];

interface OverviewArtworkSectionProps {
  setTabValue: ReactDispatch<SetStateAction<number>>;
}

const OverviewArtworkSection: FC<OverviewArtworkSectionProps> = ({
  setTabValue
}) => {
  return (
    <section className="py-12 md:py-20">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
          {tabSectionList.map((items, index) => {
            return (
              <OverviewCard
                key={index}
                index={index}
                icon={items.icon}
                heading={items.heading}
                setTabValue={setTabValue}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default OverviewArtworkSection;
