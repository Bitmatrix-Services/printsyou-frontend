import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@store/store';

export interface ProgressProps {
  showTopLinearProgressBar: boolean;
}

const INITIAL_PROPS: ProgressProps = {
  showTopLinearProgressBar: false
};

export const progressSlice = createSlice({
  name: 'progress',
  initialState: INITIAL_PROPS,
  reducers: {
    setTopProgressState: (
      state,
      action: PayloadAction<ProgressProps['showTopLinearProgressBar']>
    ) => {
      state.showTopLinearProgressBar = action.payload;
    }
  }
});

export const {setTopProgressState} = progressSlice.actions;
export const getTopProgressState = (state: RootState) =>
  state.progress.showTopLinearProgressBar;
export const ProgressReducer = progressSlice.reducer;
