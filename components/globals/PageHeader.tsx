import React, {FC} from 'react';

import {ChevronRightIcon, HomeIcon} from '@heroicons/react/24/solid';
import Link from 'next/link';

interface PageHeaderProps {
  pageTitle: string;
}

const PageHeader: FC<PageHeaderProps> = ({pageTitle}) => {
  return (
    <div className="to-secondary-500 from-secondary-700 bg-gradient-to-r text-white">
      <div className="max-w-[100rem] mx-auto px-4 md:px-8 xl:px-24 py-8 xl:py-14 relative">
        <div className="text-4xl font-bold">{pageTitle} | Prints You </div>
        <div className="flex text-sm font-medium mt-6 items-center">
          <Link href={'/'}>
            <HomeIcon className="h-4 w-4 mr-1 text-primary-500" />
          </Link>
          <ChevronRightIcon className="h-3 w-3 mr-1" />
          {pageTitle}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
