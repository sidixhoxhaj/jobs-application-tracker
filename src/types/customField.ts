// Custom Field Type Definitions
// Represents configurable fields for job applications

export type FieldType = 'text' | 'textarea' | 'date' | 'select' | 'number' | 'checkbox';

export interface FieldOption {
  value: string;
  label: string;
  color?: string; // Hex color for status badges, etc.
}

export interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  order: number;
  options?: FieldOption[]; // Only for 'select' type fields
  defaultValue?: any; // Optional default value
}
