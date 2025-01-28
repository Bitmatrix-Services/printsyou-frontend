import React from 'react';
import Image from 'next/image';
import {Container} from '@components/globals/container.component';

export const HeadlineSection = () => {
  const headingText =
    '“Our goal is to simplify and enhance your shopping journey. Discover the ways we make it happen.”';

  return (
    <section className="bg-white py-8 lg:pt-0 ">
      <Container>
        <div className="bg-primary-500 border-l-4 border-[#febe40] py-10 pl-5 flex flex-wrap items-center gap-3  mb-6">
          <Image width={46} height={35} className="absolute -top-4" src="/assets/q-mark.png" alt="q-mark" />
          <div className="flex flex-wrap items-center gap-3 px-5 md:px-14 justify-center md:justify-center basis-[100%]">
            <h2 className="text-white font-normal text-2xl  italic">{headingText}</h2>
          </div>
        </div>
      </Container>
    </section>
  );
};
