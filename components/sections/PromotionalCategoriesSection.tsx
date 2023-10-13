import React, {FC} from 'react';

import Container from '../globals/Container';
import PromotionalCategoryCard from '../cards/PromotionalCategoryCard';
import {useAppSelector} from '@store/hooks';
import {selectPromotionalCategories} from '@store/slices/category/catgory.slice';

const PromotionalCategoriesSection= () => {
  const promotionalCategories= useAppSelector(selectPromotionalCategories)

  return (
    <>
      <section className="bg-greyLight pt-10 pb-8 lg:pb-20">
        <Container>
          <div>
            <h2 className="mb-10 text-center text-body text-xl font-normal uppercase tracking-[3px]">
              POPULAR PROMOTIONAL PRODUCT CATEGORIES
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-20 md:gap-16 xl:gap-8 2xl:gap-20">
              {promotionalCategories?.map((category) => (
                <li key={category.id} className="mt-16 sm:mt-0">
                  <PromotionalCategoryCard category={category} />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
};

export default PromotionalCategoriesSection;
