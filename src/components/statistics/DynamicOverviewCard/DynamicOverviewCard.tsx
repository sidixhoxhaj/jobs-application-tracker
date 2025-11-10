// Dynamic Overview Card Component
// Renders overview metrics based on configuration

import { useMemo } from 'react';
import CardActions from './CardActions';
import { useAppSelector } from '../../../redux/hooks';
import { OverviewCardConfig } from '../../../types';
import {
  calculateTotalApplications,
  calculateTotalResponses,
  calculateResponseRate,
  calculateAverageResponseTime,
} from '../../../services/statsService';
import { calculateFieldAggregate } from '../../../services/chartDataService';
import './DynamicOverviewCard.scss';

interface DynamicOverviewCardProps {
  config: OverviewCardConfig;
  onEdit: (config: OverviewCardConfig) => void;
  onDelete: (id: string) => void;
}

const DynamicOverviewCard = ({ config, onEdit, onDelete }: DynamicOverviewCardProps) => {
  const applications = useAppSelector((state) => state.applications.items);
  const customFields = useAppSelector((state) => state.customFields.fields);

  // Calculate metric value
  const value = useMemo(() => {
    const { dataSource, customFieldId, aggregationType } = config;

    if (dataSource === 'total-applications') {
      return calculateTotalApplications(applications).toString();
    } else if (dataSource === 'total-responses') {
      return calculateTotalResponses(applications, customFields).toString();
    } else if (dataSource === 'response-rate') {
      const rate = calculateResponseRate(applications, customFields);
      return `${rate}%`;
    } else if (dataSource === 'avg-response-time') {
      const avgTime = calculateAverageResponseTime(applications, customFields);
      return avgTime === 0 ? 'N/A' : `${avgTime} days`;
    } else if (dataSource === 'custom-field-aggregate' && customFieldId && aggregationType) {
      const result = calculateFieldAggregate(
        applications,
        customFields,
        customFieldId,
        aggregationType
      );
      return typeof result === 'number' ? result.toString() : result;
    }

    return 'N/A';
  }, [applications, customFields, config]);

  // Format value for display
  const formattedValue = useMemo(() => {
    // If it's a large number, format with commas
    if (typeof value === 'string' && !isNaN(Number(value.replace(/,/g, '')))) {
      const num = Number(value.replace(/,/g, ''));
      if (num >= 1000) {
        return num.toLocaleString();
      }
    }
    return value;
  }, [value]);

  return (
    <div className="dynamic-overview-card">
      <div className="dynamic-overview-card__header">
        <CardActions onEdit={() => onEdit(config)} onDelete={() => onDelete(config.id)} />
      </div>

      <div className="dynamic-overview-card__content">
        <div className="dynamic-overview-card__label">{config.title}</div>
        <div className="dynamic-overview-card__value">{formattedValue}</div>
      </div>
    </div>
  );
};

export default DynamicOverviewCard;
