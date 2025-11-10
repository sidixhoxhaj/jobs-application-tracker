// Chart Type Selector Component
// Visual selector for choosing chart type

import { ChartType, CustomField } from '../../../types';
import { getRecommendedChartTypes } from '../../../services/chartDataService';

interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onSelect: (type: ChartType) => void;
  dataSource: 'applications-count' | 'custom-field';
  customFieldId?: string;
  customFields: CustomField[];
}

const ChartTypeSelector = ({
  selectedType,
  onSelect,
  dataSource,
  customFieldId,
  customFields,
}: ChartTypeSelectorProps) => {
  // Get recommended types based on selected field
  const getRecommended = (): ChartType[] => {
    if (dataSource === 'custom-field' && customFieldId) {
      const field = customFields.find((f) => f.id === customFieldId);
      if (field) {
        return getRecommendedChartTypes(field) as ChartType[];
      }
    }
    // Default recommendations for applications-count
    return ['line', 'bar', 'area'];
  };

  const recommended = getRecommended();

  const chartTypes: Array<{
    type: ChartType;
    label: string;
    icon: JSX.Element;
    description: string;
  }> = [
    {
      type: 'line',
      label: 'Line Chart',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M4 24L10 16L16 20L28 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      description: 'Best for trends over time',
    },
    {
      type: 'bar',
      label: 'Bar Chart',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="16" width="4" height="10" fill="currentColor" />
          <rect x="14" y="10" width="4" height="16" fill="currentColor" />
          <rect x="22" y="14" width="4" height="12" fill="currentColor" />
        </svg>
      ),
      description: 'Compare values across categories',
    },
    {
      type: 'pie',
      label: 'Pie Chart',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path
            d="M16 16L16 6A10 10 0 0 1 26 16Z"
            fill="currentColor"
            opacity="0.5"
          />
          <path
            d="M16 16L26 16A10 10 0 0 1 16 26Z"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
      ),
      description: 'Show proportions and percentages',
    },
    {
      type: 'area',
      label: 'Area Chart',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M4 24L10 16L16 20L28 8L28 26L4 26Z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M4 24L10 16L16 20L28 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      description: 'Emphasize volume over time',
    },
  ];

  return (
    <div className="chart-type-selector">
      {chartTypes.map(({ type, label, icon, description }) => {
        const isSelected = type === selectedType;
        const isRecommended = recommended.includes(type);

        return (
          <button
            key={type}
            type="button"
            className={`chart-type-selector__option ${
              isSelected ? 'chart-type-selector__option--selected' : ''
            } ${!isRecommended ? 'chart-type-selector__option--not-recommended' : ''}`}
            onClick={() => onSelect(type)}
            title={description}
          >
            <div className="chart-type-selector__icon">{icon}</div>
            <div className="chart-type-selector__label">{label}</div>
            {isRecommended && (
              <div className="chart-type-selector__badge">Recommended</div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ChartTypeSelector;
