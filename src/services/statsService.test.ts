// Tests for statsService
import { describe, it, expect } from 'vitest';
import {
  calculateTotalApplications,
  calculateTotalResponses,
  calculateResponseRate,
  calculateAverageResponseTime,
  getApplicationsPerDay,
  getStatusBreakdown,
} from './statsService';
import type { Application, CustomField } from '../types';

describe('statsService', () => {
  const mockCustomFields: CustomField[] = [
    {
      id: 'companyName',
      name: 'Company Name',
      type: 'text',
      required: true,
      order: 1,
      showInTable: true,
    },
    {
      id: 'applicationDate',
      name: 'Application Date',
      type: 'date',
      required: true,
      order: 2,
      showInTable: true,
    },
    {
      id: 'responseDate',
      name: 'First Response Date',
      type: 'date',
      required: false,
      order: 3,
      showInTable: true,
    },
    {
      id: 'status',
      name: 'Status',
      type: 'select',
      required: true,
      order: 4,
      showInTable: true,
      options: [
        { value: 'applied', label: 'Applied', color: '#0070F3' },
        { value: 'rejected', label: 'Rejected', color: '#E00' },
      ],
    },
  ];

  const mockApplications: Application[] = [
    {
      id: '1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      data: {
        companyName: 'Company A',
        applicationDate: '2024-01-15',
        responseDate: '2024-01-20',
        status: 'applied',
      },
      notes: [],
    },
    {
      id: '2',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      data: {
        companyName: 'Company B',
        applicationDate: '2024-01-15',
        responseDate: '',
        status: 'applied',
      },
      notes: [],
    },
    {
      id: '3',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
      data: {
        companyName: 'Company C',
        applicationDate: '2024-01-16',
        responseDate: '2024-01-25',
        status: 'rejected',
      },
      notes: [],
    },
  ];

  describe('calculateTotalApplications', () => {
    it('should return correct total count', () => {
      expect(calculateTotalApplications(mockApplications)).toBe(3);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalApplications([])).toBe(0);
    });
  });

  describe('calculateTotalResponses', () => {
    it('should count applications with response dates', () => {
      const result = calculateTotalResponses(mockApplications, mockCustomFields);
      expect(result).toBe(2); // Two apps have responseDate filled
    });

    it('should return 0 when response field not found', () => {
      const fieldsWithoutResponse = mockCustomFields.filter((f) => f.id !== 'responseDate');
      const result = calculateTotalResponses(mockApplications, fieldsWithoutResponse);
      expect(result).toBe(0);
    });

    it('should return 0 for empty applications', () => {
      const result = calculateTotalResponses([], mockCustomFields);
      expect(result).toBe(0);
    });
  });

  describe('calculateResponseRate', () => {
    it('should calculate correct percentage', () => {
      const result = calculateResponseRate(mockApplications, mockCustomFields);
      expect(result).toBe(67); // 2 out of 3 = 66.67% rounded to 67
    });

    it('should return 0 for empty applications', () => {
      const result = calculateResponseRate([], mockCustomFields);
      expect(result).toBe(0);
    });

    it('should return 0 when no response field exists', () => {
      const fieldsWithoutResponse = mockCustomFields.filter((f) => f.id !== 'responseDate');
      const result = calculateResponseRate(mockApplications, fieldsWithoutResponse);
      expect(result).toBe(0);
    });
  });

  describe('calculateAverageResponseTime', () => {
    it('should calculate average response time in days', () => {
      const result = calculateAverageResponseTime(mockApplications, mockCustomFields);
      // App 1: Jan 15 -> Jan 20 = 5 days
      // App 2: No response date
      // App 3: Jan 16 -> Jan 25 = 9 days
      // Average: (5 + 9) / 2 = 7 days
      expect(result).toBe(7);
    });

    it('should return 0 when no responses', () => {
      const appsWithoutResponses = mockApplications.map((app) => ({
        ...app,
        data: { ...app.data, responseDate: '' },
      }));
      const result = calculateAverageResponseTime(appsWithoutResponses, mockCustomFields);
      expect(result).toBe(0);
    });

    it('should return 0 when required fields not found', () => {
      const fieldsWithoutDates = mockCustomFields.filter(
        (f) => f.id !== 'applicationDate' && f.id !== 'responseDate'
      );
      const result = calculateAverageResponseTime(mockApplications, fieldsWithoutDates);
      expect(result).toBe(0);
    });

    it('should ignore invalid date pairs', () => {
      const appsWithInvalidDates: Application[] = [
        {
          id: '1',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          data: {
            applicationDate: '2024-01-20',
            responseDate: '2024-01-15', // Response before application
          },
          notes: [],
        },
      ];
      const result = calculateAverageResponseTime(appsWithInvalidDates, mockCustomFields);
      expect(result).toBe(0);
    });
  });

  describe('getApplicationsPerDay', () => {
    it('should group applications by date', () => {
      const result = getApplicationsPerDay(mockApplications, mockCustomFields);
      expect(result.length).toBe(2); // Jan 15 and Jan 16
      expect(result[0].date).toBe('2024-01-15');
      expect(result[0].count).toBe(2); // Two apps on Jan 15
      expect(result[1].date).toBe('2024-01-16');
      expect(result[1].count).toBe(1); // One app on Jan 16
    });

    it('should return empty array when no application date field', () => {
      const fieldsWithoutAppDate = mockCustomFields.filter((f) => f.id !== 'applicationDate');
      const result = getApplicationsPerDay(mockApplications, fieldsWithoutAppDate);
      expect(result).toEqual([]);
    });

    it('should filter by date range', () => {
      const dateRange = {
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-15'),
      };
      const result = getApplicationsPerDay(mockApplications, mockCustomFields, dateRange);
      expect(result.length).toBe(1);
      expect(result[0].date).toBe('2024-01-15');
      expect(result[0].count).toBe(2);
    });

    it('should sort results by date', () => {
      const result = getApplicationsPerDay(mockApplications, mockCustomFields);
      expect(result[0].date.localeCompare(result[1].date)).toBeLessThan(0);
    });
  });

  describe('getStatusBreakdown', () => {
    it('should group applications by status', () => {
      const result = getStatusBreakdown(mockApplications, mockCustomFields);
      expect(result.length).toBe(2); // 'applied' and 'rejected'

      const appliedStatus = result.find((s) => s.status === 'applied');
      expect(appliedStatus?.count).toBe(2);
      expect(appliedStatus?.percentage).toBe(67); // 2/3 = 66.67% rounded to 67

      const rejectedStatus = result.find((s) => s.status === 'rejected');
      expect(rejectedStatus?.count).toBe(1);
      expect(rejectedStatus?.percentage).toBe(33); // 1/3 = 33.33% rounded to 33
    });

    it('should include color from field options', () => {
      const result = getStatusBreakdown(mockApplications, mockCustomFields);
      const appliedStatus = result.find((s) => s.status === 'applied');
      expect(appliedStatus?.color).toBe('#0070F3');
    });

    it('should return empty array when no status field', () => {
      const fieldsWithoutStatus = mockCustomFields.filter((f) => f.id !== 'status');
      const result = getStatusBreakdown(mockApplications, fieldsWithoutStatus);
      expect(result).toEqual([]);
    });

    it('should return empty array for empty applications', () => {
      const result = getStatusBreakdown([], mockCustomFields);
      expect(result).toEqual([]);
    });

    it('should handle applications without status value', () => {
      const appsWithMissingStatus: Application[] = [
        ...mockApplications,
        {
          id: '4',
          createdAt: '2024-01-04T00:00:00Z',
          updatedAt: '2024-01-04T00:00:00Z',
          data: {
            companyName: 'Company D',
            applicationDate: '2024-01-17',
          },
          notes: [],
        },
      ];
      const result = getStatusBreakdown(appsWithMissingStatus, mockCustomFields);
      // Should still work with 3 apps (the 4th has no status)
      const total = result.reduce((sum, s) => sum + s.count, 0);
      expect(total).toBe(3);
    });
  });
});
