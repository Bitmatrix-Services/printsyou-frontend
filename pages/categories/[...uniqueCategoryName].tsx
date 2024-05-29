import React, {FC} from 'react';
import CategoryDetailsSection from '@components/sections/promotionalProducts/CategoryDetailsSection';
import Container from '@components/globals/Container';
import Sidebar from '@components/globals/Sidebar';
import {Category} from '@store/slices/category/category';
import {GetServerSidePropsContext} from 'next';
import {http} from '../../services/axios.service';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';
import getConfig from 'next/config';
import {AxiosError} from 'axios';

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
            <CategoryDetailsSection category={category} />
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
  } catch (error: any) {
    if ('response' in error) {
      const err = error as AxiosError;
      const response = err.response;
      if (response && response.status == 302) {
        return {
          redirect: {
            permanent: false,
            destination:
              '/categories/' + (response.data as any).payload.redirectTo
          }
        };
      }
      if (
        response &&
        response.status === 404 &&
        Array.isArray(uniqueCategoryName)
      ) {
        const response = await http.get(
          `product/validate?uniqueProductName=${uniqueCategoryName.join('/')}`
        );
        if (response && response.data && response.data.payload) {
          return {
            redirect: {
              permanent: false,
              destination: '/products/' + uniqueCategoryName.join('/')
            }
          };
        }
      }
    }
  }
  return {
    redirect: {
      permanent: false,
      destination: '/404'
    }
  };
};

export default CategoryDetails;
