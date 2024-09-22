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
  saleEndDate: string | null;
  additionalFieldProductValues: AdditionalFieldProductValues[];
  additionalRows: AdditionalRows[];
  crumbs: Crumbs[];
  allCategoryNameAndIds: AllCategoryNameAndIds[];
}

export interface EnclosureProduct {
  id: string;
  sku: string;
  productName: string;
  minPrice: number;
  salePrice: number;
  priorityOrder: number;
  uniqueProductName: string;
  imageUrl: string;
  priceGrids: PriceGrids[];
}
