import {
  getAllSiblingCategories,
  getCategoryDetailsByUniqueName,
  getProductsLdForCategoryPage
} from '@components/home/category/category.apis';
import {CategoryDetails} from '@components/home/category/category-details.component';
import {Category} from '@components/home/home.types';
import {notFound, permanentRedirect, RedirectType} from 'next/navigation';
import {getAllCategories} from '@components/home/home-apis';
import {IconDescriptor} from 'next/dist/lib/metadata/types/metadata-types';
import Script from 'next/script';

type Params = Promise<{uniqueCategoryName: string[]}>;
type SearchParams = Promise<any>;

const CategoryPage = async (props: {params: Params}) => {
  const params = await props.params;

  let uniqueName = params.uniqueCategoryName.join('/');

  const finalUrl = decodeURIComponent(uniqueName)
    .replaceAll('---', '-')
    .replaceAll('--', '-')
    .replaceAll("'", '')
    .replaceAll('™', '')
    .replaceAll('®', '')
    .replaceAll('½', '')
    .replaceAll('"', '')
    .replaceAll('.', '-')
    .replaceAll('%', '')
    .replaceAll('”', '')
    .replaceAll('+', '')
    .replaceAll('’', '')
    .replaceAll('&', 'amp')
    .replaceAll(' ', '');

  if (uniqueName !== finalUrl) {
    permanentRedirect(`/categories/${finalUrl}`, RedirectType.replace);
  }
  const categoriesRes = await getAllCategories();
  const response = await getCategoryDetailsByUniqueName(uniqueName);
  const siblingCat = await getAllSiblingCategories(response?.payload?.id!!);

  let category: Category | null = null;
  if (response?.payload) category = response.payload;

  let allCategories: Category[] = [];
  if (siblingCat?.payload) allCategories = categoriesRes.payload;
  let siblingCategories: Category[] = [];
  if (siblingCat?.payload) siblingCategories = siblingCat.payload;

  return (
    <section>
      <Script
        id="breadcrumb-category-page-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: (category?.crumbs ?? [])
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
              .map(item => ({
                '@type': 'ListItem',
                position: item.sequenceNumber + 1,
                name: item.name,
                item: `${process.env.FE_URL}/${item.uniqueCategoryName}`
              }))
          })
        }}
      />
      <CategoryDetails allCategories={allCategories} category={category} siblingCategories={siblingCategories} />
    </section>
  );
};

export default CategoryPage;

export async function generateMetadata(props: {params: Params; searchParams: SearchParams}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const response = await getCategoryDetailsByUniqueName(params.uniqueCategoryName.join('/'));

  const pageNumberQuery = searchParams.page;
  const currentPage = +(pageNumberQuery ?? '1');

  const ld = await getProductsLdForCategoryPage(response?.payload?.id!!, currentPage + '');

  let totalPages: number = ld?.payload['totalPages'];

  if (currentPage > totalPages) notFound();

  let category: Category | null = null;
  if (response?.payload) category = response.payload;

  let canonicalURL: string = `${process.env.FE_URL}categories/${category?.uniqueCategoryName}`;
  if (currentPage > 1) {
    canonicalURL = `${canonicalURL}?page=${currentPage}`;
  }

  const descriptors: IconDescriptor[] = [];
  if (currentPage > 1) {
    descriptors.push({
      rel: 'prev',
      url: `${process.env.FE_URL}categories/${category?.uniqueCategoryName}${currentPage - 1 === 1 ? '' : `?page=${currentPage - 1}`}`
    });
  }

  if (currentPage < totalPages) {
    descriptors.push({
      rel: 'next',
      url: `${process.env.FE_URL}categories/${category?.uniqueCategoryName}?page=${currentPage + 1}`
    });
  }

  return {
    title: `${category?.metaTitle || category?.categoryName} | PrintsYou`,
    description: category?.metaDescription || '',
    icons: {
      other: descriptors
    },
    robots: {
      index: currentPage == 1,
      follow: currentPage == 1
    },
    alternates: {
      canonical: canonicalURL
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
