import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

import {CategoryInitialState, Category, BannerList} from './category';
import {http} from 'services/axios.service';
import {RootState} from '@store/store';

const INITIAL_STATE: CategoryInitialState = {
  categoryList: [],
  categoryListLoading: false,
  promotionalCategories: [],
  promotionalCategoriesLoading: false,
  bannerList: [],
  bannerListLoading: false
};

export const getAllCategoryList = createAsyncThunk(
  'category/getAllCategoryList',
  async () => {
    const res = await http.get(`/category/all`);
    return res?.data.payload;
  }
);

export let getAllPromotionalCategories = async () => {
  const res = await http.get(`/category/popular`);
  return res?.data.payload;
};

export const getAllBannerList = async (): Promise<BannerList[]> => {
  const res = await http.get(`/banner/all`);
  return res?.data.payload;
};

export const getPromotionalCategories = createAsyncThunk(
  'product/getPromotionalCategories',
  getAllPromotionalCategories
);

export const getBannerList = createAsyncThunk(
  'category/getBannerList',
  getAllBannerList
);

export const categorySlice = createSlice({
  name: 'category',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: {
    [getAllCategoryList.pending.type]: (
      state,
      action: PayloadAction<Category[]>
    ) => {
      state.categoryListLoading = true;
    },
    [getAllCategoryList.fulfilled.type]: (
      state,
      action: PayloadAction<Category[]>
    ) => {
      state.categoryList = action.payload;
      state.categoryListLoading = false;
    },
    [getPromotionalCategories.pending.type]: state => {
      state.promotionalCategoriesLoading = true;
    },
    [getPromotionalCategories.fulfilled.type]: (
      state,
      action: PayloadAction<Category[]>
    ) => {
      state.promotionalCategories = action.payload;
      state.promotionalCategoriesLoading = false;
    },
    [getPromotionalCategories.rejected.type]: state => {
      state.promotionalCategoriesLoading = false;
    },

    [getBannerList.pending.type]: state => {
      state.bannerListLoading = true;
    },
    [getBannerList.fulfilled.type]: (
      state,
      action: PayloadAction<BannerList[]>
    ) => {
      state.bannerList = action.payload;
      state.bannerListLoading = false;
    },
    [getBannerList.rejected.type]: state => {
      state.bannerListLoading = false;
    }
  }
});

export const selectCategoryList = (state: RootState) =>
  state.category.categoryList;
export const selectCategoryListLoading = (state: RootState) =>
  state.category.categoryListLoading;

export const selectPromotionalCategories = (state: RootState) =>
  state.category.promotionalCategories;
export const selectPromotionalCategoriesLoading = (state: RootState) =>
  state.category.promotionalCategoriesLoading;

export const selectBannerList = (state: RootState) => state.category.bannerList;
export const selectBannerListLoading = (state: RootState) =>
  state.category.bannerListLoading;

export const categoryReducer = categorySlice.reducer;
