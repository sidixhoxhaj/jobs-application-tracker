// Date Formatting Utilities
// Centralized date formatting functions to ensure consistency across the application

/**
 * Format a date as a short string (e.g., "15 Jan")
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  // European-style short format: "15 Jan"
  return dateObj.toLocaleString('en-GB', { day: '2-digit', month: 'short' });
};

/**
 * Format a date as a full string (e.g., "15 January, 2025")
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export const formatDateFull = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  // European full format with comma after month: "15 January, 2025"
  const day = dateObj.toLocaleString('en-GB', { day: '2-digit' });
  const month = dateObj.toLocaleString('en-GB', { month: 'long' });
  const year = dateObj.getFullYear();
  return `${day} ${month}, ${year}`;
};

/**
 * Format a date as ISO 8601 string (e.g., "2025-01-15")
 * This format is required for HTML5 date inputs
 * @param date - Date object or ISO string
 * @returns Formatted date string in YYYY-MM-DD format
 */
export const formatDateISO = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  // ISO 8601 format: YYYY-MM-DD
  return dateObj.toISOString().split('T')[0];
};

/**
 * Format a date with time (e.g., "15 Jan, 2025 at 13:45")
 * Uses 24-hour time and en-GB date ordering.
 * @param date - Date object or ISO string
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  // Desired format: "15 Jan, 2025 at 13:45" (24-hour time)
  const datePart = dateObj.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  // toLocaleString may produce "15 Jan 2025" — insert comma after month
  const datePartWithComma = datePart.replace(/(\d{2})\s([A-Za-z]{3})\s(\d{4})/, '$1 $2, $3');
  const timePart = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${datePartWithComma} at ${timePart}`;
};

/**
 * Format a date as relative time (e.g., "2 days ago", "yesterday", "today")
 * @param date - Date object or ISO string
 * @returns Relative time string
 */
export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes === 0) return 'just now';
      if (diffMinutes === 1) return '1 minute ago';
      return `${diffMinutes} minutes ago`;
    }
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  }

  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  const years = Math.floor(diffDays / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
};

/**
 * Format a date for display in tables/lists (e.g., "15/01/2025")
 * @param date - Date object or ISO string
 * @returns Formatted date string in DD/MM/YYYY format
 */
export const formatDateDisplay = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  // European numeric display: DD/MM/YYYY
  return dateObj.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\u200E/g, '');
};

/**
 * Format month and year (e.g., "January 2025")
 * @param date - Date object or ISO string
 * @returns Formatted month and year string
 */
export const formatMonthYear = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleString('en-GB', {
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Format short month and year (e.g., "Jan 2025")
 * @param date - Date object or ISO string
 * @returns Formatted month and year string
 */
export const formatMonthYearShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleString('en-GB', {
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Check if a date string is valid
 * @param dateString - Date string to validate
 * @returns True if valid date, false otherwise
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Parse a date value (handles both Date objects and strings)
 * @param date - Date object, ISO string, or null/undefined
 * @returns Date object or null if invalid
 */
export const parseDate = (date: Date | string | null | undefined): Date | null => {
  if (!date) return null;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isNaN(dateObj.getTime()) ? null : dateObj;
};
