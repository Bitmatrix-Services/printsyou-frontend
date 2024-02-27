import {ChevronRightIcon, HomeIcon} from '@heroicons/react/24/solid';
import {Crumbs} from '@store/slices/category/category';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {FC} from 'react';

interface Breadcrumb {
  list: Crumbs[];
  prefixTitle?: string;
}

const Breadcrumb: FC<Breadcrumb> = ({list, prefixTitle}) => {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 text-sm font-medium mb-6 items-center text-[#787b82]">
      <Link href={'/'}>
        <HomeIcon className="h-4 w-4 mr-1 text-[#febe40] " />
      </Link>
      <div>
        <ChevronRightIcon className="h-3 w-3 mr-1 " />
      </div>
      {prefixTitle && <div className=" mr-1 ">{prefixTitle}</div>}
      {list.length > 0 &&
        [...list]
          ?.sort((a, b) => b.sequenceNumber - a.sequenceNumber)
          .map((listItem, index) => (
            <React.Fragment key={listItem.id}>
              <div>
                <ChevronRightIcon className="h-3 w-3 mr-1 " />
              </div>
              <div
                className={`${
                  index !== list.length - 1
                    ? 'hover:cursor-pointer text-mute2 hover:text-secondary-500'
                    : 'font-semibold text-[#303541]'
                }`}
                onClick={() => {
                  if (index !== list.length - 1) {
                    router.push(`/${listItem.uniqueCategoryName}`);
                  }
                }}
              >
                {listItem.name}
              </div>
            </React.Fragment>
          ))}
    </div>
  );
};

export default Breadcrumb;
