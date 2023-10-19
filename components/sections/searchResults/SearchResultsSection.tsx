import React, {FC, useState, useEffect} from 'react';
import {useRouter} from 'next/router';

import ProductsSection from '../specials/ProductsSection';
import {Category} from '@store/slices/category/category';
import Breadcrumb from '@components/globals/Breadcrumb';

interface CategoryDetailsSectionProps {
  category: Category;
}

const SearchResultsSection: FC<CategoryDetailsSectionProps> = ({category}) => {
  const router = useRouter();

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 items-center promo-products">
        <div>
          <Breadcrumb
            prefixTitle="Search Results"
            queryParams={
              Array.isArray(router.query?.uniqueCategoryName)
                ? router.query?.uniqueCategoryName
                : []
            }
          />
        </div>
        <div className="flex justify-between flex-col md:flex-row">
          <div className="text-[#000] font-extralight text-3xl leading-[22px] mb-3">
            Search Results for <span className="text-[#4598ff]">"gjhk"</span>
          </div>
          <div className="text-[#000] font-light text-xs  mb-3">
            Displaying <span className="font-semibold">1 - 4</span> of{' '}
            <span className="font-semibold">4</span> results for{' '}
            <span className="font-semibold"> gjhk</span>
          </div>
        </div>

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

export default SearchResultsSection;
