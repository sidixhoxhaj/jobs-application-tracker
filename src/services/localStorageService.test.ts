// Tests for localStorageService
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadApplications,
  saveApplications,
  loadCustomFields,
  saveCustomFields,
  loadPreferences,
  savePreferences,
  initializeDefaultData,
  isFirstVisit,
  markFirstVisitComplete,
  loadDemoData,
  startFromScratch,
  clearAllData,
  isLocalStorageAvailable,
  loadChartConfigs,
  saveChartConfigs,
} from './localStorageService';
import type { Application, CustomField, UserPreference } from '../types';

describe('localStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('loadApplications', () => {
    it('should return empty array when no data exists', () => {
      const result = loadApplications();
      expect(result).toEqual([]);
    });

    it('should return parsed applications from localStorage', () => {
      const mockApps: Application[] = [
        {
          id: '1',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          data: { companyName: 'Test Co' },
          notes: [],
        },
      ];
      localStorage.setItem('job_tracker_applications', JSON.stringify(mockApps));

      const result = loadApplications();
      expect(result).toEqual(mockApps);
    });

    it('should return empty array on parse error', () => {
      localStorage.setItem('job_tracker_applications', 'invalid json');
      const result = loadApplications();
      expect(result).toEqual([]);
    });
  });

  describe('saveApplications', () => {
    it('should save applications to localStorage', () => {
      const mockApps: Application[] = [
        {
          id: '1',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          data: { companyName: 'Test Co' },
          notes: [],
        },
      ];

      const result = saveApplications(mockApps);
      expect(result).toBe(true);
      expect(localStorage.getItem('job_tracker_applications')).toBe(JSON.stringify(mockApps));
    });
  });

  describe('loadCustomFields', () => {
    it('should return default fields when no data exists', () => {
      const result = loadCustomFields();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('type');
    });

    it('should return parsed custom fields from localStorage', () => {
      const mockFields: CustomField[] = [
        {
          id: 'test',
          name: 'Test Field',
          type: 'text',
          required: true,
          order: 1,
          showInTable: true,
        },
      ];
      localStorage.setItem('job_tracker_custom_fields', JSON.stringify(mockFields));

      const result = loadCustomFields();
      expect(result).toEqual(mockFields);
    });

    it('should migrate old data without showInTable property', () => {
      const oldFields = [
        {
          id: 'test',
          name: 'Test Field',
          type: 'text',
          required: true,
          order: 1,
        },
      ];
      localStorage.setItem('job_tracker_custom_fields', JSON.stringify(oldFields));

      const result = loadCustomFields();
      expect(result[0].showInTable).toBe(true); // Default value added
    });
  });

  describe('saveCustomFields', () => {
    it('should save custom fields to localStorage', () => {
      const mockFields: CustomField[] = [
        {
          id: 'test',
          name: 'Test Field',
          type: 'text',
          required: true,
          order: 1,
          showInTable: true,
        },
      ];

      const result = saveCustomFields(mockFields);
      expect(result).toBe(true);
      expect(localStorage.getItem('job_tracker_custom_fields')).toBe(JSON.stringify(mockFields));
    });
  });

  describe('loadPreferences', () => {
    it('should return default preferences when no data exists', () => {
      const result = loadPreferences();
      expect(result).toHaveProperty('theme');
      expect(result).toHaveProperty('defaultPagination');
    });

    it('should return parsed preferences from localStorage', () => {
      const mockPrefs: UserPreference = {
        theme: 'dark',
        defaultPagination: 40,
      };
      localStorage.setItem('job_tracker_preferences', JSON.stringify(mockPrefs));

      const result = loadPreferences();
      expect(result).toEqual(mockPrefs);
    });
  });

  describe('savePreferences', () => {
    it('should save preferences to localStorage', () => {
      const mockPrefs: UserPreference = {
        theme: 'dark',
        defaultPagination: 60,
      };

      const result = savePreferences(mockPrefs);
      expect(result).toBe(true);
      expect(localStorage.getItem('job_tracker_preferences')).toBe(JSON.stringify(mockPrefs));
    });
  });

  describe('initializeDefaultData', () => {
    it('should initialize custom fields if not present', () => {
      initializeDefaultData();
      expect(localStorage.getItem('job_tracker_custom_fields')).not.toBeNull();
    });

    it('should initialize preferences if not present', () => {
      initializeDefaultData();
      expect(localStorage.getItem('job_tracker_preferences')).not.toBeNull();
    });

    it('should not overwrite existing data', () => {
      const existingFields = [{ id: 'existing', name: 'Existing', type: 'text', required: true, order: 1, showInTable: true }];
      localStorage.setItem('job_tracker_custom_fields', JSON.stringify(existingFields));

      initializeDefaultData();
      const result = loadCustomFields();
      expect(result[0].id).toBe('existing');
    });
  });

  describe('isFirstVisit', () => {
    it('should return true when no first visit flag exists', () => {
      expect(isFirstVisit()).toBe(true);
    });

    it('should return false when first visit flag exists', () => {
      localStorage.setItem('job_tracker_first_visit', 'true');
      expect(isFirstVisit()).toBe(false);
    });
  });

  describe('markFirstVisitComplete', () => {
    it('should set first visit flag in localStorage', () => {
      markFirstVisitComplete();
      expect(localStorage.getItem('job_tracker_first_visit')).toBe('true');
      expect(isFirstVisit()).toBe(false);
    });
  });

  describe('loadDemoData', () => {
    it('should populate localStorage with demo data', () => {
      loadDemoData();

      expect(localStorage.getItem('job_tracker_applications')).not.toBeNull();
      expect(localStorage.getItem('job_tracker_custom_fields')).not.toBeNull();
      expect(localStorage.getItem('job_tracker_preferences')).not.toBeNull();
      expect(localStorage.getItem('job_tracker_first_visit')).toBe('true');
    });

    it('should load applications with demo data', () => {
      loadDemoData();
      const apps = loadApplications();
      expect(apps.length).toBeGreaterThan(0);
    });
  });

  describe('startFromScratch', () => {
    it('should initialize with empty applications', () => {
      startFromScratch();
      const apps = loadApplications();
      expect(apps).toEqual([]);
    });

    it('should set default custom fields', () => {
      startFromScratch();
      const fields = loadCustomFields();
      expect(fields.length).toBeGreaterThan(0);
    });

    it('should mark first visit as complete', () => {
      startFromScratch();
      expect(isFirstVisit()).toBe(false);
    });
  });

  describe('clearAllData', () => {
    it('should remove applications from localStorage', () => {
      localStorage.setItem('job_tracker_applications', '[]');
      clearAllData();
      expect(localStorage.getItem('job_tracker_applications')).toBeNull();
    });

    it('should remove custom fields from localStorage', () => {
      localStorage.setItem('job_tracker_custom_fields', '[]');
      clearAllData();
      expect(localStorage.getItem('job_tracker_custom_fields')).toBeNull();
    });

    it('should remove preferences from localStorage', () => {
      localStorage.setItem('job_tracker_preferences', '{}');
      clearAllData();
      expect(localStorage.getItem('job_tracker_preferences')).toBeNull();
    });

    it('should not remove first visit flag', () => {
      localStorage.setItem('job_tracker_first_visit', 'true');
      clearAllData();
      expect(localStorage.getItem('job_tracker_first_visit')).toBe('true');
    });
  });

  describe('isLocalStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });
  });

  describe('loadChartConfigs', () => {
    it('should return null when no data exists', () => {
      const result = loadChartConfigs();
      expect(result).toBeNull();
    });

    it('should return parsed chart configs from localStorage', () => {
      const mockConfigs = {
        charts: [{ id: 'chart1', type: 'pie', title: 'Test' }],
        overviewCards: [{ id: 'card1', title: 'Test Card' }],
      };
      localStorage.setItem('job_tracker_chart_configs', JSON.stringify(mockConfigs));

      const result = loadChartConfigs();
      expect(result).toEqual(mockConfigs);
    });

    it('should handle missing arrays gracefully', () => {
      localStorage.setItem('job_tracker_chart_configs', JSON.stringify({}));
      const result = loadChartConfigs();
      expect(result?.charts).toEqual([]);
      expect(result?.overviewCards).toEqual([]);
    });
  });

  describe('saveChartConfigs', () => {
    it('should save chart configs to localStorage', () => {
      const mockCharts = [{ id: 'chart1', type: 'pie', title: 'Test' }];
      const mockCards = [{ id: 'card1', title: 'Test Card' }];

      const result = saveChartConfigs(mockCharts as any, mockCards as any);
      expect(result).toBe(true);

      const saved = localStorage.getItem('job_tracker_chart_configs');
      const parsed = JSON.parse(saved!);
      expect(parsed.charts).toEqual(mockCharts);
      expect(parsed.overviewCards).toEqual(mockCards);
    });
  });
});
