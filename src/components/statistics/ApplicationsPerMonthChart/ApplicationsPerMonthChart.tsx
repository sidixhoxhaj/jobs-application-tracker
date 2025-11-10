// ApplicationsPerMonthChart Component
// Bar chart showing applications submitted per month

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Application } from '../../../types/application';
import { CustomField } from '../../../types/customField';
import { getApplicationsPerMonth } from '../../../services/statsService';
import ChartContainer from '../shared/ChartContainer/ChartContainer';
import ChartTooltip from '../shared/ChartTooltip/ChartTooltip';
import { chartConfig } from '../shared/chartConfig';

export interface ApplicationsPerMonthChartProps {
  applications: Application[];
  customFields: CustomField[];
  monthCount?: number;
}

const ApplicationsPerMonthChart = ({
  applications,
  customFields,
  monthCount = 6,
}: ApplicationsPerMonthChartProps) => {
  // Get applications per month data
  const chartData = useMemo(() => {
    return getApplicationsPerMonth(applications, customFields, monthCount);
  }, [applications, customFields, monthCount]);

  // Tooltip formatter
  const tooltipValueFormatter = (value: any) => {
    return `${value} ${value === 1 ? 'Application' : 'Applications'}`;
  };

  const tooltipLabelFormatter = (_label: string, data: any) => {
    return data.monthLabel;
  };

  const isEmpty = chartData.every((item) => item.count === 0);

  return (
    <ChartContainer
      title="Applications Per Month"
      subtitle={`Last ${monthCount} months`}
      isEmpty={isEmpty}
      emptyMessage="No application data available."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={chartConfig.margin}>
          <CartesianGrid {...chartConfig.grid} />
          <XAxis dataKey="monthLabel" {...chartConfig.xAxis} />
          <YAxis {...chartConfig.yAxis} />
          <Tooltip
            content={<ChartTooltip valueFormatter={tooltipValueFormatter} labelFormatter={tooltipLabelFormatter} />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar dataKey="count" fill="#000000" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ApplicationsPerMonthChart;
