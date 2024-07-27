import React, {FC} from 'react';

import SubCategoryCard from '@components/cards/SubCategoryCard';
import {Category} from '@store/slices/category/category';

interface SubCategoriesSectionProps {
  subCategoryList: Category[];
  categoryName: String;
}

const SubCategoriesSection: FC<SubCategoriesSectionProps> = ({
  subCategoryList,
  categoryName
}) => {
  return (
    <>
      {categoryName ? (
        <h2 className="text-xl my-4 font-bold capitalize">
          {categoryName} Categories
        </h2>
      ) : null}
      <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 2xl:gap-10">
        {subCategoryList
          .sort((a: Category, b: Category) =>
            a.categoryName.localeCompare(b.categoryName)
          )
          .map(category => (
            <li key={category.id}>
              <SubCategoryCard category={category} />
            </li>
          ))}
      </ul>
    </>
  );
};

export default SubCategoriesSection;
