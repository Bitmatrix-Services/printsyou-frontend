import {Category} from '@components/home/home.types';
import {getAllCategories} from '@components/home/home-apis';
import {CategoriesComponent} from '@components/categories.component';

const AllCategoriesPage = async () => {
  const categoriesRes = await getAllCategories();
  let allCategories: Category[] = [];
  if (categoriesRes?.payload) allCategories = categoriesRes.payload;

  return <CategoriesComponent categoryList={allCategories} />;
};

export default AllCategoriesPage;
