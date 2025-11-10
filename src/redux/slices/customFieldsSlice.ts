// Custom Fields Slice
// Manages custom field configuration state
// Supports both sync (localStorage) and async (Supabase) operations

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { CustomField } from '../../types';
import * as dataService from '../../services/dataService';

interface CustomFieldsState {
  fields: CustomField[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomFieldsState = {
  fields: [],
  loading: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Fetch custom fields
 * Automatically uses Supabase (if authenticated) or localStorage (if not)
 */
export const fetchCustomFields = createAsyncThunk(
  'customFields/fetchCustomFields',
  async (_, { rejectWithValue }) => {
    try {
      return await dataService.loadCustomFields();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch custom fields');
    }
  }
);

/**
 * Save custom fields (replaces all)
 * Automatically uses Supabase (if authenticated) or localStorage (if not)
 */
export const saveCustomFieldsAsync = createAsyncThunk(
  'customFields/saveCustomFields',
  async (fields: CustomField[], { rejectWithValue }) => {
    try {
      await dataService.saveCustomFields(fields);
      return fields;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save custom fields');
    }
  }
);

const customFieldsSlice = createSlice({
  name: 'customFields',
  initialState,
  reducers: {
    // Sync reducers (keep for backward compatibility)
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
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch custom fields
    builder
      .addCase(fetchCustomFields.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomFields.fulfilled, (state, action) => {
        state.fields = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCustomFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch custom fields';
      });

    // Save custom fields
    builder
      .addCase(saveCustomFieldsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCustomFieldsAsync.fulfilled, (state, action) => {
        state.fields = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(saveCustomFieldsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to save custom fields';
      });
  },
});

export const {
  setFields,
  addField,
  updateField,
  deleteField,
  reorderFields,
  setLoading,
  clearError,
} = customFieldsSlice.actions;

export default customFieldsSlice.reducer;
