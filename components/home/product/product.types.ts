import {Crumbs} from '@components/home/home.types';

export interface ProductPrice {
  countFrom: number;
  price: number;
}

export interface ProductImage {
  imageUrl: string;
  sequenceNumber: number;
  altText?: string | null;
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

export interface AllCategoryNameAndIds {
  id: string;
  name: string;
}

export type OrderType = 'CHECKOUT' | 'QUOTE_ONLY' | 'BOTH';

export interface Product {
  id: string;
  productName: string;
  uniqueProductName: string;
  sku: string;
  outOfStock: boolean;
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
  saleEndDate: string | null;
  additionalFieldProductValues: AdditionalFieldProductValues[];
  additionalRows: AdditionalRows[];
  crumbs: Crumbs[];
  allCategoryNameAndIds: AllCategoryNameAndIds[];
  productColors: productColors[];
  reviewCount?: number;
  averageRating?: number;
  orderType?: OrderType;
}

export interface EnclosureProduct {
  id: string;
  sku: string;
  productName: string;
  minPrice: number;
  salePrice: number;
  priorityOrder: number;
  uniqueProductName: string;
  metaDescription: string;
  imageUrl: string;
  priceGrids: PriceGrids[];
  outOfStock: boolean;
}

export interface productColors {
  id: string;
  colorName: string;
  colorHex: string;
  onlyColorImage?: string;
  coloredProductImage?: string;
}

export interface Locations {
  id: string;
  externalId: string;
  locationName: string;
  decorationsIncluded: number;
  defaultLocation: boolean;
  maxDecoration: number;
  minDecoration: number;
  locationRank: number;
  decorations: Decoration[];
}

export interface Decoration {
  id: string;
  externalId: string;
  name: string;
  geometry: string;
  height: string;
  width: string;
  diameter: string;
  uom: string;
  units: number;
  unitsMax: number;
  charges: Charge[];
}

export interface ChargePrice {
  id: string;
  price: number;
  discountCode: string;
  repeatPrice: number;
  repeatDiscountCode: string;
  effectiveDate: string;
  expiryDate: string;
  xMinQty: number;
  xUom: string;
  yMinQty: number;
  yUom: string;
}

export interface Charge {
  id: string;
  externalId: string;
  name: string;
  description: string;
  type: string;
  chargePrices: ChargePrice[];
}
