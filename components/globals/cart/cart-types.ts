import {PriceGrids} from '@components/home/product/product.types';
import {InferType, object, ref, string} from 'yup';

export interface CustomProduct {
  id: string;
  sku: string;
  productName: string;
  priceGrids: PriceGrids[];
  sortedPrices: PriceGrids[];
  groupedByPricing: Record<string, PriceGrids[]>;
  priceTypeExists: boolean;
}
export const cartModalSchema = object({
  imprintColor: string().notRequired(),
  itemColor: string().notRequired(),
  size: string().notRequired(),
  itemQty: string()
    .transform((_, value) => (value === '' ? 0 : +value))
    .required()
    .min(ref('minQty'), 'Specified Qty must be greater than Min Qty'),
  selectedPriceType: string().notRequired()
});

export type LocalCartState = InferType<typeof cartModalSchema>;

export interface UploadedFileType {
  url: string;
  objectKey: string;
}
