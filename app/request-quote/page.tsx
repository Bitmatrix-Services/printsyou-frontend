import {RequestQuoteComponent} from '@components/request-quote.component';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';
import {Suspense} from 'react';
import {getCategoryDetailsByUniqueName} from '@components/home/category/category.apis';
import {getProductDetailsById} from '@components/home/product/product-apis';

interface PageProps {
  searchParams: Promise<{category?: string; product?: string}>;
}

export interface PriceGrid {
  countFrom: number;
  price: number;
  salePrice?: number;
}

export interface ProductColor {
  id: string;
  colorName: string;
  colorHex: string;
  onlyColorImage?: string;
  coloredProductImage?: string;
}

export interface QuoteItemData {
  type: 'category' | 'product';
  name: string;
  imageUrl: string;
  productId?: string;
  uniqueProductName?: string;
  priceGrids?: PriceGrid[];
  setupCharge?: number;
  productColors?: ProductColor[];
}

const RequestQuotePage = async ({searchParams}: PageProps) => {
  const params = await searchParams;
  const categoryParam = params.category;
  const productParam = params.product;

  let itemData: QuoteItemData | null = null;

  // Fetch product details if product param is provided (product ID)
  if (productParam) {
    try {
      const productRes = await getProductDetailsById(productParam);
      if (productRes?.payload) {
        // Get the first image from productImages array
        const firstImage = productRes.payload.productImages?.[0]?.imageUrl || '';

        // Extract price grids for value calculation
        const priceGrids = productRes.payload.priceGrids?.map((pg: any) => ({
          countFrom: pg.countFrom,
          price: pg.salePrice && pg.salePrice > 0 ? pg.salePrice : pg.price,
          salePrice: pg.salePrice
        })) || [];

        // Find setup charge from additionalRows if exists
        const setupRow = productRes.payload.additionalRows?.find(
          (row: any) => row.name?.toLowerCase().includes('setup')
        );
        const setupCharge = setupRow?.priceDiff || 30; // Default $30 if not found

        itemData = {
          type: 'product',
          name: productRes.payload.productName,
          imageUrl: firstImage,
          productId: productRes.payload.id,
          uniqueProductName: productRes.payload.uniqueProductName,
          priceGrids,
          setupCharge,
          productColors: productRes.payload.productColors || []
        };
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }
  // Fetch category details if category param is provided (expects uniqueCategoryName)
  else if (categoryParam) {
    try {
      const categoryRes = await getCategoryDetailsByUniqueName(categoryParam);
      if (categoryRes?.payload) {
        itemData = {
          type: 'category',
          name: categoryRes.payload.categoryName,
          imageUrl: categoryRes.payload.imageUrl || ''
        };
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RequestQuoteComponent itemData={itemData} />
    </Suspense>
  );
};

export default RequestQuotePage;

export const metadata: Metadata = {
  title: `Request a Quote | ${metaConstants.SITE_NAME}`,
  description: `Get a free, personalized quote for custom promotional products. Fast response, competitive pricing, and expert guidance for your branding needs.`,
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: `${process.env.FE_URL}request-quote`
  },
  openGraph: {
    title: `Request a Quote | ${metaConstants.SITE_NAME}`,
    description: `Get a free, personalized quote for custom promotional products.`,
    type: 'website',
    url: `${process.env.FE_URL}request-quote`
  }
};
