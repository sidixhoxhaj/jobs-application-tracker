// ChartTooltip Component
// Reusable tooltip for Recharts with customizable content

import './ChartTooltip.scss';

export interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  valueFormatter?: (value: any, payload: any) => string;
  labelFormatter?: (label: string, payload: any) => string;
}

const ChartTooltip = ({
  active,
  payload,
  valueFormatter,
  labelFormatter,
}: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;
  const value = payload[0].value;

  // Default formatters
  const defaultLabelFormatter = (data: any) => {
    return data.displayDate || data.date || '';
  };

  const defaultValueFormatter = (value: any) => {
    return `${value}`;
  };

  const formattedLabel = labelFormatter
    ? labelFormatter(data.displayDate || data.date, data)
    : defaultLabelFormatter(data);

  const formattedValue = valueFormatter
    ? valueFormatter(value, data)
    : defaultValueFormatter(value);

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{formattedLabel}</p>
      <p className="chart-tooltip__value">{formattedValue}</p>
    </div>
  );
};

export default ChartTooltip;
