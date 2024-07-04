import {Product} from '../product/product';

interface specificationsProps {
  fieldName: string;
  fieldValue: string;
}

interface artWorkFilesProps {
  fileName: string;
  fileType: string;
  fileUrl: string;
}

interface CartItem {
  product: Product;
  itemsQuantity: number;
  calculatePriceForQuantity: number;
  totalPrice: number;
  specifications: specificationsProps[];
  artWorkFiles: artWorkFilesProps[];
}

export interface Spec {
  fieldValue: string;
  fieldName: any;
}

export interface File {
  fileKey: any;
  filename: any;
  fileType: string;
}

export interface CartItemUpdated {
  id: string;
  itemTotalPrice: number;
  qtyRequested: number;
  convertToOrder: boolean;
  priceQuotedPerItem: number;
  spec: Spec[];
  files: File[];
  sku: string;
  uniqueProductName: string;
  imageUrl: any;
  productName: string;
  productId: string;
  priceType?: string | null;
}

export interface CartRoot {
  id: string;
  totalCartPrice: number;
  cartItems: CartItemUpdated[];
  additionalCartPrice: number;
}

export interface CartInitialState {
  cartItems: CartItem[];
  sidebarCartOpen: boolean;
  isCartModalOpen: boolean;
  cart: CartRoot | null;
  cartState: {
    open: boolean;
    selectedProduct?: Product | null;
    selectedItem?: CartItemUpdated | null;
    cartMode: string;
  };
}
