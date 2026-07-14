import {Crumbs} from '@components/home/home.types';

export interface ProductPrice {
  countFrom: number;
  price: number;
}

export interface ProductImage {
  imageUrl: string;
  sequenceNumber: number;
  altText?: string | null;
  mediaType?: 'IMAGE' | 'VIDEO';
  videoThumbnail?: string | null;
}

export interface AdditionalRow {
  sequenceNumber: number;
  name: string;
  priceDiff: number;
}

export interface AdditionalFieldProductValues {
  fieldName: string;
  fieldValue: string;
}

export interface PriceGrids {
  id: string;
  countFrom: number;
  price: number;
  salePrice: number;
  priceType: string;
}

export interface AdditionalRows {
  id: string;
  name: string;
  priceDiff: number;
  sequenceNumber: number;
}

export interface AllCategoryNameAndIds {
  id: string;
  name: string;
}

export type OrderType = 'CHECKOUT' | 'QUOTE_ONLY' | 'BOTH';

// Position configuration for customization zones (from admin zone editor)
export interface PositionConfig {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  chargeDescription?: string;
  chargeAmount?: number;
  enabled?: boolean;
  fontFamily?: string;
  fontColor?: string;
}

export type ImageViewType = 'FRONT' | 'BACK' | 'SIDE';

// Source platform for embedded product reviews
export type ReviewSourcePlatform =
  | 'GOOGLE'
  | 'ETSY'
  | 'TIKTOK'
  | 'AMAZON'
  | 'FACEBOOK'
  | 'YELP'
  | 'TRUSTPILOT'
  | 'WEBSITE_VERIFIED';

// Embedded review stored directly on product
export interface EmbeddedReview {
  id: string;
  reviewerName: string;
  roleOrCompany?: string;
  rating: number;
  reviewText: string;
  sourcePlatform: ReviewSourcePlatform;
  reviewDate?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface Product {
  id: string;
  productName: string;
  uniqueProductName: string;
  sku: string;
  outOfStock: boolean;
  price: ProductPrice[];
  productImages: ProductImage[];
  esp?: string | null;
  asi?: string | null;
  prefix?: string | null;
  suffix?: string | null;
  description: string | null;
  productDescription: string;
  metaTitle: string | null;
  metaDescription: string | null;
  additionalRow: AdditionalRow[];
  priceGrids: PriceGrids[];
  saleEndDate: string | null;
  additionalFieldProductValues: AdditionalFieldProductValues[];
  additionalRows: AdditionalRows[];
  crumbs: Crumbs[];
  allCategoryNameAndIds: AllCategoryNameAndIds[];
  productColors: productColors[];
  reviewCount?: number;
  averageRating?: number;
  orderType?: OrderType;
  shoppingFlowEnabled?: boolean;
  leadTimeDays?: number; // Production lead time in days (for urgency widget)
  // Google Reviews configuration (global reviews by category)
  googleReviewsEnabled?: boolean;
  googleReviewCategory?: string;
  // Product-specific reviews (embedded per-product)
  productReviewsEnabled?: boolean;
  embeddedReviews?: EmbeddedReview[];
  // Default customization zones (fallback when image doesn't have zones)
  defaultLogoPosition?: PositionConfig;
  defaultNumberPosition?: PositionConfig;
  defaultNamePosition?: PositionConfig;
}

export interface EnclosureProduct {
  id: string;
  sku: string;
  productName: string;
  minPrice: number;
  salePrice: number;
  priorityOrder: number;
  uniqueProductName: string;
  metaDescription: string;
  imageUrl: string;
  priceGrids: PriceGrids[];
  outOfStock: boolean;
}

export interface productColors {
  id: string;
  colorName: string;
  colorHex: string;
  onlyColorImage?: string;
  coloredProductImage?: string;
  sequenceNumber?: number; // For ordering colors in UI
}

// Extended product image with customization zones
export interface ProductImageWithZones extends ProductImage {
  viewType?: ImageViewType;
  logoPosition?: PositionConfig;
  numberPosition?: PositionConfig;
  namePosition?: PositionConfig;
}

// Customization data for a single view
export interface ViewCustomization {
  playerName?: string;
  playerNumber?: string;
  customText?: string;
  logoDataUrl?: string;
}

// Full customization data for cart/checkout
export interface CustomizationData {
  playerName?: string;
  playerNumber?: string;
  customText?: string;
  logoDataUrl?: string;
  backLogoDataUrl?: string; // Separate logo for back view
  useDifferentLogos?: boolean; // Flag to indicate different logos for front/back
  viewCustomizations?: {
    FRONT?: ViewCustomization;
    BACK?: ViewCustomization;
    SIDE?: ViewCustomization;
  };
  fontStyle?: 'product-default' | 'varsity' | 'modern';
  userFontColor?: string;
  logoPosition?: { x: number; y: number; maxSize?: number };
  selectedColor?: { name: string; hex: string };
  previewDataUrl?: string;
  frontPreviewDataUrl?: string;
  backPreviewDataUrl?: string;
  sidePreviewDataUrl?: string;
  currentView?: ImageViewType;
  availableViews?: ImageViewType[];
  viewProductImages?: Record<ImageViewType, string | undefined>;
  viewZoneConfigs?: Record<ImageViewType, { name: PositionConfig | null; number: PositionConfig | null; logo: PositionConfig | null } | null>;
  additionalCharges?: number;
}

export interface Locations {
  id: string;
  externalId: string;
  locationName: string;
  decorationsIncluded: number;
  defaultLocation: boolean;
  maxDecoration: number;
  minDecoration: number;
  locationRank: number;
  decorations: Decoration[];
}

export interface Decoration {
  id: string;
  externalId: string;
  name: string;
  geometry: string;
  height: string;
  width: string;
  diameter: string;
  uom: string;
  units: number;
  unitsMax: number;
  charges: Charge[];
}

export interface ChargePrice {
  id: string;
  price: number;
  discountCode: string;
  repeatPrice: number;
  repeatDiscountCode: string;
  effectiveDate: string;
  expiryDate: string;
  xMinQty: number;
  xUom: string;
  yMinQty: number;
  yUom: string;
}

export interface Charge {
  id: string;
  externalId: string;
  name: string;
  description: string;
  type: string;
  chargePrices: ChargePrice[];
}
