// Validation Service
// Handles form validation for applications and custom fields

import type { CustomField } from '../types';

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Validate application data against custom fields
export const validateApplicationData = (
  data: Record<string, any>,
  customFields: CustomField[]
): ValidationResult => {
  const errors: Record<string, string> = {};

  customFields.forEach(field => {
    const value = data[field.id];

    // Check required fields
    if (field.required && (value === undefined || value === null || value === '')) {
      errors[field.id] = `${field.name} is required`;
      return;
    }

    // Skip validation if field is not required and empty
    if (!field.required && (value === undefined || value === null || value === '')) {
      return;
    }

    // Type-specific validation
    switch (field.type) {
      case 'number':
        if (isNaN(Number(value))) {
          errors[field.id] = `${field.name} must be a valid number`;
        }
        break;

      case 'date':
        if (value && !isValidDate(value)) {
          errors[field.id] = `${field.name} must be a valid date`;
        }
        break;

      case 'select':
        if (field.options && !field.options.some(opt => opt.value === value)) {
          errors[field.id] = `${field.name} must be a valid option`;
        }
        break;

      // text, textarea, checkbox don't need additional validation
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate custom field configuration
export const validateCustomField = (field: Partial<CustomField>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!field.name || field.name.trim() === '') {
    errors.name = 'Field name is required';
  }

  if (!field.type) {
    errors.type = 'Field type is required';
  }

  if (field.type === 'select' && (!field.options || field.options.length === 0)) {
    errors.options = 'Select fields must have at least one option';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Helper: Check if date string is valid
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Helper: Sanitize string input (prevent XSS)
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Placeholder for future validation rules
export const validateEmail = (email: string): boolean => {
  // TODO: Add email validation if needed
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateURL = (url: string): boolean => {
  // TODO: Add URL validation if needed
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
