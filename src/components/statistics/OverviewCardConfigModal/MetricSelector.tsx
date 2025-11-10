// Metric Selector Component
// Select between built-in metrics or custom field aggregates

import { Select } from '../../common';
import { CustomField, BuiltInMetric, AggregationType } from '../../../types';
import { getRecommendedAggregations } from '../../../services/chartDataService';

interface MetricSelectorProps {
  selectedMetric: BuiltInMetric | 'custom-field-aggregate';
  selectedFieldId: string;
  selectedAggregation: AggregationType;
  onMetricChange: (metric: BuiltInMetric | 'custom-field-aggregate') => void;
  onFieldChange: (fieldId: string) => void;
  onAggregationChange: (aggregation: AggregationType) => void;
  customFields: CustomField[];
  fieldError?: string;
  aggregationError?: string;
}

const MetricSelector = ({
  selectedMetric,
  selectedFieldId,
  selectedAggregation,
  onMetricChange,
  onFieldChange,
  onAggregationChange,
  customFields,
  fieldError,
  aggregationError,
}: MetricSelectorProps) => {
  const builtInMetrics: Array<{
    value: BuiltInMetric;
    label: string;
    description: string;
  }> = [
    {
      value: 'total-applications',
      label: 'Total Applications',
      description: 'Count of all job applications',
    },
    {
      value: 'total-responses',
      label: 'Total Responses',
      description: 'Count of applications with responses',
    },
    {
      value: 'response-rate',
      label: 'Response Rate',
      description: 'Percentage of applications that received responses',
    },
    {
      value: 'avg-response-time',
      label: 'Average Response Time',
      description: 'Average days from application to first response',
    },
  ];

  const isCustomField = selectedMetric === 'custom-field-aggregate';

  // Get available aggregations for selected field
  const getAggregationOptions = () => {
    if (!selectedFieldId) return [];

    const field = customFields.find((f) => f.id === selectedFieldId);
    if (!field) return [];

    const recommended = getRecommendedAggregations(field);

    const allAggregations: Array<{ value: AggregationType; label: string; description: string }> =
      [
        { value: 'count', label: 'Count', description: 'Count non-empty values' },
        { value: 'sum', label: 'Sum', description: 'Sum of all values' },
        { value: 'avg', label: 'Average', description: 'Average of all values' },
        { value: 'min', label: 'Minimum', description: 'Lowest value' },
        { value: 'max', label: 'Maximum', description: 'Highest value' },
      ];

    return allAggregations.filter((agg) => recommended.includes(agg.value));
  };

  const aggregationOptions = getAggregationOptions();

  // Group fields by type
  const groupedFields = customFields.reduce((acc, field) => {
    const type = field.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(field);
    return acc;
  }, {} as Record<string, CustomField[]>);

  const getFieldTypeLabel = (type: string): string => {
    switch (type) {
      case 'text':
        return 'Text Fields';
      case 'number':
        return 'Number Fields';
      case 'date':
        return 'Date Fields';
      case 'select':
        return 'Select Fields';
      case 'checkbox':
        return 'Checkbox Fields';
      case 'textarea':
        return 'Text Area Fields';
      default:
        return `${type} Fields`;
    }
  };

  return (
    <div className="metric-selector">
      {/* Metric Type Radio */}
      <div className="metric-selector__radio-group">
        {builtInMetrics.map((metric) => (
          <label key={metric.value} className="metric-selector__radio">
            <input
              type="radio"
              name="metricType"
              value={metric.value}
              checked={selectedMetric === metric.value}
              onChange={() => onMetricChange(metric.value)}
            />
            <div className="metric-selector__radio-content">
              <div className="metric-selector__radio-label">{metric.label}</div>
              <div className="metric-selector__radio-description">{metric.description}</div>
            </div>
          </label>
        ))}

        <label className="metric-selector__radio">
          <input
            type="radio"
            name="metricType"
            value="custom-field-aggregate"
            checked={selectedMetric === 'custom-field-aggregate'}
            onChange={() => onMetricChange('custom-field-aggregate')}
          />
          <div className="metric-selector__radio-content">
            <div className="metric-selector__radio-label">Custom Field Aggregate</div>
            <div className="metric-selector__radio-description">
              Calculate metrics from any custom field
            </div>
          </div>
        </label>
      </div>

      {/* Custom Field Options (shown when custom-field-aggregate is selected) */}
      {isCustomField && (
        <div className="metric-selector__custom-options">
          {/* Field Selector */}
          <div className="metric-selector__field">
            <label className="metric-selector__label">
              Select Field <span className="metric-selector__required">*</span>
            </label>
            <Select
              value={selectedFieldId}
              onChange={(e) => {
                onFieldChange(e.target.value);
                // Reset aggregation when field changes
                const field = customFields.find((f) => f.id === e.target.value);
                if (field) {
                  const recommended = getRecommendedAggregations(field);
                  if (recommended.length > 0) {
                    onAggregationChange(recommended[0]);
                  }
                }
              }}
              error={fieldError}
            >
              <option value="">Choose a field...</option>
              {Object.entries(groupedFields).map(([type, fields]) => (
                <optgroup key={type} label={getFieldTypeLabel(type)}>
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                      {field.required ? ' *' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </div>

          {/* Aggregation Type Selector */}
          {selectedFieldId && aggregationOptions.length > 0 && (
            <div className="metric-selector__field">
              <label className="metric-selector__label">
                Aggregation Type <span className="metric-selector__required">*</span>
              </label>
              <div className="metric-selector__aggregation-grid">
                {aggregationOptions.map((agg) => (
                  <button
                    key={agg.value}
                    type="button"
                    className={`metric-selector__agg-option ${
                      selectedAggregation === agg.value
                        ? 'metric-selector__agg-option--selected'
                        : ''
                    }`}
                    onClick={() => onAggregationChange(agg.value)}
                    title={agg.description}
                  >
                    <div className="metric-selector__agg-label">{agg.label}</div>
                    <div className="metric-selector__agg-description">{agg.description}</div>
                  </button>
                ))}
              </div>
              {aggregationError && (
                <div className="metric-selector__error">{aggregationError}</div>
              )}
            </div>
          )}

          {/* Field Info */}
          {selectedFieldId && (
            <div className="metric-selector__field-info">
              {(() => {
                const field = customFields.find((f) => f.id === selectedFieldId);
                if (!field) return null;

                return (
                  <div className="metric-selector__info-box">
                    <div className="metric-selector__info-row">
                      <span className="metric-selector__info-label">Field Type:</span>
                      <span className="metric-selector__info-value">
                        {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                      </span>
                    </div>
                    {field.type === 'select' && field.options && (
                      <div className="metric-selector__info-row">
                        <span className="metric-selector__info-label">Options:</span>
                        <span className="metric-selector__info-value">
                          {field.options.length} choices
                        </span>
                      </div>
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

export default MetricSelector;
