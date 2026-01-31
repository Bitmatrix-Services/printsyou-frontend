// Add these to your existing home.types.ts

export interface Category {
    id: string;
    categoryName: string;
    uniqueCategoryName: string;
    keywords?: string;
    active?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    categoryDescription: string;
    level: string;
    imageUrl?: string;
    prefix?: string;
    suffix?: string;
    subCategories: Category[];
    crumbs?: Crumbs[];

    // NEW UX/SEO FIELDS
    heroSubtitle?: string;
    trustBadgesJson?: string;
    keyFeaturesJson?: string;
    contentSectionsJson?: string;
    faqsJson?: string;
    ctaSectionJson?: string;
    sidebarBoxesJson?: string;
    showHeroSection?: boolean;
    showKeyFeatures?: boolean;
    showFaqSection?: boolean;
    showCtaSection?: boolean;
    showSidebar?: boolean;
    layoutType?: string;
    customCssClasses?: string;
    featuredSnippet?: string;
    richSnippetJson?: string;

    // SEO INDEXING FIELDS
    seoIndexable?: boolean;
    seoReasonCode?: SeoReasonCode;
    absorptionParentId?: string;
    absorptionParentSlug?: string;
    isAttributeCategory?: boolean;
    isBrandCategory?: boolean;
    canonicalToParent?: boolean;
    productCountCache?: number;
    uniqueContentLength?: number;
}

// SEO Reason Codes (matching backend enum)
export type SeoReasonCode =
    | 'SIZE'
    | 'MATERIAL'
    | 'STYLE'
    | 'PACKAGING'
    | 'THIN'
    | 'BRAND'
    | 'DUPLICATE'
    | 'OK_INDEX'
    | 'FORCE_INDEX'
    | 'FORCE_NOINDEX';

// NEW: Parsed UX/SEO types
export interface TrustBadge {
    icon: string;
    title: string;
    subtitle: string;
}

export interface KeyFeature {
    title: string;
    description: string;
    icon: string;
}

export interface FAQ {
    question: string;
    answer: string;
    order: number;
}

export interface CTASection {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
}

export interface SidebarBox {
    title: string;
    type: 'links' | 'cta' | 'info' | 'html';
    content?: string;
    links?: Array<{text: string; link: string}>;
    buttonText?: string;
    buttonLink?: string;
    order: number;
}

// Helper function to parse JSON fields
export const parseCategoryUxSeo = (category: Category) => {
    return {
        trustBadges: category.trustBadgesJson ? JSON.parse(category.trustBadgesJson) : [] as TrustBadge[],
        keyFeatures: category.keyFeaturesJson ? JSON.parse(category.keyFeaturesJson) : [] as KeyFeature[],
        faqs: category.faqsJson ? JSON.parse(category.faqsJson) : [] as FAQ[],
        ctaSection: category.ctaSectionJson ? JSON.parse(category.ctaSectionJson) as CTASection : null,
        sidebarBoxes: category.sidebarBoxesJson ? JSON.parse(category.sidebarBoxesJson) : [] as SidebarBox[]
    };
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
  layout: string;
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
