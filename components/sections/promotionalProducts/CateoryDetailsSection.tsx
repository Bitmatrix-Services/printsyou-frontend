import React, {FC, useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import ProductSubCategoriesSection from './SubCategoriesSection';
import ProductsSection from '../specials/ProductsSection';
import {Category} from '@store/slices/category/category';
import {getCateoryTitleAndDescription} from '@utils/utils';
import Breadcrumb from '@components/globals/Breadcrumb';

interface CategoryDetailsSectionProps {
  category: Category;
}

const CategoryDetailsSection: FC<CategoryDetailsSectionProps> = ({
  category
}) => {
  const router = useRouter();

  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <>
      <div className="flex-1">
        <div className="grid grid-cols-1 items-center promo-products">
          <div>
            <Breadcrumb
              prefixTitle="Promotional Products"
              list={category.crumbs}
            />
          </div>
          {mount && category?.categoryDescription && (
            <div className="flex gap-2">
              <div className="pt-2 pb-8 mb-2">
                <div
                  className="category-title-desc"
                  dangerouslySetInnerHTML={{
                    __html: category.categoryDescription
                  }}
                ></div>
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
            isContainer={false}
          />
        </div>
      </div>
    </>
  );
};

export default CategoryDetailsSection;
