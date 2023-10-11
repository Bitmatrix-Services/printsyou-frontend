export interface CategoryInitialState {
  categoryList: Category[];
  categoryListLoading: boolean;
  promotionalCategories: Product[];
  promotionalCategoriesLoading: boolean;
}

export type Category = {
  categoryName: string;
  id: string;
  categoryDescription: string;
  imageUrl: string;
  level: string;
  ucategoryName: string;
  subCategories: Category[];
};
