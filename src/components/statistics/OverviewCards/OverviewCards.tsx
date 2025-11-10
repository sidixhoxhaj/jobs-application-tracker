// OverviewCards Component
// Display overview statistics in a grid of StatCard components

import { useMemo } from 'react';
import StatCard from '../StatCard/StatCard';
import { Application } from '../../../types/application';
import { CustomField } from '../../../types/customField';
import {
  calculateTotalApplications,
  calculateTotalResponses,
  calculateResponseRate,
  calculateAverageResponseTime,
} from '../../../services/statsService';
import './OverviewCards.scss';

export interface OverviewCardsProps {
  applications: Application[];
  customFields: CustomField[];
}

const OverviewCards = ({ applications, customFields }: OverviewCardsProps) => {
  // Calculate metrics using statsService
  const totalApplications = useMemo(
    () => calculateTotalApplications(applications),
    [applications]
  );

  const totalResponses = useMemo(
    () => calculateTotalResponses(applications, customFields),
    [applications, customFields]
  );

  const responseRate = useMemo(
    () => calculateResponseRate(applications, customFields),
    [applications, customFields]
  );

  const avgResponseTime = useMemo(
    () => calculateAverageResponseTime(applications, customFields),
    [applications, customFields]
  );

  return (
    <div className="overview-cards">
      <StatCard
        label="Total Applications"
        value={totalApplications}
      />

      <StatCard
        label="Total Responses"
        value={totalResponses}
      />

      <StatCard
        label="Response Rate"
        value={`${responseRate}%`}
      />

      <StatCard
        label="Avg Response Time"
        value={avgResponseTime > 0 ? `${avgResponseTime} days` : 'N/A'}
      />
    </div>
  );
};

export default OverviewCards;
