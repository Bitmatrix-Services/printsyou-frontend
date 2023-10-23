import React, {FC, useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {NextSeo} from 'next-seo';
import ProductSubCategoriesSection from './SubCategoriesSection';
import ProductsSection from '../specials/ProductsSection';
import {Category} from '@store/slices/category/category';
import {getCateoryTitleAndDescription} from '@utils/utils';
import Breadcrumb from '@components/globals/Breadcrumb';

interface CategoryDetailsSectionProps {
  category: Category;
}

const CateoryDetailsSection: FC<CategoryDetailsSectionProps> = ({category}) => {
  const router = useRouter();

  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <>
      <NextSeo
        title={category.metaTitle ?? ''}
        description={category.metaDescription ?? ''}
        openGraph={{
          images: [
            {
              url: category.imageUrl
                ? `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${category.imageUrl}`
                : '/assets/logo.png',
              height: 70,
              width: 70,
              alt: 'category'
            }
          ]
        }}
      />
      <div className="flex-1">
        <div className="grid grid-cols-1 items-center promo-products">
          <div>
            <Breadcrumb
              prefixTitle="Promotional Products"
              queryParams={
                Array.isArray(router.query?.uniqueCategoryName)
                  ? router.query?.uniqueCategoryName
                  : []
              }
            />
          </div>
          {mount && category?.categoryDescription && (
            <div className="flex gap-2">
              <div className="pt-2 pb-8 mb-2">
                <div className="text-[#303541] font-light text-[32px] leading-[41.6px] mb-3">
                  {
                    getCateoryTitleAndDescription(category.categoryDescription)
                      ?.title
                  }
                </div>
                {getCateoryTitleAndDescription(
                  category.categoryDescription
                )?.descriptionList?.map(text => (
                  <p
                    key={text}
                    className=" font-normal text-mute3  text-[16px] py-2 font-poppins"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
          )}
          {category.subCategories.length > 0 && (
            <ProductSubCategoriesSection
              subCategoryList={category.subCategories}
            />
          )}
          <ProductsSection
            categoryId={category.id}
            isModal={true}
            onSale={false}
            isContainer={false}
          />
        </div>
      </div>
    </>
  );
};

export default CateoryDetailsSection;
