import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

import {ProductInitialState, Product} from './product';
import {http} from 'services/axios.service';
import {RootState} from '@store/store';

const INITIAL_STATE: ProductInitialState = {
  underABuckProducts: [],
  underABuckProductsLoading: false,
  newAndExclusiveProducts: [],
  newAndExclusiveProductsLoading: false
};

export const getUnderABuckProducts = createAsyncThunk(
  'product/getUnderABuckProducts',
  async () => {
    const res = await http.get(`/product/underBuck`);
    return res?.data.payload;
  }
);
export const getNewAndExclusiveProducts = createAsyncThunk(
  'product/newAndExclusive',
  async () => {
    const res = await http.get(`/product/newAndExclusive`);
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
    },
    [getNewAndExclusiveProducts.pending.type]: state => {
      state.newAndExclusiveProductsLoading = true;
    },
    [getNewAndExclusiveProducts.fulfilled.type]: (
      state,
      action: PayloadAction<Product[]>
    ) => {
      state.newAndExclusiveProducts = action.payload;
      state.newAndExclusiveProductsLoading = false;
    },
    [getNewAndExclusiveProducts.rejected.type]: state => {
      state.newAndExclusiveProductsLoading = false;
    }
  }
});

export const selectUnderABuckProducts = (state: RootState) =>
  state.product.underABuckProducts;
export const selectUnderABuckProductsLoading = (state: RootState) =>
  state.product.underABuckProductsLoading;

export const selectNewAndExclusiveProducts = (state: RootState) =>
  state.product.newAndExclusiveProducts;
export const selectNewAndExclusiveProductssLoading = (state: RootState) =>
  state.product.newAndExclusiveProductsLoading;

export const productReducer = productSlice.reducer;
