// Applications Slice
// Manages job application state with CRUD operations

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Application } from '../../types';

interface ApplicationsState {
  items: Application[];
  loading: boolean;
}

const initialState: ApplicationsState = {
  items: [],
  loading: false,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.items = action.payload;
    },
    addApplication: (state, action: PayloadAction<Application>) => {
      state.items.push(action.payload);
    },
    updateApplication: (state, action: PayloadAction<Application>) => {
      const index = state.items.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteApplication: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(app => app.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  setLoading,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;
