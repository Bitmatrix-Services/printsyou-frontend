import React, {FC} from 'react';

import SubCategoryCard from '@components/cards/SubCategoryCard';
import {Category} from '@store/slices/category/category';

interface SubCategoriesSectionProps {
  subCategoryList: Category[];
}

const SubCategoriesSection: FC<SubCategoriesSectionProps> = ({
  subCategoryList
}) => {
  return (
    <ul className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 xl:gap-4 2xl:gap-10">
      {subCategoryList.map((category, index) => (
        <li key={category.id} className="mt-16 sm:mt-0">
          <SubCategoryCard category={category} />
        </li>
      ))}
    </ul>
  );
};

export default SubCategoriesSection;
