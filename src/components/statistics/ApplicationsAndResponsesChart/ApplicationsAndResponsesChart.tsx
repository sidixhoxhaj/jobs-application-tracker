// Applications and Responses Per Day Chart (Combined)
// Line chart showing both applications and responses over time

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Application } from '../../../types/application';
import { CustomField } from '../../../types/customField';
import { DateRange, getApplicationsPerDay, getResponsesPerDay } from '../../../services/statsService';
import ChartContainer from '../shared/ChartContainer/ChartContainer';
import ChartTooltip from '../shared/ChartTooltip/ChartTooltip';
import { chartConfig } from '../shared/chartConfig';

export interface ApplicationsAndResponsesChartProps {
  applications: Application[];
  customFields: CustomField[];
  dateRange: DateRange;
  onDayClick?: (date: string, applications: Application[], type: 'applications' | 'responses') => void;
}

const ApplicationsAndResponsesChart = ({
  applications,
  customFields,
  dateRange
}: ApplicationsAndResponsesChartProps) => {
  // Get both applications and responses data
  const chartData = useMemo(() => {
    const applicationsData = getApplicationsPerDay(applications, customFields, dateRange);
    const responsesData = getResponsesPerDay(applications, customFields, dateRange);

    // Combine both datasets by date
    const combinedMap = new Map();

    applicationsData.forEach(item => {
      combinedMap.set(item.date, {
        date: item.date,
        applications: item.count,
        applicationsData: item.applications,
        responses: 0,
        responsesData: []
      });
    });

    responsesData.forEach(item => {
      const existing = combinedMap.get(item.date);
      if (existing) {
        existing.responses = item.count;
        existing.responsesData = item.applications;
      } else {
        combinedMap.set(item.date, {
          date: item.date,
          applications: 0,
          applicationsData: [],
          responses: item.count,
          responsesData: item.applications
        });
      }
    });

    return Array.from(combinedMap.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [applications, customFields, dateRange]);

  const valueFormatter = (value: any, _payload: any) => {
    return `${value}`;
  };

  const labelFormatter = (_label: string, payload: any) => {
    return payload.date;
  };

  return (
    <ChartContainer
      title="Applications & Responses Per Day"
      subtitle="Click a point to view details"
      isEmpty={chartData.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid {...chartConfig.grid} />
          <XAxis dataKey="date" {...chartConfig.xAxis} />
          <YAxis {...chartConfig.yAxis} />
          <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} labelFormatter={labelFormatter} />} />
          <Legend iconType="line" />
          <Line
            type="monotone"
            dataKey="applications"
            name="Applications"
            stroke="#000000"
            strokeWidth={2}
            dot={{ r: 4, fill: '#000000', cursor: 'pointer' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="responses"
            name="Responses"
            stroke="#0070F3"
            strokeWidth={2}
            dot={{ r: 4, fill: '#0070F3', cursor: 'pointer' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ApplicationsAndResponsesChart;
