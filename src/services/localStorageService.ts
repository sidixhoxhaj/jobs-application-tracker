// localStorage Service
// Handles all localStorage operations for the application

import type { Application, CustomField, UserPreference } from '../types';

// localStorage keys
const KEYS = {
  APPLICATIONS: 'job_tracker_applications',
  CUSTOM_FIELDS: 'job_tracker_custom_fields',
  PREFERENCES: 'job_tracker_preferences',
};

// Default custom fields configuration
const DEFAULT_CUSTOM_FIELDS: CustomField[] = [
  {
    id: 'companyName',
    name: 'Company Name',
    type: 'text',
    required: true,
    order: 1,
  },
  {
    id: 'jobPosition',
    name: 'Job Position',
    type: 'text',
    required: true,
    order: 2,
  },
  {
    id: 'jobDescription',
    name: 'Job Description',
    type: 'textarea',
    required: false,
    order: 3,
  },
  {
    id: 'applicationDate',
    name: 'Application Date',
    type: 'date',
    required: true,
    order: 4,
  },
  {
    id: 'status',
    name: 'Status',
    type: 'select',
    required: true,
    order: 5,
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
  },
];

// Default user preferences
const DEFAULT_PREFERENCES: UserPreference = {
  theme: 'light',
  defaultPagination: 20,
};

// Applications
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

// Custom Fields
export const loadCustomFields = (): CustomField[] => {
  try {
    const data = localStorage.getItem(KEYS.CUSTOM_FIELDS);
    if (!data) return DEFAULT_CUSTOM_FIELDS;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading custom fields from localStorage:', error);
    return DEFAULT_CUSTOM_FIELDS;
  }
};

export const saveCustomFields = (fields: CustomField[]): boolean => {
  try {
    localStorage.setItem(KEYS.CUSTOM_FIELDS, JSON.stringify(fields));
    return true;
  } catch (error) {
    console.error('Error saving custom fields to localStorage:', error);
    return false;
  }
};

// User Preferences
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

export const savePreferences = (preferences: UserPreference): boolean => {
  try {
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
    return false;
  }
};

// Initialize default data if none exists
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

// Clear all data (for testing or reset)
export const clearAllData = (): void => {
  localStorage.removeItem(KEYS.APPLICATIONS);
  localStorage.removeItem(KEYS.CUSTOM_FIELDS);
  localStorage.removeItem(KEYS.PREFERENCES);
};

// Check if localStorage is available
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
