// Tests for date utility functions
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatDateShort,
  formatDateFull,
  formatDateISO,
  formatDateTime,
  formatRelativeDate,
  formatDateDisplay,
  formatMonthYear,
  formatMonthYearShort,
  isValidDate,
  parseDate,
} from './date';

describe('date utilities', () => {
  const testDate = new Date('2025-01-15T13:45:00Z');
  const testDateString = '2025-01-15T13:45:00Z';

  describe('formatDateShort', () => {
    it('should format date as short string', () => {
      const result = formatDateShort(testDate);
      expect(result).toBe('15 Jan');
    });

    it('should handle string input', () => {
      const result = formatDateShort(testDateString);
      expect(result).toBe('15 Jan');
    });

    it('should return empty string for invalid date', () => {
      const result = formatDateShort('invalid');
      expect(result).toBe('');
    });
  });

  describe('formatDateFull', () => {
    it('should format date as full string', () => {
      const result = formatDateFull(testDate);
      expect(result).toBe('15 January, 2025');
    });

    it('should handle string input', () => {
      const result = formatDateFull(testDateString);
      expect(result).toBe('15 January, 2025');
    });

    it('should return empty string for invalid date', () => {
      const result = formatDateFull('invalid');
      expect(result).toBe('');
    });
  });

  describe('formatDateISO', () => {
    it('should format date as ISO string', () => {
      const result = formatDateISO(testDate);
      expect(result).toBe('2025-01-15');
    });

    it('should handle string input', () => {
      const result = formatDateISO(testDateString);
      expect(result).toBe('2025-01-15');
    });

    it('should return empty string for invalid date', () => {
      const result = formatDateISO('invalid');
      expect(result).toBe('');
    });

    it('should work for date input values', () => {
      const localDate = new Date(2025, 0, 15); // Month is 0-indexed
      const result = formatDateISO(localDate);
      // Result may vary by timezone, just check it's valid ISO format
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result).toContain('2025-01');
    });
  });

  describe('formatDateTime', () => {
    it('should format date with time', () => {
      const result = formatDateTime(testDate);
      // Result will depend on timezone, but should contain date and time
      expect(result).toContain('Jan');
      expect(result).toContain('2025');
      expect(result).toContain('at');
      expect(result).toMatch(/\d{2}:\d{2}/); // HH:MM format
    });

    it('should handle string input', () => {
      const result = formatDateTime(testDateString);
      expect(result).toContain('at');
    });

    it('should return empty string for invalid date', () => {
      const result = formatDateTime('invalid');
      expect(result).toBe('');
    });
  });

  describe('formatRelativeDate', () => {
    beforeEach(() => {
      // Mock current time for consistent tests
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-20T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "just now" for current time', () => {
      const now = new Date('2025-01-20T12:00:00Z');
      const result = formatRelativeDate(now);
      expect(result).toBe('just now');
    });

    it('should return minutes ago', () => {
      const date = new Date('2025-01-20T11:45:00Z');
      const result = formatRelativeDate(date);
      expect(result).toBe('15 minutes ago');
    });

    it('should return hours ago', () => {
      const date = new Date('2025-01-20T10:00:00Z');
      const result = formatRelativeDate(date);
      expect(result).toBe('2 hours ago');
    });

    it('should return "yesterday" for 1 day ago', () => {
      const date = new Date('2025-01-19T12:00:00Z');
      const result = formatRelativeDate(date);
      expect(result).toBe('yesterday');
    });

    it('should return days ago for recent dates', () => {
      const date = new Date('2025-01-17T12:00:00Z');
      const result = formatRelativeDate(date);
      expect(result).toBe('3 days ago');
    });

    it('should return weeks ago', () => {
      const date = new Date('2025-01-06T12:00:00Z');
      const result = formatRelativeDate(date);
      expect(result).toBe('2 weeks ago');
    });

    it('should return months ago', () => {
      const date = new Date('2024-11-20T12:00:00Z');
      const result = formatRelativeDate(date);
      expect(result).toBe('2 months ago');
    });

    it('should return years ago', () => {
      const date = new Date('2023-01-20T12:00:00Z');
      const result = formatRelativeDate(date);
      expect(result).toBe('2 years ago');
    });

    it('should return empty string for invalid date', () => {
      const result = formatRelativeDate('invalid');
      expect(result).toBe('');
    });
  });

  describe('formatDateDisplay', () => {
    it('should format date as DD/MM/YYYY', () => {
      const result = formatDateDisplay(testDate);
      expect(result).toBe('15/01/2025');
    });

    it('should handle string input', () => {
      const result = formatDateDisplay(testDateString);
      expect(result).toBe('15/01/2025');
    });

    it('should return empty string for invalid date', () => {
      const result = formatDateDisplay('invalid');
      expect(result).toBe('');
    });
  });

  describe('formatMonthYear', () => {
    it('should format month and year', () => {
      const result = formatMonthYear(testDate);
      expect(result).toBe('January 2025');
    });

    it('should handle string input', () => {
      const result = formatMonthYear(testDateString);
      expect(result).toBe('January 2025');
    });

    it('should return empty string for invalid date', () => {
      const result = formatMonthYear('invalid');
      expect(result).toBe('');
    });
  });

  describe('formatMonthYearShort', () => {
    it('should format short month and year', () => {
      const result = formatMonthYearShort(testDate);
      expect(result).toBe('Jan 2025');
    });

    it('should handle string input', () => {
      const result = formatMonthYearShort(testDateString);
      expect(result).toBe('Jan 2025');
    });

    it('should return empty string for invalid date', () => {
      const result = formatMonthYearShort('invalid');
      expect(result).toBe('');
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date strings', () => {
      expect(isValidDate('2025-01-15')).toBe(true);
      expect(isValidDate('2025-01-15T13:45:00Z')).toBe(true);
      expect(isValidDate('01/15/2025')).toBe(true);
    });

    it('should return false for invalid date strings', () => {
      expect(isValidDate('invalid')).toBe(false);
      expect(isValidDate('2025-13-45')).toBe(false);
      expect(isValidDate('')).toBe(false);
    });
  });

  describe('parseDate', () => {
    it('should parse valid date strings', () => {
      const result = parseDate('2025-01-15');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2025);
      expect(result?.getMonth()).toBe(0); // January is 0
      expect(result?.getDate()).toBe(15);
    });

    it('should handle Date objects', () => {
      const result = parseDate(testDate);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(testDate.getTime());
    });

    it('should return null for invalid dates', () => {
      expect(parseDate('invalid')).toBeNull();
    });

    it('should return null for null/undefined', () => {
      expect(parseDate(null)).toBeNull();
      expect(parseDate(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(parseDate('')).toBeNull();
    });
  });
});
