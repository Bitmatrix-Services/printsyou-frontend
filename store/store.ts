import {configureStore} from '@reduxjs/toolkit';
import {cartReducer} from './slices/cart/cart.slice';
import { wishlistReducer } from './slices/wishlist/wishlist.slice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
