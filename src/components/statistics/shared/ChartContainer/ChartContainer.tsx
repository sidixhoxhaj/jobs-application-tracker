// ChartContainer Component
// Reusable container for all chart components with header and empty state

import { ReactNode } from 'react';
import './ChartContainer.scss';

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
  className?: string;
}

const ChartContainer = ({
  title,
  subtitle,
  isEmpty = false,
  emptyMessage = 'No data available for the selected date range.',
  children,
  className = '',
}: ChartContainerProps) => {
  const containerClass = `chart-container ${className}`.trim();

  if (isEmpty) {
    return (
      <div className={containerClass}>
        <div className="chart-container__header">
          <h3 className="chart-container__title">{title}</h3>
          {subtitle && <p className="chart-container__subtitle">{subtitle}</p>}
        </div>
        <div className="chart-container__empty">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="chart-container__header">
        <h3 className="chart-container__title">{title}</h3>
        {subtitle && <p className="chart-container__subtitle">{subtitle}</p>}
      </div>
      <div className="chart-container__content">{children}</div>
    </div>
  );
};

export default ChartContainer;
