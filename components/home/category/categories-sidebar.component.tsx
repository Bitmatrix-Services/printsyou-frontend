'use client';
import React, {FC} from 'react';
import Link from 'next/link';
import sanitize from 'sanitize-html';
import {Category} from '@components/home/home.types';
import {AiFillCaretRight} from 'react-icons/ai';

interface CategoriesSidebarProps {
  selectedCategory: Category | null;
  siblingCategories: Category[] | [];
}

const CategoriesSidebar: FC<CategoriesSidebarProps> = ({selectedCategory, siblingCategories}) => {
  return (
    <div className="xl:w-64 mb-6 xl:mb-0">
      <div className="lg:w-64 md:w-full mb-4 tablet:w-full">
        <div className="xl:pr-4">
          {selectedCategory && selectedCategory?.subCategories?.length > 0 ? (
            <>
              <div className={`mb-6 block text-body font-semibold text-sm  capitalize`}>ITEM SUB CATEGORIES</div>
              <ul className="text-sm grid grid-cols-2 tablet:gap-x-4 tablet:grid-cols-3 md:grid-cols-3 lg:grid-cols-1">
                {[...selectedCategory.subCategories]
                  .sort((a: Category, b: Category) => a.categoryName.localeCompare(b.categoryName))
                  .map(category => (
                    <li key={category.id} className="flex mb-2">
                      <AiFillCaretRight className="text-primary-500" />
                      <Link
                        className={`ml-1 capitalize text-mute3 hover:text-primary-500`}
                        href={`/categories/${category.uniqueCategoryName}?page=1&size=20&filter=priceLowToHigh`}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: sanitize(category.categoryName)
                          }}
                        ></span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <>
              <div className={`mb-6 block text-body font-semibold text-sm  capitalize`}>ITEM CATEGORIES</div>
              <ul className="text-sm grid grid-cols-2 tablet:gap-x-4 tablet:grid-cols-3 md:grid-cols-3 lg:grid-cols-1">
                {siblingCategories
                  ?.sort((a: Category, b: Category) => a.categoryName.localeCompare(b.categoryName))
                  .map((category, index) => (
                    <li key={index} className="flex mb-2 items-center">
                      <AiFillCaretRight className="text-primary-500" />
                      <Link
                        className={`ml-1 capitalize text-mute3 hover:text-primary-500`}
                        href={`/categories/${category.uniqueCategoryName}?page=1&size=20&filter=priceLowToHigh`}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: sanitize(category.categoryName)
                          }}
                        ></span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSidebar;
