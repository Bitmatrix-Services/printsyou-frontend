'use client';
import React, {FC} from 'react';
import {Category} from '@components/home/home.types';
import Link from 'next/link';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {buildCategoryUrl} from '@utils/url-builder';

interface ICategoryCard {
  category: Category;
}
export const CategoryCard: FC<ICategoryCard> = ({category}) => {
  // Use URL builder to respect LEGACY/CLEAN format
  const href = buildCategoryUrl(category);

  return (
    <Link className="text-center" href={href}>
      <div className="flex bg-white shadow-category overflow-hidden rounded-full h-[9rem] w-[9rem] mx-auto p-2 items-center justify-center">
        <ImageWithFallback
          className="object-contain w-[90px] h-[90px]"
          width={90}
          height={90}
          src={category.imageUrl || ''}
          alt={`Image of ${category.categoryName}`}
          priority={true}
        />
      </div>
      <h3 className="mt-4 text-base font-medium capitalize text-mute">{category.categoryName}</h3>
    </Link>
  );
};
