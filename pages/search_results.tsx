import React, {FC} from 'react';

import Container from '@components/globals/Container';
import {Category} from '@store/slices/category/category';
import {GetServerSidePropsContext} from 'next';
import {http} from 'services/axios.service';
import SearchSidebar from '@components/globals/SearchSidebar';
import SearchResultsSection from '@components/sections/searchResults/SearchResultsSection';

interface CategoryDetailsProps {
  category: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({category}) => {
  return (
    <main>
      <div className="bg-white footer pt-8">
        <Container>
          <div className="flex flex-col md:flex-row gap-3 lg:gap-8">
            <SearchSidebar selectedCategory={category} />
            <SearchResultsSection category={category} />
          </div>
        </Container>
      </div>
    </main>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const uniqueCategoryName = 'desktop-office';

  let category = {};
  const {data} = await http.get(
    `category/uCategory?uCategoryName=${uniqueCategoryName}`
  );
  category = data.payload;

  return {props: {category}};
};

export default CategoryDetails;
