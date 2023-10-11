import React, {FC} from 'react';
import Link from 'next/link';
import {ChevronRightIcon, HomeIcon} from '@heroicons/react/24/solid';
import sanitize from 'sanitize-html';

import ProductSubCategoriesSection from './SubCategoriesSection';
import ProductsSection from '../specials/ProductsSection';
import {Category} from '@store/slices/category/category';
import {getCateoryTitleAndDescription} from '@utils/utils';

interface CategoryDetailsSectionProps {
  category: Category;
}

const CateoryDetailsSection: FC<CategoryDetailsSectionProps> = ({category}) => {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 items-center promo-products">
        <div>
          <div className="flex text-sm font-medium mb-6 items-center text-[#787b82]">
            <Link href={'/'}>
              <HomeIcon className="h-4 w-4 mr-1 text-[#febe40] " />
            </Link>
            <div>
              <ChevronRightIcon className="h-3 w-3 mr-1 " />
            </div>
            <Link className=" mr-1 " href={'/'}>
              Promotional Products
            </Link>
            <div>
              <ChevronRightIcon className="h-3 w-3 mr-1 " />
            </div>
            <div
              className="text-[#303541]"
              dangerouslySetInnerHTML={{
                __html: sanitize(category.categoryName)
              }}
            ></div>
          </div>
        </div>
        {category?.categoryDescription && (
          <div className="flex gap-2">
            <div className="pt-2 pb-8 mb-2">
              <div className="text-[#303541] font-light text-[32px] leading-[41.6px] mb-3">
                {
                  getCateoryTitleAndDescription(category.categoryDescription)
                    ?.title
                }
              </div>
              {getCateoryTitleAndDescription(
                category.categoryDescription
              )?.descriptionList?.map(text => (
                <p
                  key={text}
                  className=" font-normal text-mute3  text-[16px] py-2 font-poppins"
                >
                  {text}
                </p>
              ))}
            </div>
          </div>
        )}
        {category.subCategories.length > 0 && (
          <ProductSubCategoriesSection
            subCategoryList={category.subCategories}
          />
        )}
        <ProductsSection
          categoryId={category.id}
          isModal={true}
          onSale={false}
          isContainer={false}
        />
      </div>
    </div>
  );
};

export default CateoryDetailsSection;
