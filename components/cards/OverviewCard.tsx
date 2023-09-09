import React, {FC} from 'react';
import Image from 'next/image';

interface OverviewCardProps {
  image: string;
  heading: string;
}

const OverviewCard: FC<OverviewCardProps> = ({image, heading}) => {
  return (
    <div className="bg-[#febe40] py-14 px-2 border-b-2 border-b-black">
      <div className="flex flex-col justify-center items-center text-center">
        <div className="h-20 w-20 min-w-[5rem] relative mb-4">
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            className="object-contain"
            src={image}
            alt="..."
          />
        </div>
        <h6 className="mt-4 text-black font-semibold text-base">{heading}</h6>
      </div>
    </div>
  );
};

export default OverviewCard;
