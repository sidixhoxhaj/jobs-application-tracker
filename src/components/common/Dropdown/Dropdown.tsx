// Dropdown Component
// Custom select dropdown with support for custom options

import { useState, useRef, useEffect } from 'react';
import './Dropdown.scss';

export interface DropdownOption {
  value: string;
  label: string;
  color?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  required = false,
  fullWidth = false,
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const hasError = !!error;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const containerClasses = [
    'dropdown',
    fullWidth && 'dropdown--full-width',
  ].filter(Boolean).join(' ');

  const triggerClasses = [
    'dropdown__trigger',
    isOpen && 'dropdown__trigger--open',
    hasError && 'dropdown__trigger--error',
    disabled && 'dropdown__trigger--disabled',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} ref={dropdownRef}>
      {label && (
        <label className="dropdown__label">
          {label}
          {required && <span className="dropdown__required">*</span>}
        </label>
      )}

      <button
        type="button"
        className={triggerClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? 'dropdown__value' : 'dropdown__placeholder'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className="dropdown__icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown__menu" role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`dropdown__option ${
                option.value === value ? 'dropdown__option--selected' : ''
              }`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.color && (
                <span
                  className="dropdown__color-indicator"
                  style={{ backgroundColor: option.color }}
                />
              )}
              <span>{option.label}</span>
              {option.value === value && (
                <svg
                  className="dropdown__check"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 4L6 11L3 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {error && <span className="dropdown__error">{error}</span>}
    </div>
  );
};

export default Dropdown;
