// Checkbox Component
// Reusable checkbox with label and optional description

import { InputHTMLAttributes } from 'react';
import './Checkbox.scss';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox = ({
  label,
  description,
  checked,
  onChange,
  className = '',
  required = false,
  ...props
}: CheckboxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const containerClass = `checkbox ${className}`.trim();

  return (
    <div className={containerClass}>
      <label className="checkbox__label">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="checkbox__input"
          {...props}
        />
        <span className="checkbox__text">
          {label}
          {required && <span className="checkbox__required">*</span>}
        </span>
      </label>
      {description && <p className="checkbox__description">{description}</p>}
    </div>
  );
};

export default Checkbox;
