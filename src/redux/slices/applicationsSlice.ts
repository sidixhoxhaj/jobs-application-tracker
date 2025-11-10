// Applications Slice
// Manages job application state with CRUD operations
// Supports both sync (localStorage) and async (Supabase) operations

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Application } from '../../types';
import * as dataService from '../../services/dataService';

interface ApplicationsState {
  items: Application[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  items: [],
  loading: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS (use dataService - automatically routes to Supabase or localStorage)
// ============================================================================

/**
 * Fetch all applications
 * Automatically uses Supabase (if authenticated) or localStorage (if not)
 */
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      return await dataService.loadApplications();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch applications');
    }
  }
);

/**
 * Add a new application
 * Automatically uses Supabase (if authenticated) or localStorage (if not)
 */
export const addApplicationAsync = createAsyncThunk(
  'applications/addApplication',
  async (application: Application, { rejectWithValue }) => {
    try {
      return await dataService.saveApplication(application);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add application');
    }
  }
);

/**
 * Update an existing application
 * Automatically uses Supabase (if authenticated) or localStorage (if not)
 */
export const updateApplicationAsync = createAsyncThunk(
  'applications/updateApplication',
  async (application: Application, { rejectWithValue }) => {
    try {
      return await dataService.updateApplication(application);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update application');
    }
  }
);

/**
 * Delete an application
 * Automatically uses Supabase (if authenticated) or localStorage (if not)
 */
export const deleteApplicationAsync = createAsyncThunk(
  'applications/deleteApplication',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      await dataService.deleteApplication(applicationId);
      return applicationId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete application');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    // Sync reducers (keep for backward compatibility during migration)
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
    clearError: (state) => {
      state.error = null;
    },
    // Note management actions
    addNote: (state, action: PayloadAction<{ applicationId: string; note: { id: string; content: string; createdAt: string; updatedAt: string } }>) => {
      const application = state.items.find(app => app.id === action.payload.applicationId);
      if (application) {
        application.notes.push(action.payload.note);
        application.updatedAt = new Date().toISOString();
      }
    },
    updateNote: (state, action: PayloadAction<{ applicationId: string; noteId: string; content: string }>) => {
      const application = state.items.find(app => app.id === action.payload.applicationId);
      if (application) {
        const note = application.notes.find(n => n.id === action.payload.noteId);
        if (note) {
          note.content = action.payload.content;
          note.updatedAt = new Date().toISOString();
          application.updatedAt = new Date().toISOString();
        }
      }
    },
    deleteNote: (state, action: PayloadAction<{ applicationId: string; noteId: string }>) => {
      const application = state.items.find(app => app.id === action.payload.applicationId);
      if (application) {
        application.notes = application.notes.filter(n => n.id !== action.payload.noteId);
        application.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch applications
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch applications';
      });

    // Add application
    builder
      .addCase(addApplicationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addApplicationAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addApplicationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to add application';
      });

    // Update application
    builder
      .addCase(updateApplicationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateApplicationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update application';
      });

    // Delete application
    builder
      .addCase(deleteApplicationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApplicationAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(app => app.id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteApplicationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete application';
      });
  },
});

export const {
  setApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  setLoading,
  clearError,
  addNote,
  updateNote,
  deleteNote,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;
