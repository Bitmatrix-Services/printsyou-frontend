import React from 'react';
import Container from '../../globals/Container';
import Image from 'next/image';

export const aboutInfo = [
  {
    title: 'Identity Links',
    text: 'A family-operated promotional products company has been in business since 1971. We are importers and distributors of low cost promotional items, executive logo gifts, and corporate apparel. As veterans in the corporate imprinted gift industry, we know what it takes to attract and keep valued clients. Prompt customer service, a knowledgeable and friendly sales staff, and the lowest prices on the web are what keep our clients coming back.',
    imageSrc: '/assets/image-1.png'
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
                  <div className="text-base text-mute2 space-y-4">
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
                    alt="..."
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
