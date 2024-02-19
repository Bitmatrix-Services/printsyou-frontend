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
    <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 2xl:gap-10">
      {subCategoryList.map(category => (
        <li key={category.id}>
          <SubCategoryCard category={category} />
        </li>
      ))}
    </ul>
  );
};

export default SubCategoriesSection;
