// Statistics Service
// Provides calculation functions for analytics and statistics dashboard

import { Application } from '../types/application';
import { CustomField, FieldOption } from '../types/customField';
import { parseDate, formatDateISO, formatMonthYearShort } from '../utils/date';

// Date range interface
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Chart data interfaces
export interface DayData {
  date: string; // YYYY-MM-DD format
  count: number;
  applications?: Application[]; // Include applications for drill-down
}

export interface MonthData {
  month: string; // YYYY-MM format
  monthLabel: string; // "Jan 2025" format
  count: number;
}

export interface StatusData {
  status: string;
  label: string;
  count: number;
  percentage: number;
  color?: string;
}

// Helper: Find a custom field by type or name pattern
const findField = (fields: CustomField[], searchFn: (field: CustomField) => boolean): CustomField | undefined => {
  return fields.find(searchFn);
};

// Helper: Get field value from application data
const getFieldValue = (application: Application, fieldId: string): any => {
  return application.data[fieldId];
};

// Helper: Get difference in days between two dates
const getDaysDifference = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper: Check if date is within range
const isDateInRange = (date: Date, range: DateRange): boolean => {
  return date >= range.startDate && date <= range.endDate;
};

/**
 * Calculate total number of applications
 */
export const calculateTotalApplications = (applications: Application[]): number => {
  return applications.length;
};

/**
 * Calculate total number of responses (applications with first response date)
 */
export const calculateTotalResponses = (
  applications: Application[],
  customFields: CustomField[]
): number => {
  // Find the "First Response Date" field
  const responseField = findField(
    customFields,
    (field) => field.type === 'date' && field.name.toLowerCase().includes('response')
  );

  if (!responseField) return 0;

  // Count applications that have a response date value
  return applications.filter((app) => {
    const responseDate = getFieldValue(app, responseField.id);
    return responseDate && responseDate.trim() !== '';
  }).length;
};

/**
 * Calculate response rate as percentage
 */
export const calculateResponseRate = (
  applications: Application[],
  customFields: CustomField[]
): number => {
  const total = calculateTotalApplications(applications);
  if (total === 0) return 0;

  const responses = calculateTotalResponses(applications, customFields);
  return Math.round((responses / total) * 100);
};

/**
 * Calculate average response time in days
 */
export const calculateAverageResponseTime = (
  applications: Application[],
  customFields: CustomField[]
): number => {
  // Find application date and response date fields
  const appDateField = findField(
    customFields,
    (field) => field.type === 'date' && field.name.toLowerCase().includes('application')
  );

  const responseField = findField(
    customFields,
    (field) => field.type === 'date' && field.name.toLowerCase().includes('response')
  );

  if (!appDateField || !responseField) return 0;

  // Calculate response times for applications that have both dates
  const responseTimes: number[] = [];

  applications.forEach((app) => {
    const appDateStr = getFieldValue(app, appDateField.id);
    const responseDateStr = getFieldValue(app, responseField.id);

    if (!appDateStr || !responseDateStr) return;

    const appDate = parseDate(appDateStr);
    const responseDate = parseDate(responseDateStr);

    if (appDate && responseDate && responseDate >= appDate) {
      const days = getDaysDifference(appDate, responseDate);
      responseTimes.push(days);
    }
  });

  if (responseTimes.length === 0) return 0;

  const sum = responseTimes.reduce((acc, time) => acc + time, 0);
  return Math.round(sum / responseTimes.length);
};

/**
 * Get applications per day within a date range
 */
export const getApplicationsPerDay = (
  applications: Application[],
  customFields: CustomField[],
  dateRange?: DateRange
): DayData[] => {
  // Find application date field
  const appDateField = findField(
    customFields,
    (field) => field.type === 'date' && field.name.toLowerCase().includes('application')
  );

  if (!appDateField) return [];

  // Group applications by date
  const dayMap = new Map<string, Application[]>();

  applications.forEach((app) => {
    const dateStr = getFieldValue(app, appDateField.id);
    if (!dateStr) return;

    const date = parseDate(dateStr);
    if (!date) return;

    // Check date range if provided
    if (dateRange && !isDateInRange(date, dateRange)) return;

    const dateKey = formatDateISO(date);
    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, []);
    }
    dayMap.get(dateKey)!.push(app);
  });

  // Convert map to array and sort by date
  const dayData: DayData[] = Array.from(dayMap.entries())
    .map(([date, apps]) => ({
      date,
      count: apps.length,
      applications: apps,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return dayData;
};

/**
 * Get responses per day within a date range
 */
export const getResponsesPerDay = (
  applications: Application[],
  customFields: CustomField[],
  dateRange?: DateRange
): DayData[] => {
  // Find response date field
  const responseField = findField(
    customFields,
    (field) => field.type === 'date' && field.name.toLowerCase().includes('response')
  );

  if (!responseField) return [];

  // Group responses by date
  const dayMap = new Map<string, Application[]>();

  applications.forEach((app) => {
    const dateStr = getFieldValue(app, responseField.id);
    if (!dateStr || dateStr.trim() === '') return;

    const date = parseDate(dateStr);
    if (!date) return;

    // Check date range if provided
    if (dateRange && !isDateInRange(date, dateRange)) return;

    const dateKey = formatDateISO(date);
    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, []);
    }
    dayMap.get(dateKey)!.push(app);
  });

  // Convert map to array and sort by date
  const dayData: DayData[] = Array.from(dayMap.entries())
    .map(([date, apps]) => ({
      date,
      count: apps.length,
      applications: apps,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return dayData;
};

/**
 * Get applications per month (last 12 months by default)
 */
export const getApplicationsPerMonth = (
  applications: Application[],
  customFields: CustomField[],
  monthCount: number = 12
): MonthData[] => {
  // Find application date field
  const appDateField = findField(
    customFields,
    (field) => field.type === 'date' && field.name.toLowerCase().includes('application')
  );

  if (!appDateField) return [];

  // Group applications by month
  const monthMap = new Map<string, number>();

  applications.forEach((app) => {
    const dateStr = getFieldValue(app, appDateField.id);
    if (!dateStr) return;

    const date = parseDate(dateStr);
    if (!date) return;

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
  });

  // Generate last N months
  const today = new Date();
  const monthData: MonthData[] = [];

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const count = monthMap.get(monthKey) || 0;

    monthData.push({
      month: monthKey,
      monthLabel: formatMonthYearShort(date),
      count,
    });
  }

  return monthData;
};

/**
 * Get responses per month (last 12 months by default)
 */
export const getResponsesPerMonth = (
  applications: Application[],
  customFields: CustomField[],
  monthCount: number = 12
): MonthData[] => {
  // Find response date field
  const responseField = findField(
    customFields,
    (field) => field.type === 'date' && field.name.toLowerCase().includes('response')
  );

  if (!responseField) return [];

  // Group responses by month
  const monthMap = new Map<string, number>();

  applications.forEach((app) => {
    const dateStr = getFieldValue(app, responseField.id);
    if (!dateStr || dateStr.trim() === '') return;

    const date = parseDate(dateStr);
    if (!date) return;

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
  });

  // Generate last N months
  const today = new Date();
  const monthData: MonthData[] = [];

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const count = monthMap.get(monthKey) || 0;

    monthData.push({
      month: monthKey,
      monthLabel: formatMonthYearShort(date),
      count,
    });
  }

  return monthData;
};

/**
 * Get status breakdown (count and percentage per status)
 */
export const getStatusBreakdown = (
  applications: Application[],
  customFields: CustomField[]
): StatusData[] => {
  // Find status field
  const statusField = findField(
    customFields,
    (field) => field.type === 'select' && field.name.toLowerCase().includes('status')
  );

  if (!statusField || !statusField.options) return [];

  const total = applications.length;
  if (total === 0) return [];

  // Count applications per status
  const statusMap = new Map<string, number>();

  applications.forEach((app) => {
    const statusValue = getFieldValue(app, statusField.id);
    if (statusValue) {
      statusMap.set(statusValue, (statusMap.get(statusValue) || 0) + 1);
    }
  });

  // Build status data with labels and colors from options
  const statusData: StatusData[] = statusField.options.map((option: FieldOption) => {
    const count = statusMap.get(option.value) || 0;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return {
      status: option.value,
      label: option.label,
      count,
      percentage,
      color: option.color,
    };
  });

  // Filter out statuses with 0 count and sort by count (descending)
  return statusData.filter((s) => s.count > 0).sort((a, b) => b.count - a.count);
};

/**
 * Create a date range for common presets
 */
export const createDateRange = (preset: 'last7' | 'last30' | 'last90' | 'all'): DateRange | undefined => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today

  if (preset === 'all') {
    return undefined; // No date range filter
  }

  const daysMap = {
    last7: 7,
    last30: 30,
    last90: 90,
  };

  const days = daysMap[preset];
  const startDate = new Date();
  startDate.setDate(today.getDate() - days + 1); // Include today
  startDate.setHours(0, 0, 0, 0); // Start of day

  return {
    startDate,
    endDate: today,
  };
};
