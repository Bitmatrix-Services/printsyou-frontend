import React from 'react';
import Container from '../../globals/Container';
import Link from 'next/link';
import AboutPageServicesCard from '@components/cards/AboutPageServicesCard';

const identityitems = [
  {
    image: '/assets/samples.svg',
    heading: 'Free Samples',
    text: 'Free samples for inspection, so you know exactly what you are buying.'
  },
  {
    image: '/assets/art.svg',
    heading: 'Art Services',
    text: 'Just send us whatever you have. Our expert art staff will convert it to the proper format suitable for reproduction on the item(s) of your choice.'
  },
  {
    image: '/assets/rush.svg',
    heading: 'Rush Service',
    text: 'A large percentage of our promotional products line is available for 3-day or 1-day Rush Service, at no additional charge.'
  },
  {
    image: '/assets/email.svg',
    heading: 'E-Mail Order Updates',
    text: 'We will notify you with the progress of your order upon date of entry, date due, production dates, and a final e-mail notice with your UPS tracking numbers. This way, you will not have to worry about checking on your order.'
  },
  {
    image: '/assets/idea.svg',
    heading: 'Idea Theme Center',
    text: 'Our experienced sales representatives (average of 9 years in the industry) will prepare a custom Idea Presentation at no charge. Just tell us the promotional theme for your campaign and approximate budget. We will supply a full-color presentation within the hour of unique promotional products specific to your event or target market.'
  }
];

const IconBoxesSection = () => {
  return (
    <section className="w-full bg-center bg-wave xl:flex justify-center items-center pt-20 pb-24">
      <Container>
        <div className="lg:flex justify-center items-center gap-12 text-center lg:text-left">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {identityitems.map((items, index) => {
              return (
                <AboutPageServicesCard
                  key={index}
                  image={items.image}
                  heading={items.heading}
                  text={items.text}
                />
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default IconBoxesSection;
