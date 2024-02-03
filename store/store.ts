import {configureStore} from '@reduxjs/toolkit';

import {categoryReducer} from './slices/category/catgory.slice';
import {productReducer} from './slices/product/product.slice';
import {ProgressReducer} from '@store/slices/progress.slice';
import {cartReducer} from './slices/cart/cart.slice';

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer,
    progress: ProgressReducer,
    cart: cartReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
