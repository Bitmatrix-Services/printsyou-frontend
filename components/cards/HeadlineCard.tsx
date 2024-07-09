import React, {FC} from 'react';
import Image from 'next/image';

interface HeadlineCardProps {
  text: string;
}

const HeadlineCard: FC<HeadlineCardProps> = ({text}) => {
  return (
    <div className="bg-[#323a4d] border-l-4 border-[#febe40] pb-10 pl-5 flex flex-wrap items-center gap-3  mb-6">
      <Image
        width={46}
        height={35}
        className="relative -top-3"
        src="/assets/1.png"
        alt="..."
      />
      <div className="flex flex-wrap items-center gap-3 px-5 md:px-14 justify-center md:justify-center basis-[100%]">
        <h2 className="text-white font-normal text-2xl  italic">{text}</h2>
      </div>
    </div>
  );
};

export default HeadlineCard;
