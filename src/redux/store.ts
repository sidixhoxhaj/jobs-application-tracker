// Redux Store Configuration

import { configureStore } from '@reduxjs/toolkit';
import applicationsReducer from './slices/applicationsSlice';
import customFieldsReducer from './slices/customFieldsSlice';
import preferencesReducer from './slices/preferencesSlice';
import chartConfigsReducer from './slices/chartConfigsSlice';

export const store = configureStore({
  reducer: {
    applications: applicationsReducer,
    customFields: customFieldsReducer,
    preferences: preferencesReducer,
    chartConfigs: chartConfigsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
