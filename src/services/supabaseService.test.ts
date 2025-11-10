import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadApplications,
  saveApplication,
  updateApplication,
  deleteApplication,
  loadCustomFields,
  saveCustomFields,
  loadPreferences,
  savePreferences,
  loadChartConfigs,
  saveChartConfigs,
} from './supabaseService';
import { supabase } from '../lib/supabase';
import type { Application, CustomField, UserPreference, ChartConfig, OverviewCardConfig } from '../types';

// Mock the supabase client
const mockSupabase = vi.mocked(supabase);

describe('supabaseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadApplications', () => {
    it('should load applications successfully', async () => {
      const mockUser = { id: 'user-123' };
      const mockApps = [
        {
          id: 'app-1',
          user_id: 'user-123',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          data: { companyName: 'Test Company' },
        },
      ];
      const mockNotes = [
        {
          id: 'note-1',
          application_id: 'app-1',
          user_id: 'user-123',
          content: 'Test note',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'applications') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: mockApps, error: null }),
          };
        }
        if (table === 'notes') {
          return {
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: mockNotes, error: null }),
          };
        }
        return {};
      });

      const result = await loadApplications();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'app-1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        data: { companyName: 'Test Company' },
        notes: [
          {
            id: 'note-1',
            content: 'Test note',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      });
    });

    it('should throw error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      await expect(loadApplications()).rejects.toThrow('User not authenticated');
    });

    it('should handle applications without notes', async () => {
      const mockUser = { id: 'user-123' };
      const mockApps = [
        {
          id: 'app-1',
          user_id: 'user-123',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          data: { companyName: 'Test Company' },
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'applications') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: mockApps, error: null }),
          };
        }
        if (table === 'notes') {
          return {
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: null, error: new Error('Notes error') }),
          };
        }
        return {};
      });

      const result = await loadApplications();

      expect(result).toHaveLength(1);
      expect(result[0].notes).toEqual([]);
    });
  });

  describe('saveApplication', () => {
    it('should save new application successfully', async () => {
      const mockUser = { id: 'user-123' };
      const application: Application = {
        id: 'app-1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        data: { companyName: 'Test Company' },
        notes: [],
      };
      const mockSavedApp = {
        id: 'app-1',
        user_id: 'user-123',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        data: { companyName: 'Test Company' },
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'applications') {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockResolvedValue({ data: [mockSavedApp], error: null }),
          };
        }
        return {};
      });

      const result = await saveApplication(application);

      expect(result).toEqual(application);
      expect(mockSupabase.from).toHaveBeenCalledWith('applications');
    });

    it('should throw error when user is not authenticated', async () => {
      const application: Application = {
        id: 'app-1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        data: {},
        notes: [],
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      await expect(saveApplication(application)).rejects.toThrow('User not authenticated');
    });
  });

  describe('updateApplication', () => {
    it('should update application successfully', async () => {
      const mockUser = { id: 'user-123' };
      const application: Application = {
        id: 'app-1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        data: { companyName: 'Updated Company' },
        notes: [],
      };
      const mockUpdatedApp = {
        id: 'app-1',
        user_id: 'user-123',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        data: { companyName: 'Updated Company' },
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'applications') {
          return {
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            select: vi.fn().mockResolvedValue({ data: [mockUpdatedApp], error: null }),
          };
        }
        return {};
      });

      const result = await updateApplication(application);

      expect(result).toEqual(application);
    });
  });

  describe('deleteApplication', () => {
    it('should delete application successfully', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'applications') {
          return {
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        return {};
      });

      await expect(deleteApplication('app-1')).resolves.toBeUndefined();
    });
  });

  describe('loadCustomFields', () => {
    it('should load custom fields successfully', async () => {
      const mockUser = { id: 'user-123' };
      const mockFields = [
        {
          id: 'field-1',
          user_id: 'user-123',
          name: 'Priority',
          type: 'select',
          options: ['High', 'Medium', 'Low'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'custom_fields') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: mockFields, error: null }),
          };
        }
        return {};
      });

      const result = await loadCustomFields();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'field-1',
        name: 'Priority',
        type: 'select',
        required: false,
        order: 1,
        showInTable: false,
        options: [
          { value: 'High', label: 'High' },
          { value: 'Medium', label: 'Medium' },
          { value: 'Low', label: 'Low' },
        ],
      });
    });
  });

  describe('saveCustomFields', () => {
    it('should save custom fields successfully', async () => {
      const mockUser = { id: 'user-123' };
      const fields: CustomField[] = [
        {
          id: 'field-1',
          name: 'Priority',
          type: 'select',
          required: false,
          order: 1,
          showInTable: true,
          options: [
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ],
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'custom_fields') {
          return {
            upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        return {};
      });

      const result = await saveCustomFields(fields);

      expect(result).toBe(true);
    });
  });

  describe('loadPreferences', () => {
    it('should load user preferences successfully', async () => {
      const mockUser = { id: 'user-123' };
      const mockPrefs = {
        id: 'pref-1',
        user_id: 'user-123',
        theme: 'dark',
        itemsPerPage: 25,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'user_preferences') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [mockPrefs], error: null }),
          };
        }
        return {};
      });

      const result = await loadPreferences();

      expect(result).toEqual({
        theme: 'light',
        defaultPagination: 20,
      });
    });
  });

  describe('savePreferences', () => {
    it('should save user preferences successfully', async () => {
      const mockUser = { id: 'user-123' };
      const preferences: UserPreference = {
        theme: 'dark',
        defaultPagination: 25,
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'user_preferences') {
          return {
            upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        return {};
      });

      const result = await savePreferences(preferences);

      expect(result).toBe(true);
    });
  });

  describe('loadChartConfigs', () => {
    it('should load chart configurations successfully', async () => {
      const mockUser = { id: 'user-123' };
      const mockConfigs = {
        id: 'config-1',
        user_id: 'user-123',
        chart_configs: { applicationsChart: { type: 'bar' } },
        overview_card_configs: { totalApps: { visible: true } },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'chart_configs') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [mockConfigs], error: null }),
          };
        }
        return {};
      });

      const result = await loadChartConfigs();

      expect(result).toEqual({
        charts: [],
        overviewCards: [],
      });
    });
  });

  describe('saveChartConfigs', () => {
    it('should save chart configurations successfully', async () => {
      const mockUser = { id: 'user-123' };
      const chartConfigs: ChartConfig[] = [
        {
          id: 'chart-1',
          title: 'Applications Chart',
          chartType: 'bar',
          groupBy: 'month',
          order: 1,
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];
      const overviewCardConfigs: OverviewCardConfig[] = [
        {
          id: 'card-1',
          title: 'Total Applications',
          dataSource: 'total-applications',
          order: 1,
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'chart_configs') {
          return {
            upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        return {};
      });

      const result = await saveChartConfigs(chartConfigs, overviewCardConfigs);

      expect(result).toBe(true);
    });
  });
});