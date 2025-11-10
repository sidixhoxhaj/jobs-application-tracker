// ResponsesPerDayChart Component
// Line chart showing responses received per day

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Application } from '../../../types/application';
import { CustomField } from '../../../types/customField';
import { getResponsesPerDay, DateRange } from '../../../services/statsService';
import { formatDateShort } from '../../../utils/date';
import ChartContainer from '../shared/ChartContainer/ChartContainer';
import ChartTooltip from '../shared/ChartTooltip/ChartTooltip';
import { chartConfig } from '../shared/chartConfig';

export interface ResponsesPerDayChartProps {
  applications: Application[];
  customFields: CustomField[];
  dateRange?: DateRange;
  onDayClick?: (date: string, applications: Application[]) => void;
}

const ResponsesPerDayChart = ({
  applications,
  customFields,
  dateRange,
  onDayClick,
}: ResponsesPerDayChartProps) => {
  // Get responses per day data
  const chartData = useMemo(() => {
    const dayData = getResponsesPerDay(applications, customFields, dateRange);

    // Format dates for display (e.g., "Jan 15")
    return dayData.map((day) => ({
      date: day.date, // Keep original date for click handler
      displayDate: formatDateShort(day.date),
      count: day.count,
      applications: day.applications,
    }));
  }, [applications, customFields, dateRange]);

  // Handle click on data point
  const handleClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const payload = data.activePayload[0].payload;
      if (onDayClick && payload.applications) {
        onDayClick(payload.date, payload.applications);
      }
    }
  };

  // Tooltip formatter
  const tooltipValueFormatter = (value: any) => {
    return `${value} ${value === 1 ? 'Response' : 'Responses'}`;
  };

  return (
    <ChartContainer
      title="Responses Per Day"
      subtitle="Click on a point to see details"
      isEmpty={chartData.length === 0}
      emptyMessage="No response data available for the selected date range."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} onClick={handleClick} margin={chartConfig.margin}>
          <CartesianGrid {...chartConfig.grid} />
          <XAxis dataKey="displayDate" {...chartConfig.xAxis} />
          <YAxis {...chartConfig.yAxis} />
          <Tooltip
            content={<ChartTooltip valueFormatter={tooltipValueFormatter} />}
            cursor={chartConfig.tooltipCursor}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#0070F3"
            strokeWidth={2}
            dot={{ fill: '#0070F3', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#0070F3', cursor: 'pointer' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ResponsesPerDayChart;
