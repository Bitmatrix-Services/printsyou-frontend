export interface CategoryInitialState {
  categoryList: Category[];
  categoryListLoading: boolean;
  promotionalCategories: Category[];
  promotionalCategoriesLoading: boolean;
  bannerList: BannerList[];
  bannerListLoading: boolean;
}

export type Category = {
  categoryName: string;
  id: string;
  categoryDescription: string;
  imageUrl: string;
  level: string;
  uniqueCategoryName: string;
  subCategories: Category[];
  metaTitle: string | null;
  metaDescription: string | null;
  crumbs: Crumbs[];
};

export type BannerList = {
  id: string;
  bannerUrl: string;
  sequenceNumber: string;
  bannerCategory: {
    categoryId: string;
    ucategoryName: string;
  };
};

export type Crumbs = {
  id: string;
  name: string;
  sequenceNumber: number;
  uniqueCategoryName: string;
};
