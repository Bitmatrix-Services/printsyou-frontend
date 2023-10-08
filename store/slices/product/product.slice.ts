import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

import {ProductInitialState, Product} from './product';
import {http} from 'services/axios.service';
import {RootState} from '@store/store';

const INITIAL_STATE: ProductInitialState = {
  underABuckProducts: [],
  underABuckProductsLoading: false
};

export const getUnderABuckProducts = createAsyncThunk(
  'product/getUnderABuckProducts',
  async () => {
    const res = await http.get(`product/underBuck`);
    return res?.data.payload;
  }
);

export const productSlice = createSlice({
  name: 'product',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: {
    [getUnderABuckProducts.pending.type]: state => {
      state.underABuckProductsLoading = true;
    },
    [getUnderABuckProducts.fulfilled.type]: (
      state,
      action: PayloadAction<Product[]>
    ) => {
      state.underABuckProducts = action.payload;
      state.underABuckProductsLoading = false;
    },
    [getUnderABuckProducts.rejected.type]: state => {
      state.underABuckProductsLoading = false;
    }
  }
});

export const selectUnderABuckProducts = (state: RootState) =>
  state.product.underABuckProducts;
export const selectUnderABuckProductsLoading = (state: RootState) =>
  state.product.underABuckProductsLoading;

export const productReducer = productSlice.reducer;
