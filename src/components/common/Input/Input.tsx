// Input Component
// Reusable input with label, error state, and required indicator

import { InputHTMLAttributes, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Input.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  dateFormat?: 'dd/mm/yyyy' | 'mm/dd/yyyy';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      required = false,
      className = '',
      id,
      type,
      value,
      onChange,
      dateFormat = 'dd/mm/yyyy',
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
    const hasError = !!error;

    // For date inputs with dd/mm/yyyy format, use react-datepicker
    const isDateInput = type === 'date' && dateFormat === 'dd/mm/yyyy';

    // Convert ISO date string (YYYY-MM-DD) to Date object
    const parseISODate = (isoDate: string): Date | null => {
      if (!isoDate) return null;
      const date = new Date(isoDate);
      return isNaN(date.getTime()) ? null : date;
    };

    // Convert Date object to ISO string (YYYY-MM-DD)
    const formatDateToISO = (date: Date | null): string => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const handleDatePickerChange = (date: Date | null) => {
      if (onChange) {
        const isoDate = formatDateToISO(date);
        const syntheticEvent = {
          target: { value: isoDate }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const inputClasses = [
      'input__field',
      hasError && 'input__field--error',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const containerClasses = [
      'input',
      fullWidth && 'input--full-width',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className="input__label">
            {label}
            {required && <span className="input__required">*</span>}
          </label>
        )}
        {isDateInput ? (
          <DatePicker
            id={inputId}
            selected={parseISODate(value as string)}
            onChange={handleDatePickerChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            className={inputClasses}
            required={required}
            autoComplete="off"
            showPopperArrow={false}
          />
        ) : (
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={inputClasses}
            value={value}
            onChange={onChange}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            lang="en-GB"
            {...props}
          />
        )}
        {error && (
          <span id={`${inputId}-error`} className="input__error">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={`${inputId}-helper`} className="input__helper">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
