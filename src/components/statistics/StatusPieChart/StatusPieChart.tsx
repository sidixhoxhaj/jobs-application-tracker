// StatusPieChart Component
// Pie chart showing status distribution with click to filter dashboard

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Application } from '../../../types/application';
import { CustomField } from '../../../types/customField';
import { getStatusBreakdown } from '../../../services/statsService';
import ChartContainer from '../shared/ChartContainer/ChartContainer';
import ChartTooltip from '../shared/ChartTooltip/ChartTooltip';

export interface StatusPieChartProps {
  applications: Application[];
  customFields: CustomField[];
}

const StatusPieChart = ({ applications, customFields }: StatusPieChartProps) => {
  const navigate = useNavigate();

  // Get status breakdown data
  const chartData = useMemo(() => {
    return getStatusBreakdown(applications, customFields);
  }, [applications, customFields]);

  // Handle click on pie segment
  const handleClick = (data: any) => {
    if (data && data.status) {
      // Navigate to dashboard with status filter
      navigate(`/?status=${encodeURIComponent(data.status)}`);
    }
  };

  // Tooltip formatter
  const tooltipValueFormatter = (_value: any, data: any) => {
    return `${data.count} (${data.percentage}%)`;
  };

  const tooltipLabelFormatter = (_label: string, data: any) => {
    return data.label;
  };

  // Custom label for pie segments
  const renderLabel = (entry: any) => {
    return `${entry.percentage}%`;
  };

  return (
    <ChartContainer
      title="Status Breakdown"
      subtitle="Click a segment to filter dashboard"
      isEmpty={chartData.length === 0}
      emptyMessage="No status data available."
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="label"
            cx="35%"
            cy="50%"
            outerRadius={100}
            label={renderLabel}
            labelLine={false}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#000000'} />
            ))}
          </Pie>
          <Tooltip
            content={<ChartTooltip valueFormatter={tooltipValueFormatter} labelFormatter={tooltipLabelFormatter} />}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingLeft: '40px' }}
            formatter={(_, entry: any) => {
              const data = entry.payload;
              return `${data.label} (${data.count})`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default StatusPieChart;
