// DynamicForm Component
// Generates form fields dynamically based on custom fields configuration

import { CustomField } from '../../../types';
import { Input, Dropdown, FormField, Checkbox } from '../../common';
import './DynamicForm.scss';

export interface FormData {
  [fieldId: string]: any;
}

export interface FormErrors {
  [fieldId: string]: string;
}

export interface DynamicFormProps {
  fields: CustomField[];
  formData: FormData;
  errors: FormErrors;
  onChange: (fieldId: string, value: any) => void;
}

const DynamicForm = ({ fields, formData, errors, onChange }: DynamicFormProps) => {
  // Sort fields by order
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  const renderField = (field: CustomField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
        return (
          <Input
            key={field.id}
            label={field.name}
            type="text"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
            error={error}
            fullWidth
          />
        );

      case 'number':
        return (
          <Input
            key={field.id}
            label={field.name}
            type="number"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
            error={error}
            fullWidth
          />
        );

      case 'date':
        return (
          <Input
            key={field.id}
            label={field.name}
            type="date"
            dateFormat="dd/mm/yyyy"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
            error={error}
            fullWidth
          />
        );

      case 'select':
        return (
          <Dropdown
            key={field.id}
            label={field.name}
            options={field.options || []}
            value={value}
            onChange={(val) => onChange(field.id, val)}
            required={field.required}
            error={error}
            fullWidth
            placeholder={`Select ${field.name}`}
          />
        );

      case 'checkbox':
        return (
          <FormField key={field.id} error={error}>
            <Checkbox
              label={field.name}
              checked={!!value}
              onChange={(checked) => onChange(field.id, checked)}
              required={field.required}
            />
          </FormField>
        );

      case 'textarea':
        return (
          <FormField
            key={field.id}
            label={field.name}
            required={field.required}
            error={error}
            className="dynamic-form__textarea-wrapper"
          >
            <textarea
              value={value}
              onChange={(e) => onChange(field.id, e.target.value)}
              required={field.required}
              className={`dynamic-form__textarea ${error ? 'dynamic-form__textarea--error' : ''}`}
              rows={4}
              placeholder={`Enter ${field.name}`}
            />
          </FormField>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dynamic-form">
      {sortedFields.map((field) => renderField(field))}
    </div>
  );
};

export default DynamicForm;
