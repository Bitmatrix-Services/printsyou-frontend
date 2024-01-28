import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

import {ProductInitialState, Product, HomeCategoryProduts} from './product';
import {http} from 'services/axios.service';
import {RootState} from '@store/store';

const INITIAL_STATE: ProductInitialState = {
  underABuckProducts: [],
  underABuckProductsLoading: false,
  newAndExclusiveProducts: [],
  newAndExclusiveProductsLoading: false,
  uniqueIdeaProducts: [],
  uniqueIdeaProductsLoading: false,
  homeCategoryProducts: [],
  homeCategoryProductsLoading: false,
};

export const getAllUnderABuckProducts = async (): Promise<Product[]> => {
  const res = await http.get(`/product/byTag?tag=featured`);
  return res?.data.payload.content;
};

export const getUnderABuckProducts = createAsyncThunk(
  'product/getUnderABuckProducts',
  getAllUnderABuckProducts
);

export const getAllNewAndExclusiveProducts = async (): Promise<Product[]> => {
  const res = await http.get(`/product/byTag?tag=newAndExclusive`);
  return res?.data.payload.content;
};

export const getNewAndExclusiveProducts = createAsyncThunk(
  'product/newAndExclusive',
  getAllNewAndExclusiveProducts
);

export const getAllUniqueIdeasProducts = async (): Promise<Product[]> => {
  const res = await http.get(`/product/byTag?tag=mostPopular`);
  return res?.data.payload.content;
};

export const getUniqueIdeaProducts = createAsyncThunk(
  'product/getUniqueIdeaProducts',
  getAllUniqueIdeasProducts
);

export const getAllHomeCategoryProducts = async (): Promise<HomeCategoryProduts[]> => {
  const res = await http.get(`/product/homeProductsWithCategories`);
  return res?.data.payload;
};

export const getHomeCategoryProducts = createAsyncThunk(
  'product/getHomeCaegoryProducts',
  getAllHomeCategoryProducts
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
    [getHomeCategoryProducts.fulfilled.type]: (
      state,
      action: PayloadAction<HomeCategoryProduts[]>
    ) => {
      state.homeCategoryProducts = action.payload;
      state.homeCategoryProductsLoading = false;
    },
    [getHomeCategoryProducts.rejected.type]: state => {
      state.homeCategoryProductsLoading = false;
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

export const selectUniqueIdeaProducts = (state: RootState) =>
  state.product.uniqueIdeaProducts;
export const selectUniqueIdeaProductsLoading = (state: RootState) =>
  state.product.uniqueIdeaProductsLoading;

export const productReducer = productSlice.reducer;
