import Container from '@components/globals/Container';
import {ArrowRightIcon} from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const cardsList = [
  {
    imageSrc: '/assets/b-icon-1.png',
    title: 'Thousands of stores',
    description: 'Lorem Ipsum dollar sit smit ameda lorem ipsum Lorem Ipsum',
    linkHref: '#'
  },
  {
    imageSrc: '/assets/b-icon-2.png',
    title: '100% trusted by customers and store owners',
    description:
      'Lorem Ipsum dollar sit smit ameda lorem ipsum Lorem Ipsum dollar sit smit ameda lorem ipsum',
    linkHref: '#'
  },
  {
    imageSrc: '/assets/b-icon-3.png',
    title: 'Easy Checkout & payment system',
    description: 'Hire remote teams that work in the same time zone as you.',
    linkHref: '#'
  }
];

const BenefitsSection = () => {
  return (
    <section className="bg-white py-10 lg:py-20">
      <Container>
        <div className="mb-12 max-w-[38.5625rem] mx-auto text-center">
          <h1 className="mb-4 font-light text-headingColor text-4xl leading-tight lg:text-[2.625rem] lg:leading-tight">
            Benefits of Choosing <b className="font-semibold">Printsyou</b>
          </h1>
          <p className="text-[#666] font-normal">
            Lorem Ipsum dollar sit smit ameda lorem ipsum Lorem Ipsum dollar sit
            smit ameda lorem ipsumLorem Ipsum dollar sit smit ameda lorem
            ipsumLorem Ipsum dollar sit smit ameda lorem ipsum
          </p>
        </div>
        <div className="flex flex-wrap">
          {cardsList.map((card, index) => (
            <div
              key={index}
              className="col w-full md:w-1/2 lg:w-1/3 p-4 xl:p-8"
            >
              <div className="card h-full flex flex-col group p-6 rounded-[1.25rem] bg-[#f6f7f9a3] hover:bg-primary-500">
                <div className="bg-primary-500 group-hover:bg-body rounded-full h-16 w-16 min-w-[4rem] flex items-center justify-center">
                  <Image
                    style={{minWidth: 36}}
                    width={36}
                    height={36}
                    src={card.imageSrc}
                    alt="..."
                  />
                </div>
                <h4 className="mt-4 text-body group-hover:text-headingColor text-[1.375rem] font-semibold">
                  {card.title}
                </h4>
                <p className="mt-2 text-[#666] font-normal line-clamp-3">
                  {card.description}
                </p>
                <div className="mt-auto pt-4">
                  <Link
                    href={card.linkHref}
                    className="flex items-center gap-2 font-semibold text-primary-500 group-hover:text-headingColor hover:opacity-80"
                  >
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BenefitsSection;
