import React from 'react';
import Container from '../../globals/Container';
import Image from 'next/image';

export const aboutInfo = [
  {
    title: 'Prints You',
    text: `Welcome to PrintsYou, the fresh face in promotional products. Despite being newcomers, our passion drives us to excel in delivering innovative promotional items, executive gifts, and corporate apparel. Our commitment? Exceptional customer service, expert advice, and unbeatable prices. At PrintsYou, we're more than just a business; we're your partners in making an impactful statement. Let's embark on this journey together, creating memorable connections through quality products that resonate with your brand. Your vision, our expertise—let's make your mark in the world.`,
    imageSrc: '/assets/about-us-main.jpeg'
  }
];

const AboutIdentitySection = () => {
  return (
    <>
      <section className="bg-greyLight pt-20 pb-16 lg:pb-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-20 md:gap-16 xl:gap-8 2xl:gap-20 items-center justify-center">
            {aboutInfo.map((about, index) => (
              <>
                <div key={index} className="mt-16 sm:mt-0">
                  <h2 className="text-3xl lg:text-[28px] font-bold capitalize  mb-5 md:text-left md:mr-auto">
                    {about.title}
                  </h2>
                  <div className="text-[16px] leading-[30px] text-mute3 space-y-4">
                    <p> {about.text}</p>
                  </div>
                </div>
                <div key={index} className="mt-16 sm:mt-0">
                  <Image
                    sizes=""
                    style={{position: 'relative'}}
                    layout="resposive"
                    width={471}
                    height={354}
                    className="object-contain w-[85%]"
                    src={about.imageSrc}
                    alt="about us"
                  />
                </div>
              </>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};

export default AboutIdentitySection;
