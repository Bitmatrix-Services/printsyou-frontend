'use client';
import Image from 'next/image';
import React, {FC} from 'react';
import {Category} from '@components/home/home.types';
import Link from 'next/link';

interface ICategoryCard {
  category: Category;
}
export const CategoryCard: FC<ICategoryCard> = ({category}) => {
  return (
    <Link className="text-center" href={`/categories/${category.uniqueCategoryName}?size=20&filter=priceLowToHigh`}>
      <div className="flex bg-white shadow-category overflow-hidden rounded-full h-[9rem] w-[9rem] mx-auto p-2 items-center justify-center">
        <Image
          className="object-contain w-[90px] h-[90px]"
          width={90}
          height={90}
          src={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${category.imageUrl}`}
          alt={category.categoryName}
        />
      </div>
      <h6 className="mt-4 text-base font-medium capitalize text-mute">{category.categoryName}</h6>
    </Link>
  );
};
