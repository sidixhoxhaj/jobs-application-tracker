// Chart Configuration Types
// Types for configurable charts and overview cards

export type ChartType = 'line' | 'bar' | 'pie' | 'area';

export type DataSource = 'applications-count' | 'custom-field';

export type GroupBy = 'day' | 'week' | 'month' | 'value';

export type DateRangePreset = 'last7' | 'last30' | 'last90' | 'all' | 'custom';

export type AggregationType = 'count' | 'sum' | 'avg' | 'min' | 'max';

export type BuiltInMetric =
  | 'total-applications'
  | 'total-responses'
  | 'response-rate'
  | 'avg-response-time';

// Individual series within a chart
export interface ChartSeries {
  id: string;
  label: string; // Display name for this series
  dataSource: DataSource;
  customFieldId?: string; // Required if dataSource = 'custom-field'
  color?: string; // Color for this series (hex)
}

export interface ChartConfig {
  id: string;
  title: string;
  chartType: ChartType;
  // Multi-series support (optional, max 4)
  series?: ChartSeries[];
  // Single series (backward compatibility)
  dataSource?: DataSource;
  customFieldId?: string; // Required if dataSource = 'custom-field'
  color?: string;
  // Common
  groupBy: GroupBy;
  dateRange?: DateRangePreset;
  order: number;
  createdAt: string;
}

export interface OverviewCardConfig {
  id: string;
  title: string;
  dataSource: BuiltInMetric | 'custom-field-aggregate';
  customFieldId?: string; // Required if dataSource = 'custom-field-aggregate'
  aggregationType?: AggregationType; // Required if dataSource = 'custom-field-aggregate'
  icon?: string;
  order: number;
  createdAt: string;
}

// Chart data interfaces for aggregated data
export interface ChartDataPoint {
  label: string; // Date string or value label
  value: number; // Count or aggregated value
  date?: Date; // Original date for sorting
  applications?: any[]; // Applications for drill-down (optional)
}

export interface PieChartDataPoint {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

// Validation helpers
export function isValidChartConfig(config: Partial<ChartConfig>): config is ChartConfig {
  if (!config.id || !config.title || !config.chartType || !config.groupBy) {
    return false;
  }

  // Must have either series array or single dataSource
  const hasSeries = config.series && Array.isArray(config.series) && config.series.length > 0;
  const hasDataSource = !!config.dataSource;

  if (!hasSeries && !hasDataSource) {
    return false;
  }

  // If using series, validate each one
  if (hasSeries && config.series) {
    for (const series of config.series) {
      if (!series.id || !series.label || !series.dataSource) {
        return false;
      }
      if (series.dataSource === 'custom-field' && !series.customFieldId) {
        return false;
      }
    }
  }

  // If using single dataSource and it's custom-field, customFieldId is required
  if (hasDataSource && config.dataSource === 'custom-field' && !config.customFieldId) {
    return false;
  }

  return true;
}

export function isValidOverviewCardConfig(
  config: Partial<OverviewCardConfig>
): config is OverviewCardConfig {
  if (!config.id || !config.title || !config.dataSource) {
    return false;
  }

  // If dataSource is custom-field-aggregate, customFieldId and aggregationType are required
  if (config.dataSource === 'custom-field-aggregate') {
    if (!config.customFieldId || !config.aggregationType) {
      return false;
    }
  }

  return true;
}

// Default configurations
export function getDefaultChartConfigs(statusFieldId?: string): ChartConfig[] {
  const defaults: ChartConfig[] = [
    {
      id: 'default-apps-daily',
      title: 'Applications Per Day',
      chartType: 'line',
      dataSource: 'applications-count',
      groupBy: 'day',
      dateRange: 'last30',
      color: '#000000',
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'default-apps-monthly',
      title: 'Applications Per Month',
      chartType: 'bar',
      dataSource: 'applications-count',
      groupBy: 'month',
      color: '#000000',
      order: 2,
      createdAt: new Date().toISOString(),
    },
  ];

  // Add status breakdown chart if status field exists
  if (statusFieldId) {
    defaults.push({
      id: 'default-status-breakdown',
      title: 'Status Breakdown',
      chartType: 'pie',
      dataSource: 'custom-field',
      customFieldId: statusFieldId,
      groupBy: 'value',
      order: 3,
      createdAt: new Date().toISOString(),
    });
  }

  return defaults;
}

export function getDefaultOverviewCardConfigs(): OverviewCardConfig[] {
  return [
    {
      id: 'default-total-apps',
      title: 'Total Applications',
      dataSource: 'total-applications',
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'default-total-responses',
      title: 'Total Responses',
      dataSource: 'total-responses',
      order: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'default-response-rate',
      title: 'Response Rate',
      dataSource: 'response-rate',
      order: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'default-avg-response-time',
      title: 'Avg Response Time',
      dataSource: 'avg-response-time',
      order: 4,
      createdAt: new Date().toISOString(),
    },
  ];
}
