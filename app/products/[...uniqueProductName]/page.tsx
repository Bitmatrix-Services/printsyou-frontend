import {generateProductPageMetadata, ProductPageParams, renderProductsPage} from '@components/home/product/product-page-renderer';

const ProductsPage = async ({params}: {params: ProductPageParams}) => renderProductsPage({params});

export default ProductsPage;

export const generateMetadata = generateProductPageMetadata;
