import {configureStore} from '@reduxjs/toolkit';

import {categoryReducer} from './slices/category/catgory.slice';
import {productReducer} from './slices/product/product.slice';

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
