import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

import {CategoryInitialState, Category} from './category';
import {http} from 'services/axios.service';
import {RootState} from '@store/store';

const INITIAL_STATE: CategoryInitialState = {
  categoryList: [],
  categoryListLoading: false,
  promotionalCategories: [],
  promotionalCategoriesLoading: false
};

export const getAllCategoryList = createAsyncThunk(
  'category/getAllCategoryList',
  async () => {
    const res = await http.get(`/category/all`);
    return res?.data.payload;
  }
);

export const getPromotionalCategories = createAsyncThunk(
  'product/getPromotionalCategories',
  async () => {
    const res = await http.get(`/category/popular`);
    return res?.data.payload;
  }
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

export const categoryReducer = categorySlice.reducer;
