import {FC} from 'react';
import {HiOutlineArrowNarrowRight} from 'react-icons/hi';
import Link from 'next/link';

interface ISectionHeadingProps {
  title: string;
  showAllUrl?: string;
}

export const SectionHeading: FC<ISectionHeadingProps> = ({title, showAllUrl}) => {
  return (
    <div className="flex gap-6 items-baseline justify-start my-10">
      <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold capitalize">{title}</h2>
      {showAllUrl ? (
        <Link className="flex items-center gap-2 cursor-pointer" href={showAllUrl}>
          <h3 className="font-medium text-md hover:text-primary-500">Show All</h3>
          <HiOutlineArrowNarrowRight className="text-primary-500 h-6 w-6" />
        </Link>
      ) : null}
    </div>
  );
};
