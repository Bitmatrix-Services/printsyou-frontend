export interface CategoryInitialState {
  categoryList: Category[];
  categoryListLoading: boolean;
  promotionalCategories: Category[];
  promotionalCategoriesLoading: boolean;
}

export type Category = {
  categoryName: string;
  id: string;
  categoryDescription: string;
  imageUrl: string;
  level: string;
  uniqueCategoryName: string;
  subCategories: Category[];
};
