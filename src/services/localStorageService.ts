// localStorage Service
// Handles all localStorage operations for the application

import type {
  Application,
  CustomField,
  UserPreference,
  ChartConfig,
  OverviewCardConfig,
} from '../types';
import {
  DEMO_APPLICATIONS,
  DEMO_CUSTOM_FIELDS,
  DEMO_CHART_CONFIGS,
  DEMO_OVERVIEW_CARDS,
} from '../data/demoData';

// localStorage keys
const KEYS = {
  APPLICATIONS: 'job_tracker_applications',
  CUSTOM_FIELDS: 'job_tracker_custom_fields',
  PREFERENCES: 'job_tracker_preferences',
  CHART_CONFIGS: 'job_tracker_chart_configs',
  FIRST_VISIT: 'job_tracker_first_visit',
};

// Default custom fields configuration
const DEFAULT_CUSTOM_FIELDS: CustomField[] = [
  {
    id: 'companyName',
    name: 'Company Name',
    type: 'text',
    required: true,
    order: 1,
    showInTable: true,
  },
  {
    id: 'jobPosition',
    name: 'Job Position',
    type: 'text',
    required: true,
    order: 2,
    showInTable: true,
  },
  {
    id: 'jobDescription',
    name: 'Job Description',
    type: 'textarea',
    required: false,
    order: 3,
    showInTable: false, // Long text, better viewed in modal
  },
  {
    id: 'applicationDate',
    name: 'Application Date',
    type: 'date',
    required: true,
    order: 4,
    showInTable: true,
  },
  {
    id: 'status',
    name: 'Status',
    type: 'select',
    required: true,
    order: 5,
    showInTable: true,
    options: [
      { value: 'applied', label: 'Applied', color: '#0070F3' },
      { value: 'screening', label: 'Screening', color: '#7928CA' },
      { value: 'interview_scheduled', label: 'Interview Scheduled', color: '#F5A623' },
      { value: 'interview_completed', label: 'Interview Completed', color: '#50E3C2' },
      { value: 'offer_received', label: 'Offer Received', color: '#00C853' },
      { value: 'rejected', label: 'Rejected', color: '#E00' },
      { value: 'withdrawn', label: 'Withdrawn', color: '#A3A3A3' },
    ],
  },
  {
    id: 'responseDate',
    name: 'First Response Date',
    type: 'date',
    required: false,
    order: 6,
    showInTable: true,
  },
];

// Default user preferences
const DEFAULT_PREFERENCES: UserPreference = {
  theme: 'light',
  defaultPagination: 20,
};

/**
 * Load all job applications from localStorage
 * @returns Array of applications, or empty array if none found
 */
export const loadApplications = (): Application[] => {
  try {
    const data = localStorage.getItem(KEYS.APPLICATIONS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading applications from localStorage:', error);
    return [];
  }
};

/**
 * Save job applications to localStorage
 * Handles quota exceeded errors gracefully
 * @param applications - Array of applications to save
 * @returns True if save was successful, false otherwise
 */
export const saveApplications = (applications: Application[]): boolean => {
  try {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(applications));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
      alert('Storage limit reached. Please delete some applications or export your data.');
    } else {
      console.error('Error saving applications to localStorage:', error);
    }
    return false;
  }
};

/**
 * Load custom field definitions from localStorage
 * Returns default fields if none exist. Migrates old data to add showInTable property.
 * @returns Array of custom field definitions
 */
export const loadCustomFields = (): CustomField[] => {
  try {
    const data = localStorage.getItem(KEYS.CUSTOM_FIELDS);
    if (!data) return DEFAULT_CUSTOM_FIELDS;
    
    const fields: CustomField[] = JSON.parse(data);
    
    // Migrate old data: add showInTable property if missing (default to true for backward compatibility)
    return fields.map(field => ({
      ...field,
      showInTable: field.showInTable !== undefined ? field.showInTable : true,
    }));
  } catch (error) {
    console.error('Error loading custom fields from localStorage:', error);
    return DEFAULT_CUSTOM_FIELDS;
  }
};

/**
 * Save custom field definitions to localStorage
 * @param fields - Array of custom field definitions to save
 * @returns True if save was successful, false otherwise
 */
export const saveCustomFields = (fields: CustomField[]): boolean => {
  try {
    localStorage.setItem(KEYS.CUSTOM_FIELDS, JSON.stringify(fields));
    return true;
  } catch (error) {
    console.error('Error saving custom fields to localStorage:', error);
    return false;
  }
};

/**
 * Load user preferences from localStorage
 * Returns default preferences if none exist
 * @returns User preference object with theme and pagination settings
 */
export const loadPreferences = (): UserPreference => {
  try {
    const data = localStorage.getItem(KEYS.PREFERENCES);
    if (!data) return DEFAULT_PREFERENCES;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading preferences from localStorage:', error);
    return DEFAULT_PREFERENCES;
  }
};

/**
 * Save user preferences to localStorage
 * @param preferences - User preference object to save
 * @returns True if save was successful, false otherwise
 */
export const savePreferences = (preferences: UserPreference): boolean => {
  try {
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
    return false;
  }
};

/**
 * Initialize default data if none exists
 * Sets up custom fields and preferences on first load
 */
export const initializeDefaultData = (): void => {
  // Initialize custom fields if not present
  if (!localStorage.getItem(KEYS.CUSTOM_FIELDS)) {
    saveCustomFields(DEFAULT_CUSTOM_FIELDS);
  }

  // Initialize preferences if not present
  if (!localStorage.getItem(KEYS.PREFERENCES)) {
    savePreferences(DEFAULT_PREFERENCES);
  }

  // Applications start empty, no need to initialize
};

/**
 * Check if this is the user's first visit
 * @returns True if first visit, false otherwise
 */
export const isFirstVisit = (): boolean => {
  return !localStorage.getItem(KEYS.FIRST_VISIT);
};

/**
 * Mark that user has completed first visit
 * Prevents welcome modal from showing again
 */
export const markFirstVisitComplete = (): void => {
  localStorage.setItem(KEYS.FIRST_VISIT, 'true');
};

/**
 * Load demo data for first-time users
 * Populates application with sample data, custom fields, chart configs, and preferences
 */
export const loadDemoData = (): void => {
  saveApplications(DEMO_APPLICATIONS);
  saveCustomFields(DEMO_CUSTOM_FIELDS);
  saveChartConfigs(DEMO_CHART_CONFIGS, DEMO_OVERVIEW_CARDS);
  savePreferences({ theme: 'light', defaultPagination: 10 });
  markFirstVisitComplete();
};

/**
 * Start from scratch with empty data
 * Initializes with default custom fields and preferences, but no applications
 */
export const startFromScratch = (): void => {
  saveApplications([]);
  saveCustomFields(DEFAULT_CUSTOM_FIELDS);
  saveChartConfigs([], []);
  savePreferences(DEFAULT_PREFERENCES);
  markFirstVisitComplete();
};

/**
 * Clear all application data from localStorage
 * Used for testing or complete reset. Does not clear first visit flag.
 */
export const clearAllData = (): void => {
  localStorage.removeItem(KEYS.APPLICATIONS);
  localStorage.removeItem(KEYS.CUSTOM_FIELDS);
  localStorage.removeItem(KEYS.PREFERENCES);
};

/**
 * Check if localStorage is available and accessible
 * Tests by attempting to set and remove a test item
 * @returns True if localStorage is available, false otherwise
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Load chart configurations and overview cards from localStorage
 * @returns Object with charts and overviewCards arrays, or null if none exist
 */
export const loadChartConfigs = ():
  | { charts: ChartConfig[]; overviewCards: OverviewCardConfig[] }
  | null => {
  try {
    const data = localStorage.getItem(KEYS.CHART_CONFIGS);
    if (!data) return null;

    const parsed = JSON.parse(data);
    return {
      charts: parsed.charts || [],
      overviewCards: parsed.overviewCards || [],
    };
  } catch (error) {
    console.error('Error loading chart configs from localStorage:', error);
    return null;
  }
};

/**
 * Save chart configurations and overview cards to localStorage
 * @param charts - Array of chart configurations
 * @param overviewCards - Array of overview card configurations
 * @returns True if save was successful, false otherwise
 */
export const saveChartConfigs = (
  charts: ChartConfig[],
  overviewCards: OverviewCardConfig[]
): boolean => {
  try {
    const data = {
      charts,
      overviewCards,
    };
    localStorage.setItem(KEYS.CHART_CONFIGS, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving chart configs to localStorage:', error);
    return false;
  }
};
