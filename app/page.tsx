import HomeComponent from '@components/home/home-component';
import {getAllCategories, getBannersList, getFaqsList, getProductsByTag} from '@components/home/home-apis';

export default async function HomePage() {
  const categoriesData = await getAllCategories();
  const newAndExclusiveData = await getProductsByTag('newAndExclusive');
  const underABuck = await getProductsByTag('featured');
  const innovativeIdea = await getProductsByTag('mostPopular');
  const deals = await getProductsByTag('deals');
  const bannersList = await getBannersList();
  const faqsList = await getFaqsList();

  return (
    <HomeComponent
      bannersList={bannersList.payload}
      categories={categoriesData.payload}
      newAndExclusive={newAndExclusiveData.payload.content}
      underABuck={underABuck.payload.content}
      innovativeIdea={innovativeIdea.payload.content}
      deals={deals.payload.content}
      faqsList={faqsList.payload}
    />
  );
}
