import React, {FC, ReactNode} from 'react';
import {tabUrls} from '@utils/Constants';
import {useRouter} from 'next/router';

interface OverviewCardProps {
  icon: ReactNode;
  heading: string;
  index: number;
}

const OverviewCard: FC<OverviewCardProps> = ({icon, heading, index}) => {
  const router = useRouter();
  return (
    <div
      className="group bg-white hover:bg-primary-500 text-body hover:text-white px-7 py-10 xl:py-12 2xl:py-20 border-b-2 border-b-black hover:cursor-pointer"
      onClick={() => {
        router.push(
          `/aditional_information/${tabUrls[index + 1]
            .toLowerCase()
            .replace(/\s+/g, '_')}`
        );
      }}
    >
      <div className="flex flex-col justify-center items-center text-center">
        <div className="h-24 w-24 min-w-[6rem] relative mb-4">
          <span className="text-primary-500 group-hover:text-white">
            {icon}
          </span>
        </div>
        <h6 className="mt-4 font-medium text-2xl">{heading}</h6>
      </div>
    </div>
  );
};

export default OverviewCard;
