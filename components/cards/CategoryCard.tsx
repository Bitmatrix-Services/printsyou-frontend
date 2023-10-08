import React, {FC} from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {ShoppingBagIcon} from '@heroicons/react/24/outline';

interface Category {
  title: string;
  imageSrc: string;
  color: string;
  categoryLinks: {title: string; href: string}[];
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: FC<CategoryCardProps> = ({category}) => {
  return (
    <button
      type="button"
      className={`category-card h-full w-full text-start block relative bg-white border border-[#d9dee4] border-t-2 sm:border-t-body sm:hover:border-t-[${category.color}]`}
    >
      <div className="pt-14 pb-2 sm:py-10 flex flex-col 2xl:flex-row items-center px-6 2xl:px-0 gap-6 xl:gap-0">
        <figure className="block absolute -top-16 left-1/2 -translate-x-1/2 sm:top-0 sm:left-0 sm:translate-x-0 sm:relative min-w-[7rem] w-28 h-28 sm:min-w-[13.125rem] sm:w-[13.125rem] sm:h-[13.125rem] 2xl:scale-105 2xl:-translate-x-11">
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            fill
            src={category.imageSrc}
            alt="..."
          />
        </figure>
        <div className="xl:pr-4">
          <Link
            href="!#"
            className={`mb-4 block text-body hover:text-[${category.color}] font-bold text-sm sm:text-lg capitalize`}
          >
            {category.title}
          </Link>
          <ul className="hidden sm:block text-sm space-y-1 category-card__categories">
            {category.categoryLinks.map(link => (
              <li key={link.title}>
                <Link
                  className={`capitalize text-mute3 hover:text-[${category.color}]`}
                  href={link.href}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hidden sm:flex absolute bottom-[-2.125rem] left-1/2 -translate-x-1/2 h-16 w-16 items-center justify-center bg-white hover:bg-body hover:text-white border border-[#3030411a]">
        <ShoppingBagIcon className="h-7 w-7" />
      </div>
    </button>
  );
};

export default CategoryCard;
