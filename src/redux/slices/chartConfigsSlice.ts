// Chart Configurations Slice
// Manages chart and overview card configurations for statistics dashboard
// Supports both sync (localStorage) and async (Supabase) operations

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ChartConfig,
  OverviewCardConfig,
  getDefaultChartConfigs,
  getDefaultOverviewCardConfigs,
} from '../../types/chartConfig';
import * as dataService from '../../services/dataService';

interface ChartConfigsState {
  charts: ChartConfig[];
  overviewCards: OverviewCardConfig[];
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ChartConfigsState = {
  charts: [],
  overviewCards: [],
  initialized: false,
  loading: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Fetch chart configurations
 * Automatically uses Supabase (if authenticated) or localStorage (if not)
 */
export const fetchChartConfigs = createAsyncThunk(
  'chartConfigs/fetchChartConfigs',
  async (_, { rejectWithValue }) => {
    try {
      return await dataService.loadChartConfigs();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch chart configs');
    }
  }
);

/**
 * Save chart configurations
 * Automatically uses Supabase (if authenticated) or localStorage (if not)
 */
export const saveChartConfigsAsync = createAsyncThunk(
  'chartConfigs/saveChartConfigs',
  async (configs: { charts: ChartConfig[]; overviewCards: OverviewCardConfig[] }, { rejectWithValue }) => {
    try {
      await dataService.saveChartConfigs(configs.charts, configs.overviewCards);
      return configs;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save chart configs');
    }
  }
);

const chartConfigsSlice = createSlice({
  name: 'chartConfigs',
  initialState,
  reducers: {
    // Initialize with saved configs or defaults
    initializeConfigs: (
      state,
      action: PayloadAction<{ statusFieldId?: string }>
    ) => {
      if (state.initialized) return;

      // Note: Initialization will be handled by fetchChartConfigs thunk
      // This sync reducer is kept for backward compatibility
      state.charts = getDefaultChartConfigs(action.payload.statusFieldId);
      state.overviewCards = getDefaultOverviewCardConfigs();
      state.initialized = true;
    },

    // Chart actions (sync - for immediate UI updates)
    addChart: (state, action: PayloadAction<ChartConfig>) => {
      if (state.charts.length >= 4) {
        console.warn('Maximum 4 charts allowed');
        return;
      }

      state.charts.push(action.payload);
      state.charts.sort((a, b) => a.order - b.order);
    },

    updateChart: (state, action: PayloadAction<ChartConfig>) => {
      const index = state.charts.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.charts[index] = action.payload;
      }
    },

    deleteChart: (state, action: PayloadAction<string>) => {
      state.charts = state.charts.filter((c) => c.id !== action.payload);
      // Recalculate order
      state.charts = state.charts.map((c, index) => ({ ...c, order: index + 1 }));
    },

    reorderCharts: (state, action: PayloadAction<ChartConfig[]>) => {
      state.charts = action.payload.map((c, index) => ({ ...c, order: index + 1 }));
    },

    moveChartUp: (state, action: PayloadAction<string>) => {
      const index = state.charts.findIndex((c) => c.id === action.payload);
      if (index > 0) {
        [state.charts[index - 1], state.charts[index]] = [
          state.charts[index],
          state.charts[index - 1],
        ];
        state.charts = state.charts.map((c, i) => ({ ...c, order: i + 1 }));
      }
    },

    moveChartDown: (state, action: PayloadAction<string>) => {
      const index = state.charts.findIndex((c) => c.id === action.payload);
      if (index !== -1 && index < state.charts.length - 1) {
        [state.charts[index], state.charts[index + 1]] = [
          state.charts[index + 1],
          state.charts[index],
        ];
        state.charts = state.charts.map((c, i) => ({ ...c, order: i + 1 }));
      }
    },

    // Overview card actions (sync - for immediate UI updates)
    addOverviewCard: (state, action: PayloadAction<OverviewCardConfig>) => {
      if (state.overviewCards.length >= 4) {
        console.warn('Maximum 4 overview cards allowed');
        return;
      }

      state.overviewCards.push(action.payload);
      state.overviewCards.sort((a, b) => a.order - b.order);
    },

    updateOverviewCard: (state, action: PayloadAction<OverviewCardConfig>) => {
      const index = state.overviewCards.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.overviewCards[index] = action.payload;
      }
    },

    deleteOverviewCard: (state, action: PayloadAction<string>) => {
      state.overviewCards = state.overviewCards.filter((c) => c.id !== action.payload);
      // Recalculate order
      state.overviewCards = state.overviewCards.map((c, index) => ({ ...c, order: index + 1 }));
    },

    reorderOverviewCards: (state, action: PayloadAction<OverviewCardConfig[]>) => {
      state.overviewCards = action.payload.map((c, index) => ({ ...c, order: index + 1 }));
    },

    moveOverviewCardUp: (state, action: PayloadAction<string>) => {
      const index = state.overviewCards.findIndex((c) => c.id === action.payload);
      if (index > 0) {
        [state.overviewCards[index - 1], state.overviewCards[index]] = [
          state.overviewCards[index],
          state.overviewCards[index - 1],
        ];
        state.overviewCards = state.overviewCards.map((c, i) => ({ ...c, order: i + 1 }));
      }
    },

    moveOverviewCardDown: (state, action: PayloadAction<string>) => {
      const index = state.overviewCards.findIndex((c) => c.id === action.payload);
      if (index !== -1 && index < state.overviewCards.length - 1) {
        [state.overviewCards[index], state.overviewCards[index + 1]] = [
          state.overviewCards[index + 1],
          state.overviewCards[index],
        ];
        state.overviewCards = state.overviewCards.map((c, i) => ({ ...c, order: i + 1 }));
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch chart configs
    builder
      .addCase(fetchChartConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartConfigs.fulfilled, (state, action) => {
        state.charts = action.payload.charts;
        state.overviewCards = action.payload.overviewCards;
        state.initialized = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchChartConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch chart configs';
        // On error, use defaults
        state.charts = getDefaultChartConfigs();
        state.overviewCards = getDefaultOverviewCardConfigs();
        state.initialized = true;
      });

    // Save chart configs
    builder
      .addCase(saveChartConfigsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveChartConfigsAsync.fulfilled, (state, action) => {
        state.charts = action.payload.charts;
        state.overviewCards = action.payload.overviewCards;
        state.loading = false;
        state.error = null;
      })
      .addCase(saveChartConfigsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to save chart configs';
      });
  },
});

export const {
  initializeConfigs,
  addChart,
  updateChart,
  deleteChart,
  reorderCharts,
  moveChartUp,
  moveChartDown,
  addOverviewCard,
  updateOverviewCard,
  deleteOverviewCard,
  reorderOverviewCards,
  moveOverviewCardUp,
  moveOverviewCardDown,
  clearError,
} = chartConfigsSlice.actions;

export default chartConfigsSlice.reducer;
