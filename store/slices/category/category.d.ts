export interface CategoryInitialState {
  categoryList: Category[];
}

export type Category = {
  categoryName: string;
  id: string;
  imageUrl: string;
  level: string;
  subCategories: Category[];
};
