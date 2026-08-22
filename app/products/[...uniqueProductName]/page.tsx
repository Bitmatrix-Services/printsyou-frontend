import {generateProductPageMetadata, ProductPageParams, ProductPageSearchParams, renderProductsPage} from '@components/home/product/product-page-renderer';

const ProductsPage = async ({params, searchParams}: {params: ProductPageParams; searchParams: ProductPageSearchParams}) =>
  renderProductsPage({params, searchParams});

export default ProductsPage;

export const generateMetadata = generateProductPageMetadata;
