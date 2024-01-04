import React, {FC} from 'react';

import CateoryDetailsSection from '@components/sections/promotionalProducts/CateoryDetailsSection';
import Container from '@components/globals/Container';
import Sidebar from '@components/globals/Sidebar';
import {Category} from '@store/slices/category/category';
import {GetServerSidePropsContext} from 'next';
import {http} from 'services/axios.service';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';
import {resend} from './_app';
import getConfig from 'next/config';

const config = getConfig();

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
                  url: `${config.publicRuntimeConfig.ASSETS_SERVER_URL}${category.imageUrl}`
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
  const uniqueCategoryName = context.query.uniqueCategoryName;

  try {
    let category = {};
    if (Array.isArray(uniqueCategoryName)) {
      const {data} = await http.get(
        `category?uCategoryName=${uniqueCategoryName.join('/')}`
      );
      category = data.payload;
    }
    return {props: {category}};
  } catch (error) {
    if (Array.isArray(uniqueCategoryName)) {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [
          'abdul.wahab394.aw@gmail.com',
          'awais.tariqq@gmail.com',
          'saimali78941@gmail.com'
        ],
        subject: 'Error in Category',
        html: `<h3>unique name of the category</h3> 
      <h3>${uniqueCategoryName.join('/')}</h3>
      <h3>Error: ${error}</h3>`
      });
    }
  }
};

export default CategoryDetails;
