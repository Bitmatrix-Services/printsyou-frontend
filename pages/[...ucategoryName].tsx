import React, {FC} from 'react';

import CateoryDetailsSection from '@components/sections/promotionalProducts/CateoryDetailsSection';
import Container from '@components/globals/Container';
import Sidebar from '@components/globals/Sidebar';
import {Category} from '@store/slices/category/category';
import {GetServerSidePropsContext} from 'next';
import {http} from 'services/axios.service';

interface CategoryDetailsProps {
  category: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({category}) => {
  return (
    <main>
      <div className="bg-white footer pt-8">
        <Container>
          <div className="flex flex-col md:flex-row gap-3 lg:gap-8">
            <Sidebar selectedCategory={category} />
            <CateoryDetailsSection category={category} />
          </div>
        </Container>
      </div>
    </main>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const {data} = await http.get(
    `/category/uCategory?uCategoryName=${context.query.ucategoryName}`
  );

  let category = data.payload ?? {};
  return {props: {category}};
};

export default CategoryDetails;
