import Container from '@components/globals/Container';
import Image from 'next/image';
import React from 'react';

const cardsList = [
  {
    imageSrc: '/assets/b-icon-1.png',
    title: 'Thousands of vendors',
    description: `A large number of retail establishments, potentially ranging from small local shops to large chain stores. These stores could offer a variety of products and services, catering to diverse customer needs. The phrase highlights the vastness and diversity of the retail landscape, suggesting extensive shopping options available to consumers.`,
    linkHref: '#'
  },
  {
    imageSrc: '/assets/b-icon-2.png',
    title: '100% Trusted by customers and store owners',
    description: `Trusted by customers and store owners, our products consistently deliver quality and reliability. With a proven track record, we prioritize satisfaction and build long term relationships. Our commitment to excellence ensures that every purchase meets the highest standards.`,
    linkHref: '#'
  },
  {
    imageSrc: '/assets/b-icon-3.png',
    title: 'Easy Checkout & payment system',
    description: `Streamlined platform designed to simplify and expedite the online shopping experience. It offers quick, secure transactions with minimal steps, enhancing customer satisfaction. Its user-friendly interface supports multiple payment options, ensuring convenience and flexibility for all users.`,
    linkHref: '#'
  }
];

const BenefitsSection = () => {
  return (
    <section className="bg-white py-10 lg:pt-20 pb-10">
      <Container>
        <div className="mb-8 max-w-[38.5625rem] mx-auto text-center">
          <h4 className="mb-4 font-light text-headingColor text-4xl leading-tight lg:text-[2.625rem] lg:leading-tight">
            Benefits of Choosing <b className="font-semibold">Printsyou</b>
          </h4>
          <p className="text-[#666] font-normal"></p>
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
                {/*<div className="mt-auto pt-4">*/}
                {/*  <Link*/}
                {/*    href={card.linkHref}*/}
                {/*    className="flex items-center gap-2 font-semibold text-primary-500 group-hover:text-headingColor hover:opacity-80"*/}
                {/*  >*/}
                {/*    <span>Learn more</span>*/}
                {/*    <ArrowRightIcon className="h-4 w-4" />*/}
                {/*  </Link>*/}
                {/*</div>*/}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BenefitsSection;
