import { FieldType } from '../../../types';
import { FormField } from '../../common';
import './FieldTypeSelector.scss';

interface FieldTypeOption {
  value: FieldType;
  label: string;
  description: string;
}

interface FieldTypeSelectorProps {
  value: FieldType;
  onChange: (type: FieldType) => void;
  label?: string;
  required?: boolean;
}

const fieldTypeOptions: FieldTypeOption[] = [
  {
    value: 'text',
    label: 'Text',
    description: 'Short single-line text input',
  },
  {
    value: 'textarea',
    label: 'Text Area',
    description: 'Multi-line text for longer content',
  },
  {
    value: 'date',
    label: 'Date',
    description: 'Date picker for selecting dates',
  },
  {
    value: 'select',
    label: 'Select',
    description: 'Dropdown with custom options',
  },
  {
    value: 'number',
    label: 'Number',
    description: 'Numeric input field',
  },
  {
    value: 'checkbox',
    label: 'Checkbox',
    description: 'True/false toggle',
  },
];

const FieldTypeSelector = ({ value, onChange, label, required }: FieldTypeSelectorProps) => {
  const selectedOption = fieldTypeOptions.find(opt => opt.value === value);

  return (
    <FormField
      label={label}
      required={required}
      helperText={selectedOption?.description}
      className="field-type-selector"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FieldType)}
        className="field-type-selector__select"
        required={required}
      >
        {fieldTypeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export default FieldTypeSelector;
