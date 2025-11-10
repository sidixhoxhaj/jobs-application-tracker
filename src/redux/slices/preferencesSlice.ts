// Preferences Slice
// Manages user preferences (theme, pagination, etc.)
// Supports both sync (localStorage) and async (Supabase) operations

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Theme } from '../../types';
import * as dataService from '../../services/dataService';

interface PreferencesState {
  theme: Theme;
  defaultPagination: number;
  loading: boolean;
  error: string | null;
}

const initialState: PreferencesState = {
  theme: 'light',
  defaultPagination: 20,
  loading: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Fetch preferences
 * Automatically uses Supabase (if authenticated) or localStorage (if not)
 */
export const fetchPreferences = createAsyncThunk(
  'preferences/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      return await dataService.loadPreferences();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch preferences');
    }
  }
);

/**
 * Save preferences
 * Automatically uses Supabase (if authenticated) or localStorage (if not)
 */
export const savePreferencesAsync = createAsyncThunk(
  'preferences/savePreferences',
  async (preferences: Omit<PreferencesState, 'loading' | 'error'>, { rejectWithValue }) => {
    try {
      await dataService.savePreferences(preferences);
      return preferences;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save preferences');
    }
  }
);

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    // Sync reducers (keep for backward compatibility)
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setDefaultPagination: (state, action: PayloadAction<number>) => {
      state.defaultPagination = action.payload;
    },
    setPreferences: (state, action: PayloadAction<Omit<PreferencesState, 'loading' | 'error'>>) => {
      state.theme = action.payload.theme;
      state.defaultPagination = action.payload.defaultPagination;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch preferences
    builder
      .addCase(fetchPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.theme = action.payload.theme;
        state.defaultPagination = action.payload.defaultPagination;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch preferences';
      });

    // Save preferences
    builder
      .addCase(savePreferencesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePreferencesAsync.fulfilled, (state, action) => {
        state.theme = action.payload.theme;
        state.defaultPagination = action.payload.defaultPagination;
        state.loading = false;
        state.error = null;
      })
      .addCase(savePreferencesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to save preferences';
      });
  },
});

export const {
  setTheme,
  setDefaultPagination,
  setPreferences,
  clearError,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
