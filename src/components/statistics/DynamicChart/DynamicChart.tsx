// Dynamic Chart Component
// Renders any chart type based on configuration

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartActions from './ChartActions';
import { useAppSelector } from '../../../redux/hooks';
import { ChartConfig } from '../../../types';
import {
  aggregateByDay,
  aggregateByMonth,
  aggregateByValue,
} from '../../../services/chartDataService';
import { createDateRange } from '../../../services/statsService';
import './DynamicChart.scss';

interface DynamicChartProps {
  config: ChartConfig;
  onEdit: (config: ChartConfig) => void;
  onDelete: (id: string) => void;
}

const DynamicChart = ({ config, onEdit, onDelete }: DynamicChartProps) => {
  const applications = useAppSelector((state) => state.applications.items);
  const customFields = useAppSelector((state) => state.customFields.fields);

  // Prepare data based on config
  const chartData = useMemo(() => {
    const { series, dataSource, customFieldId, groupBy, dateRange } = config;

    // For pie charts, use single series only
    if (groupBy === 'value' || config.chartType === 'pie') {
      const fieldId = series?.[0]?.customFieldId || customFieldId;
      if (fieldId) {
        const data = aggregateByValue(applications, customFields, fieldId);
        return data;
      }
      return [];
    }

    // For time-series charts, support multiple series
    const seriesToRender = series && series.length > 0 ? series : [
      {
        id: 'single',
        label: config.title,
        dataSource: dataSource!,
        customFieldId,
        color: config.color,
      }
    ];

    // Aggregate data for each series
    const seriesDataMap = new Map<string, any>();
    const allLabels = new Set<string>();

    seriesToRender.forEach((s) => {
      const fieldIdToUse = s.dataSource === 'custom-field' ? s.customFieldId! : 'applications-count';

      let seriesData: any[] = [];
      if (groupBy === 'day') {
        const range = (dateRange && dateRange !== 'custom') ? createDateRange(dateRange as 'last7' | 'last30' | 'last90' | 'all') : undefined;
        seriesData = aggregateByDay(applications, customFields, fieldIdToUse, range);
      } else if (groupBy === 'month') {
        seriesData = aggregateByMonth(applications, customFields, fieldIdToUse, 6);
      }

      // Store data points by label
      const dataByLabel = new Map<string, number>();
      seriesData.forEach((point) => {
        dataByLabel.set(point.label, point.value);
        allLabels.add(point.label);
      });

      seriesDataMap.set(s.id, { series: s, dataByLabel });
    });

    // Combine all series into single data array with multiple value keys
    const combinedData: any[] = [];
    const sortedLabels = Array.from(allLabels).sort();

    sortedLabels.forEach((label) => {
      const dataPoint: any = { label };
      seriesDataMap.forEach(({ series: s, dataByLabel }) => {
        dataPoint[s.id] = dataByLabel.get(label) || 0;
      });
      combinedData.push(dataPoint);
    });

    return { data: combinedData, series: seriesToRender };
  }, [applications, customFields, config]);

  // Chart color
  const chartColor = config.color || '#000000';

  // Render different chart types
  const renderChart = () => {
    // For pie charts, chartData is a simple array
    if (config.chartType === 'pie') {
      const data = Array.isArray(chartData) ? chartData : [];
      if (data.length === 0) {
        return (
          <div className="dynamic-chart__empty">
            <p>No data available for this chart.</p>
          </div>
        );
      }

      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry: any) => `${entry.percentage}%`}
              labelLine={false}
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color || chartColor} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    // For time-series charts, chartData has { data, series } structure
    const { data = [], series = [] } = (chartData as any) || {};

    if (!data || data.length === 0) {
      return (
        <div className="dynamic-chart__empty">
          <p>No data available for this chart.</p>
        </div>
      );
    }

    // Define colors for series (cycle through if more than predefined)
    const seriesColors = ['#000000', '#3B82F6', '#10B981', '#F59E0B'];

    switch (config.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#666' }} tickMargin={8} />
              <YAxis tick={{ fontSize: 12, fill: '#666' }} tickMargin={8} allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {series.map((s: any, index: number) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.id}
                  name={s.label}
                  stroke={s.color || seriesColors[index % seriesColors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#666' }} tickMargin={8} />
              <YAxis tick={{ fontSize: 12, fill: '#666' }} tickMargin={8} allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {series.map((s: any, index: number) => (
                <Bar
                  key={s.id}
                  dataKey={s.id}
                  name={s.label}
                  fill={s.color || seriesColors[index % seriesColors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#666' }} tickMargin={8} />
              <YAxis tick={{ fontSize: 12, fill: '#666' }} tickMargin={8} allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {series.map((s: any, index: number) => (
                <Area
                  key={s.id}
                  type="monotone"
                  dataKey={s.id}
                  name={s.label}
                  stroke={s.color || seriesColors[index % seriesColors.length]}
                  fill={s.color || seriesColors[index % seriesColors.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="dynamic-chart__empty">Unsupported chart type</div>;
    }
  };

  return (
    <div className="dynamic-chart">
      <div className="dynamic-chart__header">
        <h3 className="dynamic-chart__title">{config.title}</h3>
        <ChartActions
          onEdit={() => onEdit(config)}
          onDelete={() => onDelete(config.id)}
        />
      </div>

      <div className="dynamic-chart__container">{renderChart()}</div>
    </div>
  );
};

export default DynamicChart;
