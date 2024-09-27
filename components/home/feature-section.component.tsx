import React from 'react';
import Image from 'next/image';
import {Container} from '@components/globals/container.component';

interface ServicesData {
  id: number;
  iconSrc: string;
  title: string;
  description: string;
}

const servicesData: ServicesData[] = [
  {
    id: 1,
    iconSrc: '/assets/f-icon-1.png',
    title: 'Free Delivery',
    description: 'Order Above $400'
  },
  {
    id: 2,
    iconSrc: '/assets/f-icon-2.png',
    title: 'Quality Guaranteed',
    description: 'Proper checking system'
  },
  {
    id: 3,
    iconSrc: '/assets/f-icon-3.png',
    title: '7 Days',
    description: 'Free return policy'
  },
  {
    id: 4,
    iconSrc: '/assets/f-icon-4.png',
    title: '100 %Money Back',
    description: 'Guarantee'
  },
  {
    id: 5,
    iconSrc: '/assets/f-icon-5.png',
    title: 'Best Trusted',
    description: 'Brands'
  }
];

export const FeatureSection = () => {
  return (
    <section className="bg-white my-8">
      <Container>
        <div className="border border-[#ddd] lg:divide-x divide-[#ddd] p-4 flex lg:justify-between flex-wrap">
          {servicesData.map(item => (
            <div key={item.id} className="p-4 py-6">
              <div className="flex items-center gap-4">
                <Image width={36} height={36} src={item.iconSrc} alt={item.title} />
                <div>
                  <h6 className="font-semibold text-headingColor capitalize">{item.title}</h6>
                  <span className="font-normal text-sm text-mute">{item.description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
