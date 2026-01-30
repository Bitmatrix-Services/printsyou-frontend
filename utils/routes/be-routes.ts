export const HomePageRoutes = Object.freeze({
  Banners: `/banner/all`,
  AllCategories: '/category/all',
  NewAndExclusive: '/product/byTag?tag=newAndExclusive',
  UniqueIdeas: '/product/byTag?tag=mostPopular',
  UnderABuck: '/product/byTag?tag=under1Dollar',
  innovativeIdea: '/product/byTag?tag=featured',
  Deals: '/product/byTag?tag=featured',
  Faqs: `/faqs/all`
});

export const ProductRoutes = Object.freeze({
  ProductById: `/product`,
  ProductByUniqueName: `/product?uProductName`,
  FetchRelatedProducts: `/product/fetchRelatedProducts`,
  ProductByCategoryId: `/product/byCategory`,
  Ld: '/product/ld-products/{0}?page={1}'
});

export const CategoryRoutes = Object.freeze({
  CategoryById: ``,
  CategoryByUniqueName: `/category?uCategoryName`,
  CategoriesByParentId: `/category/subCategories`,
  CategoryFilters: `/category/{0}/filters`
});

export const NewsletterRoutes = Object.freeze({
  subscribe: `/news-letter`
});

export const ContactUsRoutes = Object.freeze({
  contactUs: `/contact_us`
});

export const MoreInfoRoutes = Object.freeze({
  moreInfo: `/more-info`
});

export const NotificationRoutes = Object.freeze({
  allNotifications: `/notification/all`
});

export const BlogRoutes = Object.freeze({
  allBlogs: `/blog/all`,
  blogById: `/blog`,
  blogByUniqueName: `/blog/unique`
});

export const QuoteRequestRoutes = Object.freeze({
  createQuote: `/quote-request`
});
