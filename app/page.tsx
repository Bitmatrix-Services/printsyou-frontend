import HomeComponent from '@components/home/home-component';
import {getAllCategories, getBannersList, getFaqsList, getNewAndExclusiveProducts} from '@components/home/home-apis';

export default async function HomePage() {
  const categoriesData = await getAllCategories();
  const newAndExclusiveData = await getNewAndExclusiveProducts();
  const bannersList = await getBannersList();
  const faqsList = await getFaqsList();

  return (
    <HomeComponent
      bannersList={bannersList.payload}
      categories={categoriesData.payload}
      underABuckProducts={newAndExclusiveData.payload.content}
      newAndExclusive={newAndExclusiveData.payload.content}
      allUniqueIdeas={newAndExclusiveData.payload.content}
      faqsList={faqsList.payload}
    />
  );
}
