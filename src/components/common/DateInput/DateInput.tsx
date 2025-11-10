// DateInput Component
// Custom date input that always displays DD/MM/YYYY format regardless of locale

import { useState, useEffect } from 'react';
import './DateInput.scss';

export interface DateInputProps {
  label?: string;
  value: string; // YYYY-MM-DD format (ISO)
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const DateInput = ({
  label,
  value,
  onChange,
  required = false,
  error,
  fullWidth = false,
  disabled = false,
  placeholder = 'DD/MM/YYYY',
}: DateInputProps) => {
  // Convert ISO date (YYYY-MM-DD) to display format (DD/MM/YYYY)
  const isoToDisplay = (isoDate: string): string => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  // Convert display format (DD/MM/YYYY) to ISO date (YYYY-MM-DD)
  const displayToISO = (display: string): string => {
    const cleaned = display.replace(/\D/g, '');
    if (cleaned.length < 8) return '';

    const day = cleaned.substring(0, 2);
    const month = cleaned.substring(2, 4);
    const year = cleaned.substring(4, 8);

    return `${year}-${month}-${day}`;
  };

  const [displayValue, setDisplayValue] = useState(isoToDisplay(value));
  const [isFocused, setIsFocused] = useState(false);

  // Update display value when prop value changes
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(isoToDisplay(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Remove non-numeric characters
    const numbers = input.replace(/\D/g, '');

    // Format as DD/MM/YYYY with automatic slashes
    let formatted = '';
    if (numbers.length > 0) {
      formatted = numbers.substring(0, 2);
    }
    if (numbers.length >= 3) {
      formatted += '/' + numbers.substring(2, 4);
    }
    if (numbers.length >= 5) {
      formatted += '/' + numbers.substring(4, 8);
    }

    setDisplayValue(formatted);

    // If we have a complete date, convert to ISO and call onChange
    if (numbers.length === 8) {
      const isoDate = displayToISO(formatted);

      // Validate the date
      const date = new Date(isoDate);
      if (!isNaN(date.getTime())) {
        onChange(isoDate);
      } else {
        // Invalid date, don't call onChange
      }
    } else {
      // Incomplete date - don't update the parent value
      // Parent will keep the old value until a complete date is entered
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    // If incomplete, clear or revert to original value
    const numbers = displayValue.replace(/\D/g, '');
    if (numbers.length > 0 && numbers.length < 8) {
      setDisplayValue(isoToDisplay(value));
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const inputId = `date-input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  const hasError = !!error;

  const containerClasses = [
    'date-input',
    fullWidth && 'date-input--full-width',
    hasError && 'date-input--error',
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [
    'date-input__field',
    hasError && 'date-input__field--error',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className="date-input__label">
          {label}
          {required && <span className="date-input__required">*</span>}
        </label>
      )}
      <input
        type="text"
        id={inputId}
        className={inputClasses}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={10}
        required={required}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <span id={`${inputId}-error`} className="date-input__error">
          {error}
        </span>
      )}
    </div>
  );
};

export default DateInput;
