export interface ProductInitialState {
  promotionalProducts: Product[];
  promotionalProductsLoading: boolean;
  underABuckProducts: Product[];
  underABuckProductsLoading: boolean;
  uniqueIdeaProducts: Product[];
  uniqueIdeaProductsLoading: boolean;
  newAndExclusiveProducts: Product[];
  newAndExclusiveProductsLoading: boolean;
}

export type Product = {
  id: string;
  name: string;
};
