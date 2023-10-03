import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

import {CategoryInitialState, Category} from './category';
import {http} from 'services/axios.service';
import {RootState} from '@store/store';

const INITIAL_STATE: CategoryInitialState = {
  categoryList: []
};

export const getAllCategoryList = createAsyncThunk(
  'category/getAllCategoryList',
  async () => {
    const res = await http.get(`category/all`);
    return res?.data.payload;
  }
);

export const categorySlice = createSlice({
  name: 'category',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: {
    [getAllCategoryList.fulfilled.type]: (
      state,
      action: PayloadAction<Category[]>
    ) => {
      state.categoryList = action.payload;
    }
  }
});

export const selectCategoryList = (state: RootState) =>
  state.category.categoryList;

export const categoryReducer = categorySlice.reducer;
