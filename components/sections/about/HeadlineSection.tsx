import React from 'react';

import Container from '../../globals/Container';
import Image from 'next/image';

const HeadlineSection = () => {
  const headinText =
    "“We're here to make your purchasing experience an easy and enjoyable one. Here are some of the ways we do it.”";

  return (
    <section className="bg-white py-8 lg:pt-0 ">
      <Container>
        <div className="bg-[#323a4d] border-l-4 border-[#febe40] py-10 pl-5 flex flex-wrap items-center gap-3  mb-6">
          <Image
            width={46}
            height={35}
            className="absolute -top-4"
            src="/assets/1.png"
            alt="..."
          />
          <div className="flex flex-wrap items-center gap-3 px-5 md:px-14 justify-center md:justify-center basis-[100%]">
            <h1 className="text-white font-normal text-2xl  italic">
              {headinText}
            </h1>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeadlineSection;
