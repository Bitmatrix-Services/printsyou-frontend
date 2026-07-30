import {
    CategoryPageParams,
    CategoryPageSearchParams,
    generateCategoryPageMetadata,
    renderCategoryPage
} from '@components/home/category/category-page-renderer';

const CategoryPage = async (props: {params: CategoryPageParams; searchParams: CategoryPageSearchParams}) =>
    renderCategoryPage(props);

export default CategoryPage;

export const generateMetadata = generateCategoryPageMetadata;
