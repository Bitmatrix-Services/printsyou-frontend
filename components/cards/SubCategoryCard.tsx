import React, {FC} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Category} from '@store/slices/category/category';
import sanitize from 'sanitize-html';

interface ProductsSubCategoryCardProps {
  category: Category;
}

const SubCategoryCard: FC<ProductsSubCategoryCardProps> = ({category}) => {
  return (
    <Link
      href={category.ucategoryName}
      className={`tp-category-sub-cat category-card h-full w-full text-start block relative bg-white border border-[#d9dee4]  `}
    >
      <div className="py-4 flex flex-col items-center px-6 gap-2 ">
        <figure className="  flex justify-center sm:top-0 sm:left-0 sm:translate-x-0 relative min-w-[7rem] w-28 h-28 sm:min-w-[13.125rem] sm:w-[13.125rem] sm:h-[13.125rem]  ">
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain md:w-[60%] lg:w-[85%] "
            width={100}
            height={100}
            src={
              category.imageUrl
                ? `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${category.imageUrl}`
                : `/assets/logo.png`
            }
            alt="category"
          />
        </figure>
        <div className="xl:pr-4">
          <div
            className={`mb-1 text-center block text-body hover:text-[#feab40] font-bold text-sm sm:text-lg capitalize`}
            dangerouslySetInnerHTML={{__html: sanitize(category.categoryName)}}
          ></div>
        </div>
      </div>
    </Link>
  );
};

export default SubCategoryCard;
