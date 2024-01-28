export interface ProductInitialState {
  underABuckProductsLoading: boolean;
  underABuckProducts: Product[];
  newAndExclusiveProductsLoading: boolean;
  newAndExclusiveProducts: Product[];
  uniqueIdeaProductsLoading: boolean;
  uniqueIdeaProducts: Product[];
  homeCategoryProducts: HomeCategoryProduts[];
  homeCategoryProductsLoading: boolean;
}

export interface ProductPrice {
  countFrom: number;
  price: number;
}

export interface ProductImage {
  imageUrl: string;
  sequenceNumber: number;
}

export interface AdditionalRow {
  sequenceNumber: number;
  name: string;
  priceDiff: number;
}

export interface AdditionalFieldProductValues {
  fieldName: string;
  fieldValue: string;
}

export interface PriceGrids {
  id: string;
  countFrom: number;
  price: number;
  salePrice: number;
  priceType: string;
}
export interface AdditionalRows {
  id: string;
  name: string;
  priceDiff: number;
  sequenceNumber: number;
}
export interface ProductImages {
  imageUrl: string;
  sequenceNumber: number;
}

export interface Product {
  id: string;
  productName: string;
  uniqueProductName: string;
  sku: string;
  price: ProductPrice[];
  productImages: ProductImage[];
  esp?: string | null;
  asi?: string | null;
  prefix?: string | null;
  suffix?: string | null;
  description: string | null;
  productDescription: string;
  metaTitle: string | null;
  metaDescription: string | null;
  additionalRow: AdditionalRow[];
  priceGrids: PriceGrids[];
  productImages?: ProductImages[];
  additionalFieldProductValues: AdditionalFieldProductValues[];
  additionalRows: AdditionalRows[];
}

interface HomeCategoryProduts {
  categoryName: string;
  subCategory: SubCategory[];
}

interface SubCategory {
  categoryName: string;
  uniqueCategoryName: string;
  products: Produc[];
}
