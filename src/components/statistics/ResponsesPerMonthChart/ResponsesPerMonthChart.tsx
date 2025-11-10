// ResponsesPerMonthChart Component
// Bar chart showing responses received per month

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Application } from '../../../types/application';
import { CustomField } from '../../../types/customField';
import { getResponsesPerMonth } from '../../../services/statsService';
import ChartContainer from '../shared/ChartContainer/ChartContainer';
import ChartTooltip from '../shared/ChartTooltip/ChartTooltip';
import { chartConfig } from '../shared/chartConfig';

export interface ResponsesPerMonthChartProps {
  applications: Application[];
  customFields: CustomField[];
  monthCount?: number;
}

const ResponsesPerMonthChart = ({
  applications,
  customFields,
  monthCount = 6,
}: ResponsesPerMonthChartProps) => {
  // Get responses per month data
  const chartData = useMemo(() => {
    return getResponsesPerMonth(applications, customFields, monthCount);
  }, [applications, customFields, monthCount]);

  // Tooltip formatter
  const tooltipValueFormatter = (value: any) => {
    return `${value} ${value === 1 ? 'Response' : 'Responses'}`;
  };

  const tooltipLabelFormatter = (_label: string, data: any) => {
    return data.monthLabel;
  };

  const isEmpty = chartData.every((item) => item.count === 0);

  return (
    <ChartContainer
      title="Responses Per Month"
      subtitle={`Last ${monthCount} months`}
      isEmpty={isEmpty}
      emptyMessage="No response data available."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={chartConfig.margin}>
          <CartesianGrid {...chartConfig.grid} />
          <XAxis dataKey="monthLabel" {...chartConfig.xAxis} />
          <YAxis {...chartConfig.yAxis} />
          <Tooltip
            content={<ChartTooltip valueFormatter={tooltipValueFormatter} labelFormatter={tooltipLabelFormatter} />}
            cursor={{ fill: 'rgba(0, 112, 243, 0.05)' }}
          />
          <Bar dataKey="count" fill="#0070F3" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ResponsesPerMonthChart;
