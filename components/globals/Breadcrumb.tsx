import {ChevronRightIcon, HomeIcon} from '@heroicons/react/24/solid';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {FC} from 'react';

interface Breadcrumb {
  queryParams: string[];
  prefixTitle?: string;
}

const Breadcrumb: FC<Breadcrumb> = ({queryParams, prefixTitle}) => {
  const router = useRouter();

  const removeHyphensAndCapitalize = (text: string) => {
    return text.replace(/-/g, ' ').replace(/(?:^|\s)\S/g, a => {
      return a.toUpperCase();
    });
  };

  return (
    <div className="flex flex-wrap gap-2 text-sm font-medium mb-6 items-center text-[#787b82]">
      <Link href={'/'}>
        <HomeIcon className="h-4 w-4 mr-1 text-[#febe40] " />
      </Link>
      <div>
        <ChevronRightIcon className="h-3 w-3 mr-1 " />
      </div>
      {prefixTitle && <div className=" mr-1 ">{prefixTitle}</div>}
      {queryParams?.map((url, index) => (
        <React.Fragment key={url}>
          <div>
            <ChevronRightIcon className="h-3 w-3 mr-1 " />
          </div>
          <div
            className={`text-[#303541] ${
              index !== queryParams.length - 1 && 'hover:cursor-pointer'
            }`}
            onClick={() => {
              if (index !== queryParams.length - 1) {
                router.push(`/${queryParams.slice(0, index + 1).join('/')}`);
              }
            }}
          >
            {removeHyphensAndCapitalize(url)}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
