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

export type Crumbs = {
  id: string;
  name: string;
  sequenceNumber: number;
  uniqueCategoryName: string;
};

export type BannerList = {
  id: string;
  bannerUrl: string;
  sequenceNumber: string;
  heading: string;
  tagLines: string;
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
