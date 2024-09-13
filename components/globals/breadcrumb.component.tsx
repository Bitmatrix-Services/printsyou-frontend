'use client';
import {GoHome} from 'react-icons/go';
import {MdOutlineChevronRight} from 'react-icons/md';
import {FC, Fragment} from 'react';
import {Container} from '@components/globals/container.component';
import {Crumbs} from '@components/home/home.types';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {v4 as uuidv4} from 'uuid';

interface IBreadcrumb {
  list: Crumbs[];
  prefixTitle?: string;
}

export const Breadcrumb: FC<IBreadcrumb> = ({list, prefixTitle}) => {
  const router = useRouter();
  return (
    <div className="py-4 bg-mute5">
      <Container>
        <div className="flex flex-wrap gap-2 items-center text-mute4">
          <Link href={'/'}>
            <GoHome className="h-5 w-5 text-mute2" />
          </Link>
          <div>
            <MdOutlineChevronRight className="h-5 w-5" />
          </div>
          {prefixTitle && (
            <div className={`${list.length === 0 ? 'font-medium text-primary-500' : 'text-sm text-mute4'}`}>
              {prefixTitle}
            </div>
          )}
          {list.length > 0 &&
            [...list]
              ?.sort((a, b) => b.sequenceNumber - a.sequenceNumber)
              .map((listItem, index) => (
                <Fragment key={uuidv4()}>
                  <div>
                    <MdOutlineChevronRight className="h-5 w-5 mr-1" />
                  </div>
                  <div
                    className={`text-sm capitalize ${
                      index == list.length - 1
                        ? 'font-medium text-primary-500'
                        : 'text-mute4 hover:text-primary-700 hover:cursor-pointer'
                    }`}
                    onClick={() => {
                      if (index !== list.length - 1) {
                        router.push(`/categories/${listItem.uniqueCategoryName}`);
                      }
                    }}
                  >
                    {listItem.name}
                  </div>
                </Fragment>
              ))}
        </div>
      </Container>
    </div>
  );
};
