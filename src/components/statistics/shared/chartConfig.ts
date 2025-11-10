// Shared Chart Configuration
// Standard Recharts axis, grid, and styling configurations

export const chartConfig = {
  // CartesianGrid configuration
  grid: {
    strokeDasharray: '3 3',
    stroke: '#E5E5E5',
  },

  // XAxis configuration
  xAxis: {
    stroke: '#737373',
    fontSize: 12,
    tickLine: false,
    axisLine: { stroke: '#E5E5E5' },
  },

  // YAxis configuration
  yAxis: {
    stroke: '#737373',
    fontSize: 12,
    tickLine: false,
    axisLine: { stroke: '#E5E5E5' },
    allowDecimals: false,
  },

  // Tooltip cursor configuration
  tooltipCursor: {
    stroke: '#A3A3A3',
    strokeWidth: 1,
  },

  // Line chart configuration
  line: {
    stroke: '#000000',
    strokeWidth: 2,
    dot: { fill: '#000000', strokeWidth: 2, r: 4 },
    activeDot: { r: 6, fill: '#000000', cursor: 'pointer' },
  },

  // Bar chart configuration
  bar: {
    fill: '#000000',
  },

  // Chart margins
  margin: {
    top: 5,
    right: 10,
    left: -20,
    bottom: 5,
  },
};
