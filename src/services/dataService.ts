// Data Service Abstraction Layer
// Routes data operations to Supabase (authenticated) or localStorage (demo) based on auth state

import type {
  Application,
  CustomField,
  UserPreference,
  ChartConfig,
  OverviewCardConfig,
} from '../types';
import * as localStorageService from './localStorageService';
import * as supabaseService from './supabaseService';
import { supabase, isSupabaseAvailable } from '../lib/supabase';

/**
 * Check if user is authenticated
 * Returns true if user has active Supabase session, false otherwise
 */
export const isAuthenticated = async (): Promise<boolean> => {
  if (!isSupabaseAvailable || !supabase) {
    return false;
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error checking auth session:', error);
      return false;
    }
    return !!data.session;
  } catch (err) {
    console.error('Exception checking auth:', err);
    return false;
  }
};


// ============================================================================
// APPLICATION METHODS
// ============================================================================

/**
 * Load all applications for current user
 * Routes to Supabase if authenticated, localStorage if demo
 */
export const loadApplications = async (): Promise<Application[]> => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    return await supabaseService.loadApplications();
  } else {
    return Promise.resolve(localStorageService.loadApplications());
  }
};

/**
 * Save all applications
 * Routes to Supabase if authenticated, localStorage if demo
 */
export const saveApplications = async (applications: Application[]): Promise<boolean> => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    return await supabaseService.saveApplications(applications);
  } else {
    return Promise.resolve(localStorageService.saveApplications(applications));
  }
};

/**
 * Save a single application (add new)
 * Routes to Supabase if authenticated, localStorage if demo
 */
export const saveApplication = async (application: Application): Promise<Application> => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    return await supabaseService.saveApplication(application);
  } else {
    // For localStorage, add to existing applications
    const existingApps = localStorageService.loadApplications();
    localStorageService.saveApplications([...existingApps, application]);
    return Promise.resolve(application);
  }
};

/**
 * Update an existing application
 * Routes to Supabase if authenticated, localStorage if demo
 */
export const updateApplication = async (application: Application): Promise<Application> => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    return await supabaseService.updateApplication(application);
  } else {
    // For localStorage, update in array
    const existingApps = localStorageService.loadApplications();
    const updatedApps = existingApps.map(app => 
      app.id === application.id ? application : app
    );
    localStorageService.saveApplications(updatedApps);
    return Promise.resolve(application);
  }
};

/**
 * Delete an application
 * Routes to Supabase if authenticated, localStorage if demo
 */
export const deleteApplication = async (applicationId: string): Promise<void> => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    return await supabaseService.deleteApplication(applicationId);
  } else {
    // For localStorage, filter out deleted app
    const existingApps = localStorageService.loadApplications();
    const updatedApps = existingApps.filter(app => app.id !== applicationId);
    localStorageService.saveApplications(updatedApps);
    return Promise.resolve();
  }
};

// ============================================================================
// CUSTOM FIELDS METHODS
// ============================================================================

/**
 * Load custom fields configuration
 * Routes to Supabase if authenticated, localStorage if demo
 */
export const loadCustomFields = async (): Promise<CustomField[]> => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    return await supabaseService.loadCustomFields();
  } else {
    return Promise.resolve(localStorageService.loadCustomFields());
  }
};

/**
 * Save custom fields configuration
 * Routes to Supabase if authenticated, localStorage if demo
 */
export const saveCustomFields = async (fields: CustomField[]): Promise<boolean> => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    return await supabaseService.saveCustomFields(fields);
  } else {
    return Promise.resolve(localStorageService.saveCustomFields(fields));
  }
};

// ============================================================================
// PREFERENCES METHODS
// ============================================================================

/**
 * Load user preferences
 * Routes to Supabase if authenticated, localStorage if demo
 */
export const loadPreferences = async (): Promise<UserPreference> => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    return await supabaseService.loadPreferences();
  } else {
    return Promise.resolve(localStorageService.loadPreferences());
  }
};

/**
 * Save user preferences
 * Routes to Supabase if authenticated, localStorage if demo
 */
export const savePreferences = async (preferences: UserPreference): Promise<boolean> => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    return await supabaseService.savePreferences(preferences);
  } else {
    return Promise.resolve(localStorageService.savePreferences(preferences));
  }
};

// ============================================================================
// CHART CONFIGS METHODS
// ============================================================================

/**
 * Load chart configurations
 * Routes to Supabase if authenticated, localStorage if demo
 */
export const loadChartConfigs = async (): Promise<{
  charts: ChartConfig[];
  overviewCards: OverviewCardConfig[];
}> => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    return await supabaseService.loadChartConfigs();
  } else {
    const result = localStorageService.loadChartConfigs();
    return Promise.resolve(result || { charts: [], overviewCards: [] });
  }
};

/**
 * Save chart configurations
 * Routes to Supabase if authenticated, localStorage if demo
 */
export const saveChartConfigs = async (
  charts: ChartConfig[],
  overviewCards: OverviewCardConfig[]
): Promise<boolean> => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    return await supabaseService.saveChartConfigs(charts, overviewCards);
  } else {
    return Promise.resolve(localStorageService.saveChartConfigs(charts, overviewCards));
  }
};

// ============================================================================
// UTILITY METHODS (Demo-only - no Supabase equivalent needed)
// ============================================================================

/**
 * Initialize default data (demo mode only)
 */
export const initializeDefaultData = (): void => {
  localStorageService.initializeDefaultData();
};

/**
 * Check if this is user's first visit
 * Routes to Supabase (async) if authenticated, localStorage (sync) if not
 */
export const isFirstVisit = async (): Promise<boolean> => {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    return await supabaseService.isFirstVisit();
  } else {
    return localStorageService.isFirstVisit();
  }
};

/**
 * Mark first visit as complete (demo mode only)
 */
export const markFirstVisitComplete = (): void => {
  localStorageService.markFirstVisitComplete();
};

/**
 * Load demo data
 * Routes to Supabase (async) if authenticated, localStorage (sync) if not
 */
export const loadDemoData = async (): Promise<boolean> => {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    return await supabaseService.loadDemoData();
  } else {
    localStorageService.loadDemoData();
    return true;
  }
};

/**
 * Start from scratch (demo mode only)
 */
export const startFromScratch = (): void => {
  localStorageService.startFromScratch();
};

/**
 * Clear all data (demo mode only)
 */
export const clearAllData = (): void => {
  localStorageService.clearAllData();
};

/**
 * Check if localStorage is available (demo mode check)
 */
export const isLocalStorageAvailable = (): boolean => {
  return localStorageService.isLocalStorageAvailable();
};

// ============================================================================
// MODE DETECTION
// ============================================================================

/**
 * Get current data mode (authenticated or demo)
 */
export const getCurrentMode = async (): Promise<'authenticated' | 'demo'> => {
  const authenticated = await isAuthenticated();
  return authenticated ? 'authenticated' : 'demo';
};

/**
 * Check if Supabase integration is configured and available
 */
export const isSupabaseConfigured = (): boolean => {
  return isSupabaseAvailable;
};
