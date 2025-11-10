// StatCard Component
// Display a single statistic metric with label and value

import React, { memo } from 'react';
import './StatCard.scss';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

const StatCard = ({ label, value, icon, trend }: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <div className="stat-card__label">{label}</div>
        {icon && <div className="stat-card__icon">{icon}</div>}
      </div>

      <div className="stat-card__value">{value}</div>

      {trend && (
        <div className={`stat-card__trend stat-card__trend--${trend.direction}`}>
          <span className="stat-card__trend-icon">
            {trend.direction === 'up' ? '↑' : '↓'}
          </span>
          <span className="stat-card__trend-value">{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  );
};

export default memo(StatCard);
