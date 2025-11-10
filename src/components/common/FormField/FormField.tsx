// FormField Component
// Reusable wrapper for custom form elements with label, error, and helper text

import { ReactNode } from 'react';
import './FormField.scss';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

const FormField = ({
  label,
  required = false,
  error,
  helperText,
  children,
  htmlFor,
  className = '',
}: FormFieldProps) => {
  const fieldId = htmlFor || `field-${label?.replace(/\s+/g, '-').toLowerCase()}`;

  const containerClasses = ['form-field', className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={fieldId} className="form-field__label">
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}
      <div className="form-field__input">
        {children}
      </div>
      {error && (
        <span id={`${fieldId}-error`} className="form-field__error">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${fieldId}-helper`} className="form-field__helper">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default FormField;
