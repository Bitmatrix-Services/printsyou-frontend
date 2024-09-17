import {getCategoryDetailsByUniqueName} from '@components/home/category/category.apis';
import {CategoryDetails} from '@components/home/category/category-details.component';
import {Category} from '@components/home/home.types';
import {metaConstants} from '@utils/constants';
import Head from "next/head";

const CategoryPage = async ({params}: {params: {uniqueCategoryName: string[]}}) => {
  const response = await getCategoryDetailsByUniqueName(params.uniqueCategoryName.join('/'));

  let category: Category | null = null;

  if (response?.payload) category = response.payload;

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'http://schema.org',
              '@type': 'WebPage',
              url: `${process.env.FE_URL}${category?.uniqueCategoryName}`,
              mainEntity: {
                '@context': 'http://schema.org',
                '@type': 'OfferCatalog',
                name: category?.categoryName,
                url: `${process.env.FE_URL}${category?.uniqueCategoryName}`
              }
            })
          }}
        />
      </Head>
      <CategoryDetails category={category} />
    </>
  );
};

export default CategoryPage;

export async function generateMetadata({params}: {params: {uniqueCategoryName: string[]}}) {
  const response = await getCategoryDetailsByUniqueName(params.uniqueCategoryName.join('/'));

  let category: Category | null = null;

  if (response?.payload) category = response.payload;

  return {
    title: `${category?.metaTitle || category?.categoryName} | ${metaConstants.SITE_NAME}`,
    description: category?.metaDescription || '',
    alternates: {
      canonical: `${process.env.FE_URL}categories/${category?.uniqueCategoryName}`
    },
    openGraph: {
      images: category?.imageUrl
        ? [
            {
              url: `${process.env.ASSETS_SERVER_URL}${category?.imageUrl}`
            }
          ]
        : [],
      description: category?.metaDescription ?? '',
      title: category?.categoryName
    }
  };
}
