// Applications and Responses Per Month Chart (Combined)
// Bar chart showing both applications and responses over months

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Application } from '../../../types/application';
import { CustomField } from '../../../types/customField';
import { getApplicationsPerMonth, getResponsesPerMonth } from '../../../services/statsService';
import ChartContainer from '../shared/ChartContainer/ChartContainer';
import ChartTooltip from '../shared/ChartTooltip/ChartTooltip';
import { chartConfig } from '../shared/chartConfig';

export interface ApplicationsAndResponsesMonthlyChartProps {
  applications: Application[];
  customFields: CustomField[];
  monthCount?: number;
}

const ApplicationsAndResponsesMonthlyChart = ({
  applications,
  customFields,
  monthCount = 6
}: ApplicationsAndResponsesMonthlyChartProps) => {
  // Get both applications and responses data
  const chartData = useMemo(() => {
    const applicationsData = getApplicationsPerMonth(applications, customFields, monthCount);
    const responsesData = getResponsesPerMonth(applications, customFields, monthCount);

    // Combine both datasets by month
    const combinedMap = new Map();

    applicationsData.forEach(item => {
      combinedMap.set(item.month, {
        month: item.month,
        applications: item.count,
        responses: 0
      });
    });

    responsesData.forEach(item => {
      const existing = combinedMap.get(item.month);
      if (existing) {
        existing.responses = item.count;
      } else {
        combinedMap.set(item.month, {
          month: item.month,
          applications: 0,
          responses: item.count
        });
      }
    });

    // Sort by date (oldest to newest)
    return Array.from(combinedMap.values()).sort((a, b) => {
      const [monthA, yearA] = a.month.split(' ');
      const [monthB, yearB] = b.month.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [applications, customFields, monthCount]);

  const valueFormatter = (value: any, _payload: any) => {
    return `${value}`;
  };

  const labelFormatter = (_label: string, payload: any) => {
    return payload.month;
  };

  return (
    <ChartContainer
      title="Applications & Responses Per Month"
      subtitle={`Last ${monthCount} months`}
      isEmpty={chartData.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid {...chartConfig.grid} />
          <XAxis dataKey="month" {...chartConfig.xAxis} />
          <YAxis {...chartConfig.yAxis} />
          <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} labelFormatter={labelFormatter} />} />
          <Legend />
          <Bar
            dataKey="applications"
            name="Applications"
            fill="#000000"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="responses"
            name="Responses"
            fill="#0070F3"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ApplicationsAndResponsesMonthlyChart;
