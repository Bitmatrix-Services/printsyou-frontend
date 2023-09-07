import React, {FC} from 'react';

import {ChevronRightIcon, HomeIcon} from '@heroicons/react/24/solid';

interface PageHeaderProps {
  pageTitle: String;
}

const PageHeader: FC<PageHeaderProps> = ({pageTitle}) => {
  return (
    <div className="bg-[#f5f4f6]">
      <div className="max-w-[100rem] mx-auto px-4 md:px-8 xl:px-24 py-8 xl:py-14 relative">
        <div className="text-4xl font-bold">Identity-Links - {pageTitle}</div>
        <div className="flex text-sm font-medium mt-6 items-center">
          <HomeIcon className="h-4 w-4 mr-1" />
          <ChevronRightIcon className="h-3 w-3 mr-1" />
          {pageTitle}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
