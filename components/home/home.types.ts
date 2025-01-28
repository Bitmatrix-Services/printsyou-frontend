export type Category = {
  categoryName: string;
  id: string;
  categoryDescription: string;
  imageUrl: string;
  level: string;
  prefix: string;
  suffix: string;
  uniqueCategoryName: string;
  subCategories: Category[];
  metaTitle: string | null;
  metaDescription: string | null;
  crumbs: Crumbs[];
};

export type Crumbs = {
  id: string;
  name: string;
  sequenceNumber: number;
  uniqueCategoryName: string;
};

export type BannerList = {
  id: string;
  bannerUrl: string;
  sequenceNumber: number;
  heading: string;
  tagLines: string;
  type: string;
  bannerCategory: {
    categoryId: string;
    ucategoryName: string;
  };
};

export interface CategoryProduct {
  productName: string;
  uniqueProductName: string;
  lowestPrice: number;
  salePrice: number;
  imageUrl: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sequenceNumber: number;
}
