'use client';
import {GoHome} from 'react-icons/go';
import {MdOutlineChevronRight} from 'react-icons/md';
import React, {FC, useMemo} from 'react';
import {Container} from '@components/globals/container.component';
import {Crumbs} from '@components/home/home.types';
import Link from 'next/link';
import {buildCategoryUrl, UrlFormat} from '@utils/url-builder';

interface CrumbWithUrlFormat extends Crumbs {
  urlFormat?: UrlFormat;
}

interface IBreadcrumb {
  list: CrumbWithUrlFormat[];
  prefixTitle?: string;
}

export const Breadcrumb: FC<IBreadcrumb> = ({prefixTitle, list}) => {
  const sortedList = useMemo(() => [...list].sort((a, b) => a.sequenceNumber - b.sequenceNumber), [list]);

  const isPromotional = useMemo(
    () => prefixTitle === 'Categories' || prefixTitle === 'Products',
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
        <nav className="flex flex-wrap gap-2 items-center text-mute4">
          <Link href="/">
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

const BreadcrumbItem = React.memo(({item, isLast}: {item: CrumbWithUrlFormat; isLast: boolean}) => {
  // The last crumb is the current page (category OR product - this list is shared between
  // both) and isn't linked, so it never needs a category-vs-product URL decision here.
  if (isLast) {
    return (
      <>
        <div aria-hidden="true">
          <MdOutlineChevronRight className="h-5 w-5 mr-1" />
        </div>
        <span className="text-sm capitalize font-medium text-primary-500" aria-current="page">
          {item.name}
        </span>
      </>
    );
  }

  // Use URL builder to respect LEGACY/CLEAN format
  const href = buildCategoryUrl({
    uniqueCategoryName: item.uniqueCategoryName,
    urlFormat: item.urlFormat
  });

  return (
    <>
      <div aria-hidden="true">
        <MdOutlineChevronRight className="h-5 w-5 mr-1" />
      </div>
      <Link
        href={href}
        className="text-sm capitalize text-mute4 hover:text-primary-500 hover:cursor-pointer"
      >
        {item.name}
      </Link>
    </>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';
Breadcrumb.displayName = 'Breadcrumb';
