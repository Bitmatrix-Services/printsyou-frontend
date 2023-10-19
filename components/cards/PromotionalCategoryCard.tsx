import React, {FC} from 'react';
import Link from 'next/link';
import sanitize from 'sanitize-html';

import {ShoppingBagIcon} from '@heroicons/react/24/outline';
import {Category} from '@store/slices/category/category';
import ImageWithFallback from '@components/ImageWithFallback';

interface CategoryCardProps {
  category: Category;
}

const PromotionalCategoryCard: FC<CategoryCardProps> = ({category}) => {
  return (
    <Link
      href={category.uniqueCategoryName}
      className={`category-card h-full w-full text-start block relative bg-white border border-[#d9dee4] border-t-2 sm:border-t-body hover:border-t-[#e42b1e]`}
    >
      <div className="pt-14 pb-2 sm:py-10 flex flex-col sm:flex-row items-center px-6 2xl:px-0 gap-6 xl:gap-0">
        <figure className="block absolute -top-16 left-1/2 -translate-x-1/2 sm:top-0 sm:left-0 sm:relative min-w-[7rem] w-28 h-28 sm:min-w-[13.125rem] sm:w-[13.125rem] sm:h-[13.125rem] md:min-w-[9rem] md:w-[9rem] md:h-[9rem] lg:min-w-[7rem] lg:w-[7rem] lg:h-[7rem]  xl:w-[11rem] xl:h-[11rem] xl:min-w-[11rem] 2xl:min-w-[8.5rem] 2xl:w-[8.5rem] 2xl:h-[8.5rem] sm:scale-105 sm:-translate-x-11">
          <ImageWithFallback
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            fill
            src={
              category?.imageUrl &&
              category.imageUrl &&
              `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${category.imageUrl}`
            }
            fallbackSrc={'/assets/logo.png'}
            alt="category"
          />
        </figure>
        <div className="xl:pr-4">
          <Link
            href={category.uniqueCategoryName}
            className={`mb-4 block text-body hover:text-[#e42b1e] font-bold text-sm sm:text-base 2xl:text-sm text-center sm:text-left capitalize`}
          >
            <span
              title={sanitize(category.categoryName)}
              className="sm:line-clamp-1"
              dangerouslySetInnerHTML={{
                __html: sanitize(category.categoryName)
              }}
            ></span>
          </Link>
          <ul className="hidden sm:block text-sm space-y-1 category-card__categories">
            {category.subCategories?.slice(0, 6).map(subCat => (
              <li key={subCat.id} className="bullet-icon">
                <Link
                  title={subCat.categoryName}
                  className={`capitalize text-mute3 md:text-xs hover:text-[#e42b1e] line-clamp-1`}
                  href={subCat.uniqueCategoryName}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: sanitize(subCat.categoryName)
                    }}
                  ></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hidden sm:flex absolute bottom-[-2.125rem] left-1/2 -translate-x-1/2 h-16 w-16 items-center justify-center bg-white hover:bg-body hover:text-white border border-[#3030411a]">
        <Link href={category.uniqueCategoryName}>
          <ShoppingBagIcon className="h-7 w-7" />
        </Link>
      </div>
    </Link>
  );
};

export default PromotionalCategoryCard;
