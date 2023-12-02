import React, {
  FC,
  ReactNode,
  Dispatch as ReactDispatch,
  SetStateAction
} from 'react';

interface OverviewCardProps {
  icon: ReactNode;
  heading: string;
  setTabValue: ReactDispatch<SetStateAction<number>>;
  index: number;
}

const OverviewCard: FC<OverviewCardProps> = ({
  icon,
  heading,
  setTabValue,
  index
}) => {
  return (
    <div
      className="group bg-white hover:bg-primary-500 text-body hover:text-white px-7 py-10 xl:py-12 2xl:py-20 border-b-2 border-b-black hover:cursor-pointer"
      onClick={() => setTabValue(index + 1)}
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
