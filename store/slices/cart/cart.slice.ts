import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CartInitialState, CartItem, CartRoot} from './cart';
import {RootState} from '@store/store';

const INITIAL_STATE: CartInitialState = {
  cartItems: [],
  sidebarCartOpen: false,
  isCartModalOpen: false,
  cart: null
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: INITIAL_STATE,
  reducers: {
    setSidebarCartOpen: (state, action) => {
      state.sidebarCartOpen = action.payload;
    },
    setIsCartModalOpen: (state, action) => {
      state.isCartModalOpen = action.payload;
    },
    addtocart: (state, action: PayloadAction<CartItem>) => {
      const {
        product,
        itemsQuantity,
        totalPrice,
        calculatePriceForQuantity,
        specifications,
        artWorkFiles
      } = action.payload;
      const existingItem = state.cartItems.find(
        item => item.product.id === product.id
      );
      if (existingItem) {
        existingItem.itemsQuantity = itemsQuantity;
        existingItem.calculatePriceForQuantity = calculatePriceForQuantity;
        existingItem.totalPrice = totalPrice;
        existingItem.specifications = specifications;
        existingItem.artWorkFiles = artWorkFiles;
      } else {
        state.cartItems = [...state.cartItems, action.payload];
      }
      updateLocalStorage(state.cartItems);
    },
    removefromcart: (state, action) => {
      const productIdToRemove = action.payload.productId;
      state.cartItems = state.cartItems.filter(
        item => item.product.id !== productIdToRemove
      );
      updateLocalStorage(state.cartItems);
    },
    setCartState: (state, action: PayloadAction<CartRoot | null>) => {
      state.cart = action.payload;
    }
  }
});
export const {
  addtocart,
  removefromcart,
  setSidebarCartOpen,
  setIsCartModalOpen,
  setCartState
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const selectCartModalOpen = (state: RootState) =>
  state.cart.isCartModalOpen;

export const selectSidebarCartOpen = (state: RootState) =>
  state.cart.sidebarCartOpen;

export const getCartRootState = (state: RootState) => state.cart.cart;

const updateLocalStorage = (cartItemsFromLocalStorage: any) => {
  localStorage.setItem('cartItems', JSON.stringify(cartItemsFromLocalStorage));
};
