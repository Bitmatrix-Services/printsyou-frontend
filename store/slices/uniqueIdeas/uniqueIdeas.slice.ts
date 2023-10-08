import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

import {UniqueIdeasInitialState, Product} from './uniqueIdeas';
import {http} from 'services/axios.service';
import {RootState} from '@store/store';

const INITIAL_STATE: UniqueIdeasInitialState = {
  promotionalProducts: [],
  promotionalProductsLoading: false,
  underABuckProducts: [],
  underABuckProductsLoading: false,
  uniqueIdeaProducts: [],
  uniqueIdeaProductsLoading: false,
  newAndExclusiveProducts: [],
  newAndExclusiveProductsLoading: false
};

export const getPromotionalProducts = createAsyncThunk(
  'product/getPromotionalProducts',
  async () => {
    const res = await http.get(`category/all`);
    return res?.data.payload;
  }
);

export const getUnderABuckProducts = createAsyncThunk(
  'product/getUnderABuckProducts',
  async () => {
    const res = await http.get(`product/underBuck`);
    return res?.data.payload;
  }
);

export const getUniqueIdeaProducts = createAsyncThunk(
  'product/getUniqueIdeaProducts',
  async () => {
    const res = await http.get(`category/all`);
    return res?.data.payload;
  }
);

export const getNewAndExclusiveProducts = createAsyncThunk(
  'product/getNewAndExclusiveProducts',
  async () => {
    const res = await http.get(`category/all`);
    return res?.data.payload;
  }
);

export const productSlice = createSlice({
  name: 'product',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: {
    [getPromotionalProducts.pending.type]: state => {
      state.promotionalProductsLoading = true;
    },
    [getPromotionalProducts.fulfilled.type]: (
      state,
      action: PayloadAction<Product[]>
    ) => {
      state.promotionalProducts = action.payload;
      state.promotionalProductsLoading = false;
    },
    [getPromotionalProducts.rejected.type]: state => {
      state.promotionalProductsLoading = false;
    },

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

    [getUniqueIdeaProducts.pending.type]: state => {
      state.uniqueIdeaProductsLoading = true;
    },
    [getUniqueIdeaProducts.fulfilled.type]: (
      state,
      action: PayloadAction<Product[]>
    ) => {
      state.uniqueIdeaProducts = action.payload;
      state.uniqueIdeaProductsLoading = false;
    },
    [getUniqueIdeaProducts.rejected.type]: state => {
      state.uniqueIdeaProductsLoading = false;
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

export const selectPromotionalProducts = (state: RootState) =>
  state.product.promotionalProducts;
export const selectPromotionalProductsLoading = (state: RootState) =>
  state.product.promotionalProductsLoading;

export const selectUnderABuckProducts = (state: RootState) =>
  state.product.underABuckProducts;
export const selectUnderABuckProductsLoading = (state: RootState) =>
  state.product.underABuckProductsLoading;

export const selectUniqueIdeaProducts = (state: RootState) =>
  state.product.uniqueIdeaProducts;
export const selectUniqueIdeaProductsLoading = (state: RootState) =>
  state.product.uniqueIdeaProductsLoading;

export const selectNewAndExclusiveProducts = (state: RootState) =>
  state.product.newAndExclusiveProducts;
export const selectNewAndExclusiveProductsLoading = (state: RootState) =>
  state.product.newAndExclusiveProductsLoading;

export const productReducer = productSlice.reducer;
