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
      href={category.ucategoryName}
      className={`category-card h-full w-full text-start block relative bg-white border border-[#d9dee4] border-t-2 sm:border-t-body hover:border-t-[#e42b1e]`}
    >
      <div className="pt-14 pb-2 sm:py-10 flex flex-col 2xl:flex-row items-center px-6 2xl:px-0 gap-6 xl:gap-0">
        <figure className="block absolute -top-16 left-1/2 -translate-x-1/2 sm:top-0 sm:left-0 sm:translate-x-0 sm:relative min-w-[7rem] w-28 h-28 sm:min-w-[13.125rem] sm:w-[13.125rem] sm:h-[13.125rem] 2xl:scale-105 2xl:-translate-x-11">
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
        <div className="xl:pr-4 ">
          <Link
            href={category.ucategoryName}
            className={`mb-4 block text-body hover:text-[#e42b1e] font-bold text-sm sm:text-lg capitalize`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: sanitize(category.categoryName)
              }}
            ></span>
          </Link>
          <ul className="hidden sm:block text-sm space-y-1 category-card__categories">
            {category.subCategories?.slice(0, 6).map(subCat => (
              <li key={subCat.id} className="bullet-icon">
                <Link
                  className={`capitalize text-mute3 hover:text-[#e42b1e]`}
                  href={subCat.ucategoryName}
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
        <Link href={category.ucategoryName}>
          <ShoppingBagIcon className="h-7 w-7" />
        </Link>
      </div>
    </Link>
  );
};

export default PromotionalCategoryCard;
