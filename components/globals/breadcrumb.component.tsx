'use client';
import {GoHome} from 'react-icons/go';
import {MdOutlineChevronRight} from 'react-icons/md';
import React, {FC, useMemo} from 'react';
import {Container} from '@components/globals/container.component';
import {Crumbs} from '@components/home/home.types';
import Link from 'next/link';

interface IBreadcrumb {
  list: Crumbs[];
  prefixTitle?: string;
}

const BreadcrumbItem = React.memo(({item, isLast}: {item: any; isLast: boolean}) => (
  <>
    <div aria-hidden="true">
      <MdOutlineChevronRight className="h-5 w-5 mr-1" />
    </div>
    <Link
      href={`/categories/${item.uniqueCategoryName}`}
      className={`text-sm capitalize ${
        isLast ? 'font-medium text-primary-500' : 'text-mute4 hover:text-primary-500 hover:cursor-pointer'
      }`}
    >
      {item.name}
    </Link>
  </>
));

export const Breadcrumb: FC<IBreadcrumb> = ({prefixTitle, list}) => {
  const sortedList = useMemo(() => [...list].sort((a, b) => a.sequenceNumber - b.sequenceNumber), [list]);

  const isPromotional = useMemo(
    () => prefixTitle === 'Promotional Categories' || prefixTitle === 'Promotional Products',
    [prefixTitle]
  );

  const renderPrefix = useMemo(() => {
    if (!prefixTitle) return null;

    if (isPromotional) {
      return (
        <Link href="/categories">
          <div className="text-sm hover:text-primary-500">{prefixTitle}</div>
        </Link>
      );
    }

    return (
      <div className={`${list.length === 0 ? 'font-medium text-primary-500' : 'text-sm text-mute2'}`}>
        {prefixTitle}
      </div>
    );
  }, [prefixTitle, isPromotional, list.length]);

  return (
    <div className="py-4 bg-mute5">
      <Container>
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 items-center text-mute4">
          <Link href="/" aria-label="Home">
            <GoHome className="h-5 w-5 text-mute2 hover:text-primary-500" />
          </Link>

          <MdOutlineChevronRight className="h-5 w-5" aria-hidden="true" />

          {renderPrefix}

          {sortedList.map((item, index) => (
            <BreadcrumbItem key={item.id} item={item} isLast={index === sortedList.length - 1} />
          ))}
        </nav>
      </Container>
    </div>
  );
};
