import {
  getAllSiblingCategories,
  getCategoryDetailsByUniqueName,
  getProductsLdForCategoryPage
} from '@components/home/category/category.apis';
import {CategoryDetails} from '@components/home/category/category-details.component';
import {Category} from '@components/home/home.types';
import {permanentRedirect, RedirectType} from 'next/navigation';
import {getAllCategories} from '@components/home/home-apis';

const CategoryPage = async ({params}: {params: {uniqueCategoryName: string[]}}) => {
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
  const ld = await getProductsLdForCategoryPage(response?.payload?.id!!);

  if (ld?.payload) {
    ld.payload['name'] = response?.payload.categoryName;
    ld.payload['url'] = `${process.env.FE_URL}categories/${response?.payload.uniqueCategoryName}`;
  }

  let category: Category | null = null;
  if (response?.payload) category = response.payload;

  let allCategories: Category[] = [];
  if (siblingCat?.payload) allCategories = categoriesRes.payload;
  let siblingCategories: Category[] = [];
  if (siblingCat?.payload) siblingCategories = siblingCat.payload;

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            url: `${process.env.FE_URL}${category?.uniqueCategoryName}`,
            mainEntity: {
              '@context': 'https://schema.org',
              '@type': 'OfferCatalog',
              name: category?.categoryName,
              url: `${process.env.FE_URL}${category?.uniqueCategoryName}`
            }
          })
        }}
      />
      <script
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
      {ld?.payload.itemListElement.length > 0 ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld?.payload ?? {})}} />
      ) : null}
      <CategoryDetails allCategories={allCategories} category={category} siblingCategories={siblingCategories} />
    </section>
  );
};

export default CategoryPage;

export async function generateMetadata({params}: {params: {uniqueCategoryName: string[]}}) {
  const response = await getCategoryDetailsByUniqueName(params.uniqueCategoryName.join('/'));

  let category: Category | null = null;

  if (response?.payload) category = response.payload;

  return {
    title: `${category?.metaTitle || category?.categoryName} | PrintsYou`,
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
