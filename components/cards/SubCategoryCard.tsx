import React, {FC} from 'react';
import Link from 'next/link';
import {Category} from '@store/slices/category/category';
import sanitize from 'sanitize-html';
import ImageWithFallback from '@components/ImageWithFallback';

interface ProductsSubCategoryCardProps {
  category: Category;
}

const SubCategoryCard: FC<ProductsSubCategoryCardProps> = ({category}) => {
  return (
    <Link
      href={category.uniqueCategoryName}
      className={`tp-category-sub-cat group category-card h-full w-full tp-product category-card-border text-start block relative bg-white border border-[#d9dee4]  `}
    >
      <div className="py-4 flex flex-col items-center px-6 gap-2 ">
        <figure className="  flex justify-center sm:top-0 sm:left-0 sm:translate-x-0 relative min-w-[7rem] w-28 h-28 sm:min-w-[13.125rem] sm:w-[13.125rem] sm:h-[9.125rem]  ">
          <ImageWithFallback
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain md:w-[60%] lg:w-[85%] "
            fill
            src={category?.imageUrl}
            alt="category"
          />
        </figure>
        <div className="xl:pr-4">
          <div
            className={`mb-1 text-center block text-body group-hover:text-primary-500 font-bold text-sm sm:text-lg capitalize`}
            dangerouslySetInnerHTML={{__html: sanitize(category.categoryName)}}
          ></div>
        </div>
      </div>
    </Link>
  );
};

export default SubCategoryCard;
