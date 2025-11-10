// Select Component
// Wrapper for native select element with consistent styling

import React from 'react';
import './Select.scss';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options?: Array<{ value: string; label: string }>;
  children?: React.ReactNode;
}

const Select = ({ error, options, children, className = '', ...props }: SelectProps) => {
  return (
    <div className="select-wrapper">
      <select
        className={`select ${error ? 'select--error' : ''} ${className}`}
        {...props}
      >
        {options ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
      {error && <div className="select__error">{error}</div>}
    </div>
  );
};

export default Select;
