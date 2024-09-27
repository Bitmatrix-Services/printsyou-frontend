import { Product } from '../product/product';

export interface WishlistItem {
  product: Product;
}

export interface WishlistRoot {
  id: string;
  wishlistItems: WishlistItem[];
}

export interface WishlistInitialState {
  wishlistId: string; 
  wishlistItems: WishlistItem[];
  wishlist: WishlistRoot | null;
  wishlistState: {
    open: boolean;
    selectedProduct?: Product | null;
    wishlistMode: string;
  };
}
