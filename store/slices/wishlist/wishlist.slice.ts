import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WishlistInitialState, WishlistItem, WishlistRoot } from './wishlist';
import { RootState } from '../../store';
import { v4 as uuidv4 } from 'uuid';  

const loadWishlistIdFromLocalStorage = (): string => {
  if (typeof window !== 'undefined') {
    const storedWishlistId = localStorage.getItem('wishlistId');
    if (storedWishlistId) {
      return storedWishlistId;
    } else {
      const newWishlistId = uuidv4();  
      localStorage.setItem('wishlistId', newWishlistId);
      return newWishlistId;
    }
  }
  return uuidv4();  
};

const loadWishlistFromLocalStorage = (): WishlistItem[] => {
  if (typeof window !== 'undefined') {
    const storedWishlist = localStorage.getItem('wishlistItems');
    if (storedWishlist) {
      return JSON.parse(storedWishlist);
    }
  }
  return [];
};

const INITIAL_STATE: WishlistInitialState = {
  wishlistId: loadWishlistIdFromLocalStorage(),  
  wishlistItems: loadWishlistFromLocalStorage(),
  wishlist: null,
  wishlistState: {
    open: false,
    selectedProduct: null,
    wishlistMode: ''
  }
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: INITIAL_STATE,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const { product } = action.payload;
      const existingItem = state.wishlistItems.find(item => item.product.id === product.id);
      if (!existingItem) {
        state.wishlistItems = [...state.wishlistItems, action.payload];
      }
      updateWishlistLocalStorage(state.wishlistItems);
    },
    removeFromWishlist: (state, action) => {
      const productIdToRemove = action.payload.productId;
      state.wishlistItems = state.wishlistItems.filter(item => item.product.id !== productIdToRemove);
      updateWishlistLocalStorage(state.wishlistItems);
    },
    setWishlistState: (state, action: PayloadAction<WishlistRoot | null>) => {
      state.wishlist = action.payload;
    },
    setWishlistStateForModal: (state, action: PayloadAction<WishlistInitialState['wishlistState']>) => {
      state.wishlistState = action.payload;
    },
    setWishlistId: (state, action: PayloadAction<string>) => {
      state.wishlistId = action.payload;
      localStorage.setItem('wishlistId', action.payload);
    },
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.wishlistItems = action.payload;
      updateWishlistLocalStorage(state.wishlistItems);
    }
  }
});

export const { addToWishlist, removeFromWishlist, setWishlistStateForModal, setWishlistState, setWishlistId, setWishlistItems } = wishlistSlice.actions;

export const wishlistReducer = wishlistSlice.reducer;

export const selectWishlistState = (state: RootState) => state.wishlist.wishlistState;
export const selectWishlistItems = (state: RootState) => state.wishlist.wishlistItems;
export const selectWishlistId = (state: RootState) => state.wishlist.wishlistId; 

const updateWishlistLocalStorage = (wishlistItems: any) => {
  localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
};
