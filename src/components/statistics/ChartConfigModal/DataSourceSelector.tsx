// Data Source Selector Component
// Select between applications count or custom field

import { Select } from '../../common';
import { CustomField, DataSource } from '../../../types';

interface DataSourceSelectorProps {
  selectedSource: DataSource;
  selectedFieldId: string;
  onSourceChange: (source: DataSource) => void;
  onFieldChange: (fieldId: string) => void;
  customFields: CustomField[];
  error?: string;
}

const DataSourceSelector = ({
  selectedSource,
  selectedFieldId,
  onSourceChange,
  onFieldChange,
  customFields,
  error,
}: DataSourceSelectorProps) => {
  // Group fields by type for better organization
  const groupedFields = customFields.reduce((acc, field) => {
    const type = field.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(field);
    return acc;
  }, {} as Record<string, CustomField[]>);

  const getFieldTypeIcon = (type: string): string => {
    switch (type) {
      case 'text':
        return '📝';
      case 'number':
        return '🔢';
      case 'date':
        return '📅';
      case 'select':
        return '📋';
      case 'checkbox':
        return '☑️';
      case 'textarea':
        return '📄';
      default:
        return '📌';
    }
  };

  const getFieldTypeLabel = (type: string): string => {
    switch (type) {
      case 'text':
        return 'Text';
      case 'number':
        return 'Number';
      case 'date':
        return 'Date';
      case 'select':
        return 'Select';
      case 'checkbox':
        return 'Checkbox';
      case 'textarea':
        return 'Text Area';
      default:
        return type;
    }
  };

  return (
    <div className="data-source-selector">
      {/* Source Type Radio */}
      <div className="data-source-selector__radio-group">
        <label className="data-source-selector__radio">
          <input
            type="radio"
            name="dataSource"
            value="applications-count"
            checked={selectedSource === 'applications-count'}
            onChange={() => {
              onSourceChange('applications-count');
              onFieldChange('');
            }}
          />
          <div className="data-source-selector__radio-content">
            <div className="data-source-selector__radio-label">Application Count</div>
            <div className="data-source-selector__radio-description">
              Track number of applications over time
            </div>
          </div>
        </label>

        <label className="data-source-selector__radio">
          <input
            type="radio"
            name="dataSource"
            value="custom-field"
            checked={selectedSource === 'custom-field'}
            onChange={() => onSourceChange('custom-field')}
          />
          <div className="data-source-selector__radio-content">
            <div className="data-source-selector__radio-label">Custom Field</div>
            <div className="data-source-selector__radio-description">
              Track data from any custom field
            </div>
          </div>
        </label>
      </div>

      {/* Custom Field Selector (shown when custom-field is selected) */}
      {selectedSource === 'custom-field' && (
        <div className="data-source-selector__field-select">
          <Select
            value={selectedFieldId}
            onChange={(e) => onFieldChange(e.target.value)}
            error={error}
          >
            <option value="">Select a field...</option>
            {Object.entries(groupedFields).map(([type, fields]) => (
              <optgroup
                key={type}
                label={`${getFieldTypeIcon(type)} ${getFieldTypeLabel(type)} Fields`}
              >
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                    {field.required ? ' *' : ''}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>

          {selectedFieldId && (
            <div className="data-source-selector__field-info">
              {(() => {
                const field = customFields.find((f) => f.id === selectedFieldId);
                if (!field) return null;

                return (
                  <div className="data-source-selector__field-details">
                    <span className="data-source-selector__field-type">
                      {getFieldTypeIcon(field.type)} {getFieldTypeLabel(field.type)}
                    </span>
                    {field.type === 'select' && field.options && (
                      <span className="data-source-selector__field-options">
                        {field.options.length} options
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataSourceSelector;
