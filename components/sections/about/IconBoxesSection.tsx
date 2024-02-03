import React from 'react';
import Container from '../../globals/Container';
import AboutPageServicesCard from '@components/cards/AboutPageServicesCard';

const identityitems = [
  {
    image: '/assets/art.svg',
    heading: 'Art Services',
    text: 'Simply provide us with your materials. Our skilled art team will adapt it into the ideal format for imprinting on your selected products.'
  },
  {
    image: '/assets/rush.svg',
    heading: 'Rush Service',
    text: 'Many of our promotional items are eligible for 3-day or even 1-day Rush Service without any extra cost.'
  },
  {
    image: '/assets/email.svg',
    heading: 'E-Mail Order Updates',
    text: `We'll keep you updated on your order's status, from the entry date to the due date, through production, and finally, with an email including your UPS tracking numbers. Rest assured, you won't need to follow up on your order's progress.`
  },
  {
    image: '/assets/idea.svg',
    heading: 'Idea Theme Center',
    text: `Our seasoned sales team offers personalized Idea Presentations free of charge. Simply share your campaign's theme and budget with us. Same business day, we'll deliver a vibrant, full-color presentation tailored to your event or target audience, featuring unique promotional products.`
  }
];

const IconBoxesSection = () => {
  return (
    <section className="w-full bg-center xl:flex justify-center items-center pt-20 pb-24">
      <Container>
        <div className="lg:flex justify-center items-center gap-12 text-center lg:text-left">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
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
