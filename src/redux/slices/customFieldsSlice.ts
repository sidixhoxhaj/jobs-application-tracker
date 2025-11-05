// Custom Fields Slice
// Manages custom field configuration state

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CustomField } from '../../types';

interface CustomFieldsState {
  fields: CustomField[];
  loading: boolean;
}

const initialState: CustomFieldsState = {
  fields: [],
  loading: false,
};

const customFieldsSlice = createSlice({
  name: 'customFields',
  initialState,
  reducers: {
    setFields: (state, action: PayloadAction<CustomField[]>) => {
      state.fields = action.payload;
    },
    addField: (state, action: PayloadAction<CustomField>) => {
      state.fields.push(action.payload);
    },
    updateField: (state, action: PayloadAction<CustomField>) => {
      const index = state.fields.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        state.fields[index] = action.payload;
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter(field => field.id !== action.payload);
    },
    reorderFields: (state, action: PayloadAction<CustomField[]>) => {
      state.fields = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setFields,
  addField,
  updateField,
  deleteField,
  reorderFields,
  setLoading,
} = customFieldsSlice.actions;

export default customFieldsSlice.reducer;
