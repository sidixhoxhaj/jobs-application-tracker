import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the modules before importing them
vi.mock('./localStorageService');
vi.mock('./supabaseService');

import {
  loadApplications,
  saveApplication,
  updateApplication,
  deleteApplication,
  saveApplications,
  loadCustomFields,
  saveCustomFields,
  loadPreferences,
  savePreferences,
  loadChartConfigs,
  saveChartConfigs,
  isAuthenticated,
} from './dataService';
import * as localStorageService from './localStorageService';
import * as supabaseService from './supabaseService';
import { mockSupabaseClient } from '../test/setup';
import type { Application, CustomField, UserPreference, ChartConfig, OverviewCardConfig } from '../types';

// Get the mocked services
const mockLocalStorageService = vi.mocked(localStorageService);
const mockSupabaseService = vi.mocked(supabaseService);

describe('dataService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isAuthenticated', () => {
    it('should return false when no session exists', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await isAuthenticated();
      expect(result).toBe(false);
    });

    it('should return true when session exists', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });

      const result = await isAuthenticated();
      expect(result).toBe(true);
    });

    it('should return false on auth error', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: new Error('Auth error') as any,
      });

      const result = await isAuthenticated();
      expect(result).toBe(false);
    });
  });

  describe('loadApplications', () => {
    const mockApplications: Application[] = [
      {
        id: 'app-1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        data: { companyName: 'Test Company' },
        notes: [],
      },
    ];

    it('should route to Supabase when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });
      mockSupabaseService.loadApplications.mockResolvedValue(mockApplications);

      const result = await loadApplications();

      expect(mockSupabaseService.loadApplications).toHaveBeenCalled();
      expect(mockLocalStorageService.loadApplications).not.toHaveBeenCalled();
      expect(result).toEqual(mockApplications);
    });

    it('should route to localStorage when not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockLocalStorageService.loadApplications.mockReturnValue(mockApplications);

      const result = await loadApplications();

      expect(mockLocalStorageService.loadApplications).toHaveBeenCalled();
      expect(mockSupabaseService.loadApplications).not.toHaveBeenCalled();
      expect(result).toEqual(mockApplications);
    });
  });

  describe('saveApplication', () => {
    const mockApplication: Application = {
      id: 'app-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      data: { companyName: 'Test Company' },
      notes: [],
    };

    it('should route to Supabase when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });
      mockSupabaseService.saveApplication.mockResolvedValue(mockApplication);

      const result = await saveApplication(mockApplication);

      expect(mockSupabaseService.saveApplication).toHaveBeenCalledWith(mockApplication);
      expect(mockLocalStorageService.loadApplications).not.toHaveBeenCalled();
      expect(result).toEqual(mockApplication);
    });

    it('should route to localStorage when not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockLocalStorageService.loadApplications.mockReturnValue([]);
      mockLocalStorageService.saveApplications.mockReturnValue(true);

      const result = await saveApplication(mockApplication);

      expect(mockLocalStorageService.loadApplications).toHaveBeenCalled();
      expect(mockLocalStorageService.saveApplications).toHaveBeenCalledWith([mockApplication]);
      expect(mockSupabaseService.saveApplication).not.toHaveBeenCalled();
      expect(result).toEqual(mockApplication);
    });
  });

  describe('updateApplication', () => {
    const mockApplication: Application = {
      id: 'app-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      data: { companyName: 'Test Company' },
      notes: [],
    };

    it('should route to Supabase when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });
      mockSupabaseService.updateApplication.mockResolvedValue(mockApplication);

      const result = await updateApplication(mockApplication);

      expect(mockSupabaseService.updateApplication).toHaveBeenCalledWith(mockApplication);
      expect(mockLocalStorageService.loadApplications).not.toHaveBeenCalled();
      expect(result).toEqual(mockApplication);
    });

    it('should route to localStorage when not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockLocalStorageService.loadApplications.mockReturnValue([mockApplication]);
      mockLocalStorageService.saveApplications.mockReturnValue(true);

      const result = await updateApplication(mockApplication);

      expect(mockLocalStorageService.loadApplications).toHaveBeenCalled();
      expect(mockLocalStorageService.saveApplications).toHaveBeenCalledWith([mockApplication]);
      expect(mockSupabaseService.updateApplication).not.toHaveBeenCalled();
      expect(result).toEqual(mockApplication);
    });
  });

  describe('deleteApplication', () => {
    const mockApplication: Application = {
      id: 'app-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      data: { companyName: 'Test Company' },
      notes: [],
    };

    it('should route to Supabase when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });
      mockSupabaseService.deleteApplication.mockResolvedValue();

      await deleteApplication('app-1');

      expect(mockSupabaseService.deleteApplication).toHaveBeenCalledWith('app-1');
      expect(mockLocalStorageService.loadApplications).not.toHaveBeenCalled();
    });

    it('should route to localStorage when not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockLocalStorageService.loadApplications.mockReturnValue([mockApplication]);
      mockLocalStorageService.saveApplications.mockReturnValue(true);

      await deleteApplication('app-1');

      expect(mockLocalStorageService.loadApplications).toHaveBeenCalled();
      expect(mockLocalStorageService.saveApplications).toHaveBeenCalledWith([]);
      expect(mockSupabaseService.deleteApplication).not.toHaveBeenCalled();
    });
  });

  describe('saveApplications', () => {
    const mockApplications: Application[] = [
      {
        id: 'app-1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        data: { companyName: 'Test Company 1' },
        notes: [],
      },
      {
        id: 'app-2',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        data: { companyName: 'Test Company 2' },
        notes: [],
      },
    ];

    it('should route to Supabase when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });
      mockSupabaseService.saveApplications.mockResolvedValue(true);

      const result = await saveApplications(mockApplications);

      expect(mockSupabaseService.saveApplications).toHaveBeenCalledWith(mockApplications);
      expect(mockLocalStorageService.saveApplications).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should route to localStorage when not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockLocalStorageService.saveApplications.mockReturnValue(true);

      const result = await saveApplications(mockApplications);

      expect(mockLocalStorageService.saveApplications).toHaveBeenCalledWith(mockApplications);
      expect(mockSupabaseService.saveApplications).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('loadCustomFields', () => {
    const mockFields: CustomField[] = [
      {
        id: 'field-1',
        name: 'Company Name',
        type: 'text',
        required: true,
        order: 1,
        showInTable: true,
      },
    ];

    it('should route to Supabase when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });
      mockSupabaseService.loadCustomFields.mockResolvedValue(mockFields);

      const result = await loadCustomFields();

      expect(mockSupabaseService.loadCustomFields).toHaveBeenCalled();
      expect(mockLocalStorageService.loadCustomFields).not.toHaveBeenCalled();
      expect(result).toEqual(mockFields);
    });

    it('should route to localStorage when not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockLocalStorageService.loadCustomFields.mockReturnValue(mockFields);

      const result = await loadCustomFields();

      expect(mockLocalStorageService.loadCustomFields).toHaveBeenCalled();
      expect(mockSupabaseService.loadCustomFields).not.toHaveBeenCalled();
      expect(result).toEqual(mockFields);
    });
  });

  describe('saveCustomFields', () => {
    const mockFields: CustomField[] = [
      {
        id: 'field-1',
        name: 'Company Name',
        type: 'text',
        required: true,
        order: 1,
        showInTable: true,
      },
    ];

    it('should route to Supabase when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });
      mockSupabaseService.saveCustomFields.mockResolvedValue(true);

      const result = await saveCustomFields(mockFields);

      expect(mockSupabaseService.saveCustomFields).toHaveBeenCalledWith(mockFields);
      expect(mockLocalStorageService.saveCustomFields).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should route to localStorage when not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockLocalStorageService.saveCustomFields.mockReturnValue(true);

      const result = await saveCustomFields(mockFields);

      expect(mockLocalStorageService.saveCustomFields).toHaveBeenCalledWith(mockFields);
      expect(mockSupabaseService.saveCustomFields).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('loadPreferences', () => {
    const mockPreferences: UserPreference = {
      theme: 'light',
      defaultPagination: 20,
    };

    it('should route to Supabase when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });
      mockSupabaseService.loadPreferences.mockResolvedValue(mockPreferences);

      const result = await loadPreferences();

      expect(mockSupabaseService.loadPreferences).toHaveBeenCalled();
      expect(mockLocalStorageService.loadPreferences).not.toHaveBeenCalled();
      expect(result).toEqual(mockPreferences);
    });

    it('should route to localStorage when not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockLocalStorageService.loadPreferences.mockReturnValue(mockPreferences);

      const result = await loadPreferences();

      expect(mockLocalStorageService.loadPreferences).toHaveBeenCalled();
      expect(mockSupabaseService.loadPreferences).not.toHaveBeenCalled();
      expect(result).toEqual(mockPreferences);
    });
  });

  describe('savePreferences', () => {
    const mockPreferences: UserPreference = {
      theme: 'dark',
      defaultPagination: 40,
    };

    it('should route to Supabase when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });
      mockSupabaseService.savePreferences.mockResolvedValue(true);

      const result = await savePreferences(mockPreferences);

      expect(mockSupabaseService.savePreferences).toHaveBeenCalledWith(mockPreferences);
      expect(mockLocalStorageService.savePreferences).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should route to localStorage when not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockLocalStorageService.savePreferences.mockReturnValue(true);

      const result = await savePreferences(mockPreferences);

      expect(mockLocalStorageService.savePreferences).toHaveBeenCalledWith(mockPreferences);
      expect(mockSupabaseService.savePreferences).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('loadChartConfigs', () => {
    const mockChartConfigs = {
      charts: [] as ChartConfig[],
      overviewCards: [] as OverviewCardConfig[],
    };

    it('should route to Supabase when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });
      mockSupabaseService.loadChartConfigs.mockResolvedValue(mockChartConfigs);

      const result = await loadChartConfigs();

      expect(mockSupabaseService.loadChartConfigs).toHaveBeenCalled();
      expect(mockLocalStorageService.loadChartConfigs).not.toHaveBeenCalled();
      expect(result).toEqual(mockChartConfigs);
    });

    it('should route to localStorage when not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockLocalStorageService.loadChartConfigs.mockReturnValue(mockChartConfigs);

      const result = await loadChartConfigs();

      expect(mockLocalStorageService.loadChartConfigs).toHaveBeenCalled();
      expect(mockSupabaseService.loadChartConfigs).not.toHaveBeenCalled();
      expect(result).toEqual(mockChartConfigs);
    });
  });

  describe('saveChartConfigs', () => {
    const mockCharts: ChartConfig[] = [];
    const mockOverviewCards: OverviewCardConfig[] = [];

    it('should route to Supabase when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } as any },
        error: null,
      });
      mockSupabaseService.saveChartConfigs.mockResolvedValue(true);

      const result = await saveChartConfigs(mockCharts, mockOverviewCards);

      expect(mockSupabaseService.saveChartConfigs).toHaveBeenCalledWith(mockCharts, mockOverviewCards);
      expect(mockLocalStorageService.saveChartConfigs).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should route to localStorage when not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockLocalStorageService.saveChartConfigs.mockReturnValue(true);

      const result = await saveChartConfigs(mockCharts, mockOverviewCards);

      expect(mockLocalStorageService.saveChartConfigs).toHaveBeenCalledWith(mockCharts, mockOverviewCards);
      expect(mockSupabaseService.saveChartConfigs).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
