// Export Service
// Handles exporting data to various formats (CSV, etc.)

import type { Application, CustomField } from '../types';

// Export applications to CSV format
export const exportToCSV = (
  applications: Application[],
  customFields: CustomField[]
): void => {
  try {
    // Create CSV header from custom field names
    const headers = customFields
      .sort((a, b) => a.order - b.order)
      .map(field => field.name);

    // Add ID and timestamp columns
    const csvHeaders = ['ID', 'Created At', 'Updated At', ...headers, 'Notes Count'];

    // Convert applications to CSV rows
    const rows = applications.map(app => {
      const rowData = [
        app.id,
        new Date(app.createdAt).toLocaleString(),
        new Date(app.updatedAt).toLocaleString(),
      ];

      // Add field data in order
      customFields
        .sort((a, b) => a.order - b.order)
        .forEach(field => {
          const value = app.data[field.id];
          // Handle different field types
          if (value === undefined || value === null) {
            rowData.push('');
          } else if (typeof value === 'boolean') {
            rowData.push(value ? 'Yes' : 'No');
          } else if (field.type === 'select' && field.options) {
            // Find label for select fields
            const option = field.options.find(opt => opt.value === value);
            rowData.push(option ? option.label : value);
          } else {
            rowData.push(String(value));
          }
        });

      // Add notes count
      rowData.push(String(app.notes.length));

      return rowData;
    });

    // Escape CSV values (handle commas, quotes, newlines)
    const escapeCsvValue = (value: string): string => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    // Build CSV content
    const csvContent = [
      csvHeaders.map(escapeCsvValue).join(','),
      ...rows.map(row => row.map(escapeCsvValue).join(',')),
    ].join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `job-applications-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    alert('Failed to export data. Please try again.');
  }
};

// Placeholder for future export formats
export const exportToJSON = (applications: Application[]): void => {
  // TODO: Implement JSON export
  console.log('JSON export not yet implemented');
};

export const exportToPDF = (applications: Application[]): void => {
  // TODO: Implement PDF export (Phase 8 or later)
  console.log('PDF export not yet implemented');
};
