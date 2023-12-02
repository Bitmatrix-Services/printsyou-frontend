import React, {FC} from 'react';

import CateoryDetailsSection from '@components/sections/promotionalProducts/CateoryDetailsSection';
import Container from '@components/globals/Container';
import Sidebar from '@components/globals/Sidebar';
import {Category} from '@store/slices/category/category';
import {GetServerSidePropsContext} from 'next';
import {http} from 'services/axios.service';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';

interface CategoryDetailsProps {
  category: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({category}) => {
  return (
    <>
      <NextSeo
        title={`${category.metaTitle || category.categoryName} | ${
          metaConstants.SITE_NAME
        }`}
        description={category.metaDescription || ''}
        openGraph={{
          images: category.imageUrl
            ? [
                {
                  url: `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${category.imageUrl}`
                }
              ]
            : []
        }}
      />
      <div className="bg-white footer pt-8">
        <Container>
          <div className="flex flex-col md:flex-row gap-3 lg:gap-8">
            <Sidebar selectedCategory={category} />
            <CateoryDetailsSection category={category} />
          </div>
        </Container>
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const uniqueCategoryName = context.params?.uniqueCategoryName;

  let category = {};

  if (Array.isArray(uniqueCategoryName)) {
    const {data} = await http.get(
      `category?uCategoryName=${uniqueCategoryName.join('/')}`
    );
    category = data.payload;
  }
  return {props: {category}};
};

export default CategoryDetails;
