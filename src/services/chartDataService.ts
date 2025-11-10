// Chart Data Service
// Dynamic data aggregation for custom field charts

import {
  Application,
  CustomField,
  ChartDataPoint,
  PieChartDataPoint,
  AggregationType,
} from '../types';
import { parseDate, formatDateISO, formatMonthYearShort, formatDateDisplay } from '../utils/date';

// Helper: Find a custom field by ID
function findField(fields: CustomField[], fieldId: string): CustomField | undefined {
  return fields.find((f) => f.id === fieldId);
}

// Helper: Get field value from application
function getFieldValue(application: Application, fieldId: string): any {
  return application.data?.[fieldId];
}

// Helper: Check if value is numeric
function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Aggregate data by day for a specific field
 * For 'applications-count': counts applications per day
 * For custom fields: counts or sums field values per day
 */
export function aggregateByDay(
  applications: Application[],
  customFields: CustomField[],
  fieldId: string | 'applications-count',
  dateRange?: { startDate: Date; endDate: Date }
): ChartDataPoint[] {
  const dataMap = new Map<string, { value: number; applications: Application[] }>();

  applications.forEach((app) => {
    let date: Date | null = null;

    // Get the date for this application
    const applicationDateField = customFields.find(
      (f) =>
        f.name.toLowerCase() === 'application date' ||
        f.name.toLowerCase() === 'date applied' ||
        f.type === 'date'
    );

    if (applicationDateField) {
      date = parseDate(getFieldValue(app, applicationDateField.id));
    }

    // Fallback to createdAt if no date field found
    if (!date && app.createdAt) {
      date = parseDate(app.createdAt);
    }

    if (!date) return;

    // Apply date range filter
    if (dateRange) {
      if (date < dateRange.startDate || date > dateRange.endDate) {
        return;
      }
    }

    const dateKey = formatDateISO(date);

    if (fieldId === 'applications-count') {
      // Count applications
      const existing = dataMap.get(dateKey) || { value: 0, applications: [] };
      existing.value += 1;
      existing.applications.push(app);
      dataMap.set(dateKey, existing);
    } else {
      // Aggregate by custom field
      const field = findField(customFields, fieldId);
      if (!field) return;

      const fieldValue = getFieldValue(app, fieldId);
      if (fieldValue === undefined || fieldValue === null || fieldValue === '') return;

      const existing = dataMap.get(dateKey) || { value: 0, applications: [] };

      // For number fields, sum the values
      if (field.type === 'number' && isNumeric(fieldValue)) {
        existing.value += parseFloat(fieldValue);
      } else {
        // For other types, count occurrences
        existing.value += 1;
      }

      existing.applications.push(app);
      dataMap.set(dateKey, existing);
    }
  });

  // Convert map to array and sort by date
  const result: ChartDataPoint[] = [];
  dataMap.forEach((data, dateKey) => {
    result.push({
      label: dateKey,
      value: data.value,
      date: new Date(dateKey),
      applications: data.applications,
    });
  });

  return result.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return a.date.getTime() - b.date.getTime();
  });
}

/**
 * Aggregate data by month for a specific field
 */
export function aggregateByMonth(
  applications: Application[],
  customFields: CustomField[],
  fieldId: string | 'applications-count',
  monthCount: number = 6
): ChartDataPoint[] {
  const dataMap = new Map<string, { value: number; date: Date; applications: Application[] }>();

  applications.forEach((app) => {
    let date: Date | null = null;

    // Get the date for this application
    const applicationDateField = customFields.find(
      (f) =>
        f.name.toLowerCase() === 'application date' ||
        f.name.toLowerCase() === 'date applied' ||
        f.type === 'date'
    );

    if (applicationDateField) {
      date = parseDate(getFieldValue(app, applicationDateField.id));
    }

    // Fallback to createdAt if no date field found
    if (!date && app.createdAt) {
      date = parseDate(app.createdAt);
    }

    if (!date) return;

    const monthKey = formatMonthYearShort(date);

    if (fieldId === 'applications-count') {
      // Count applications
      const existing = dataMap.get(monthKey) || { value: 0, date, applications: [] };
      existing.value += 1;
      existing.applications.push(app);
      dataMap.set(monthKey, existing);
    } else {
      // Aggregate by custom field
      const field = findField(customFields, fieldId);
      if (!field) return;

      const fieldValue = getFieldValue(app, fieldId);
      if (fieldValue === undefined || fieldValue === null || fieldValue === '') return;

      const existing = dataMap.get(monthKey) || { value: 0, date, applications: [] };

      // For number fields, sum the values
      if (field.type === 'number' && isNumeric(fieldValue)) {
        existing.value += parseFloat(fieldValue);
      } else {
        // For other types, count occurrences
        existing.value += 1;
      }

      existing.applications.push(app);
      dataMap.set(monthKey, existing);
    }
  });

  // Convert map to array and sort by date
  const result: ChartDataPoint[] = [];
  dataMap.forEach((data, monthKey) => {
    result.push({
      label: monthKey,
      value: data.value,
      date: data.date,
      applications: data.applications,
    });
  });

  // Sort by date and take last N months
  const sorted = result.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return a.date.getTime() - b.date.getTime();
  });

  return sorted.slice(-monthCount);
}

/**
 * Aggregate data by unique values (for pie charts)
 */
export function aggregateByValue(
  applications: Application[],
  customFields: CustomField[],
  fieldId: string
): PieChartDataPoint[] {
  const field = findField(customFields, fieldId);
  if (!field) return [];

  const dataMap = new Map<string, { count: number; color?: string }>();
  let total = 0;

  applications.forEach((app) => {
    const fieldValue = getFieldValue(app, fieldId);
    if (fieldValue === undefined || fieldValue === null || fieldValue === '') return;

    let label: string;
    let color: string | undefined;

    // For select fields, use option labels and colors
    if (field.type === 'select' && field.options) {
      const option = field.options.find((opt) => opt.value === fieldValue);
      label = option?.label || String(fieldValue);
      color = option?.color;
    } else if (field.type === 'checkbox') {
      label = fieldValue ? 'Yes' : 'No';
    } else {
      label = String(fieldValue);
    }

    const existing = dataMap.get(label) || { count: 0, color };
    existing.count += 1;
    dataMap.set(label, existing);
    total += 1;
  });

  // Convert map to array with percentages
  const result: PieChartDataPoint[] = [];
  dataMap.forEach((data, label) => {
    result.push({
      label,
      value: data.count,
      color: data.color,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
    });
  });

  // Sort by value descending
  return result.sort((a, b) => b.value - a.value);
}

/**
 * Calculate aggregate for a specific field
 */
export function calculateFieldAggregate(
  applications: Application[],
  customFields: CustomField[],
  fieldId: string,
  aggregationType: AggregationType
): number | string {
  const field = findField(customFields, fieldId);
  if (!field) return 'N/A';

  const values: any[] = [];

  applications.forEach((app) => {
    const fieldValue = getFieldValue(app, fieldId);
    if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
      values.push(fieldValue);
    }
  });

  if (values.length === 0) return 0;

  switch (aggregationType) {
    case 'count':
      return values.length;

    case 'sum': {
      if (field.type !== 'number') return 'N/A';
      const numericValues = values.filter(isNumeric).map((v) => parseFloat(v));
      return numericValues.reduce((sum, val) => sum + val, 0);
    }

    case 'avg': {
      if (field.type !== 'number') return 'N/A';
      const numericValues = values.filter(isNumeric).map((v) => parseFloat(v));
      if (numericValues.length === 0) return 0;
      const sum = numericValues.reduce((sum, val) => sum + val, 0);
      return Math.round(sum / numericValues.length);
    }

    case 'min': {
      if (field.type === 'number') {
        const numericValues = values.filter(isNumeric).map((v) => parseFloat(v));
        if (numericValues.length === 0) return 0;
        return Math.min(...numericValues);
      } else if (field.type === 'date') {
        const dates = values.map(parseDate).filter((d) => d !== null) as Date[];
        if (dates.length === 0) return 'N/A';
        const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
        return formatDateDisplay(minDate);
      }
      return 'N/A';
    }

    case 'max': {
      if (field.type === 'number') {
        const numericValues = values.filter(isNumeric).map((v) => parseFloat(v));
        if (numericValues.length === 0) return 0;
        return Math.max(...numericValues);
      } else if (field.type === 'date') {
        const dates = values.map(parseDate).filter((d) => d !== null) as Date[];
        if (dates.length === 0) return 'N/A';
        const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
        return formatDateDisplay(maxDate);
      }
      return 'N/A';
    }

    default:
      return 'N/A';
  }
}

/**
 * Get recommended chart types for a field
 */
export function getRecommendedChartTypes(field: CustomField): string[] {
  switch (field.type) {
    case 'number':
      return ['line', 'bar', 'area'];
    case 'select':
      return ['pie', 'bar'];
    case 'date':
      return ['line', 'bar'];
    case 'checkbox':
      return ['pie', 'bar'];
    case 'text':
    case 'textarea':
      return ['bar']; // Can count occurrences
    default:
      return ['bar'];
  }
}

/**
 * Get recommended aggregation types for a field
 */
export function getRecommendedAggregations(field: CustomField): AggregationType[] {
  switch (field.type) {
    case 'number':
      return ['count', 'sum', 'avg', 'min', 'max'];
    case 'date':
      return ['count', 'min', 'max'];
    default:
      return ['count'];
  }
}
