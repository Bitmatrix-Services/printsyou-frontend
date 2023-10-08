export interface UniqueIdeasInitialState {
  promotionalProducts: Product[];
  promotionalProductsLoading: boolean;
  underABuckProducts: Product[];
  underABuckProductsLoading: boolean;
  uniqueIdeaProducts: Product[];
  uniqueIdeaProductsLoading: boolean;
  newAndExclusiveProducts: Product[];
  newAndExclusiveProductsLoading: boolean;
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
}
export interface AdditionalRows {
  id: string;
  name: string;
  priceDiff: number;
  sequenceNumber: number;
}

export interface Product {
  id: string;
  productName: string;
  sku: string;
  price: ProductPrice[];
  images: ProductImage[];
  esp?: string | null;
  asi?: string | null;
  prefix?: string | null;
  suffix?: string | null;
  description: string | null;
  productDescription: string;
  additionalRow: AdditionalRow[];
  priceGrids: PriceGrids[];
  productImages?: string[];
  additionalFieldProductValues: AdditionalFieldProductValues[];
  additionalRows: AdditionalRows[];
}
