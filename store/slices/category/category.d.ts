export interface CategoryInitialState {
  categoryList: Category[];
  categoryListLoading: boolean;
}

export type Category = {
  categoryName: string;
  id: string;
  imageUrl: string;
  level: string;
  subCategories: Category[];
};
