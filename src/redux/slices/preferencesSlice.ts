// Preferences Slice
// Manages user preferences (theme, pagination, etc.)

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Theme } from '../../types';

interface PreferencesState {
  theme: Theme;
  defaultPagination: number;
}

const initialState: PreferencesState = {
  theme: 'light',
  defaultPagination: 20,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setDefaultPagination: (state, action: PayloadAction<number>) => {
      state.defaultPagination = action.payload;
    },
    setPreferences: (state, action: PayloadAction<PreferencesState>) => {
      return action.payload;
    },
  },
});

export const {
  setTheme,
  setDefaultPagination,
  setPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
