import React, {FC} from 'react';
import Image from 'next/image';
import {Container} from '@components/globals/container.component';

const pricingList = [
  `In-house services for silk screening, embroidery, and engraving - ensuring quick lead times and lower expenses.`,
  `Diverse inventory of blank items, from promotional pens to calculators, desk clocks, and beyond.`,
  `We will begin by clarifying any information or questions we may have regarding your order or artwork. We will then send you a sales confirmation, along with an artwork proof showing how your artwork or logo will look on the item.`,
  `The sales confirmation will include all charges, including shipping, taxes, setup fees, or any additional charges that may be required based on your artwork.`,
  `The artwork proof can be changed as often as you'd like until you're satisfied with the layout or design.`,
  `On-staff graphic artist to assist with layouts, logo creation, and color choices.Get professional design support for your branding needs.Ensure your visuals are polished and appealing.`,
  `There's no commitment to placing the order online. You can cancel the order at any time before production begins. There will be plenty of communication before we begin production, and we'll work closely with you until you're ready.`
];
const headingText =
  "“We're here to make your purchasing experience an easy and enjoyable one. Here are some of the ways we do it.”";

export const OffersSection = () => {
  return (
    <section className="w-full bg-center xl:flex justify-center items-center pt-20 pb-24 ">
      <Container>
        <div className="bg-[#f5f4f6] py-11">
          <div className="py-10 pl-5 flex flex-wrap items-center gap-3 mb-6 ">
            <Image width={46} height={35} className="md:ml-5" src="/assets/q-mark.png" alt="q-mark" />
            <div className="flex flex-wrap items-center gap-3 px-5 md:px-14 justify-center md:justify-center basis-[100%]">
              <h3 className="text-black font-normal text-3xl ml-4 italic">{headingText}</h3>
            </div>
          </div>

          <div className="py-2 md:w-[90%] m-auto ">
            <div className="md:grid md:grid-cols-2">
              {pricingList.map(item => (
                <PricingCard key={item} description={item} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

interface PricingCardProps {
  description: string;
}

const PricingCard: FC<PricingCardProps> = ({description}) => {
  return (
    <div className="flex my-6 md:pr-6">
      <div className="pr-6 ">
        <div className="h-8 w-8 bg-[#56dabf] rounded-full ">
          <svg
            fill="none"
            stroke="#fff"
            className="w-4 h-4 relative top-2 left-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>
        </div>
      </div>

      <div className="text-[#303541] font-medium text-[16px] leading-6 px-3">{description}</div>
    </div>
  );
};
