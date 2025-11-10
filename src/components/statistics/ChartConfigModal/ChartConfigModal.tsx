// Chart Configuration Modal
// Modal for creating and editing custom charts with multi-series support

import { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, ModalFooter } from '../../common';
import ChartTypeSelector from './ChartTypeSelector';
import DataSourceSelector from './DataSourceSelector';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addChart, updateChart, moveChartUp, moveChartDown } from '../../../redux/slices/chartConfigsSlice';
import { ChartConfig, ChartSeries, ChartType, GroupBy, DateRangePreset } from '../../../types';
import './ChartConfigModal.scss';

interface ChartConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  existingConfig?: ChartConfig;
}

const ChartConfigModal = ({ isOpen, onClose, mode, existingConfig }: ChartConfigModalProps) => {
  const dispatch = useAppDispatch();
  const customFields = useAppSelector((state) => state.customFields.fields);
  const existingCharts = useAppSelector((state) => state.chartConfigs.charts);

  // Form state
  const [title, setTitle] = useState('');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [series, setSeries] = useState<ChartSeries[]>([]);
  const [groupBy, setGroupBy] = useState<GroupBy>('day');
  const [dateRange, setDateRange] = useState<DateRangePreset>('last30');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with existing config if editing
  useEffect(() => {
    if (mode === 'edit' && existingConfig) {
      setTitle(existingConfig.title);
      setChartType(existingConfig.chartType);
      setGroupBy(existingConfig.groupBy);
      setDateRange(existingConfig.dateRange || 'last30');

      // Convert old single-series format to new multi-series format
      if (existingConfig.series && existingConfig.series.length > 0) {
        setSeries(existingConfig.series);
      } else if (existingConfig.dataSource) {
        setSeries([{
          id: 'series-1',
          label: existingConfig.title,
          dataSource: existingConfig.dataSource,
          customFieldId: existingConfig.customFieldId,
          color: existingConfig.color || '#000000',
        }]);
      } else {
        setSeries([]);
      }
    } else {
      // Reset form for add mode with one default series
      setTitle('');
      setChartType('line');
      setSeries([{
        id: 'series-1',
        label: 'Applications',
        dataSource: 'applications-count',
        color: '#000000',
      }]);
      setGroupBy('day');
      setDateRange('last30');
    }
    setErrors({});
  }, [mode, existingConfig, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Chart title is required';
    }

    if (series.length === 0) {
      newErrors.series = 'At least one data series is required';
    }

    series.forEach((s, index) => {
      if (!s.label.trim()) {
        newErrors[`series-${index}-label`] = 'Series label is required';
      }
      if (s.dataSource === 'custom-field' && !s.customFieldId) {
        newErrors[`series-${index}-field`] = 'Field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Check maximum limit for add mode
    if (mode === 'add' && existingCharts.length >= 4) {
      alert('Maximum 4 charts allowed. Please delete a chart before adding a new one.');
      return;
    }

    const config: ChartConfig = {
      id: mode === 'edit' && existingConfig ? existingConfig.id : `chart-${Date.now()}`,
      title: title.trim(),
      chartType,
      series: series.map((s) => ({
        ...s,
        label: s.label.trim(),
      })),
      groupBy,
      dateRange: groupBy === 'day' || groupBy === 'week' ? dateRange : undefined,
      order: mode === 'edit' && existingConfig ? existingConfig.order : existingCharts.length + 1,
      createdAt: mode === 'edit' && existingConfig ? existingConfig.createdAt : new Date().toISOString(),
    };

    if (mode === 'add') {
      dispatch(addChart(config));
    } else {
      dispatch(updateChart(config));
    }

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleMoveUp = () => {
    if (existingConfig) {
      dispatch(moveChartUp(existingConfig.id));
    }
  };

  const handleMoveDown = () => {
    if (existingConfig) {
      dispatch(moveChartDown(existingConfig.id));
    }
  };

  // Get current position
  const currentIndex = existingConfig
    ? existingCharts.findIndex((chart) => chart.id === existingConfig.id)
    : -1;

  // Series management
  const handleAddSeries = () => {
    if (series.length >= 4) {
      alert('Maximum 4 series allowed per chart');
      return;
    }

    // Auto-select next available field
    const usedFieldIds = series
      .filter((s) => s.dataSource === 'custom-field')
      .map((s) => s.customFieldId);

    const nextField = customFields.find((f) => !usedFieldIds.includes(f.id));

    const newSeries: ChartSeries = {
      id: `series-${Date.now()}`,
      label: nextField ? nextField.name : `Series ${series.length + 1}`,
      dataSource: nextField ? 'custom-field' : 'applications-count',
      customFieldId: nextField?.id,
      color: ['#000000', '#3B82F6', '#10B981', '#F59E0B'][series.length % 4],
    };

    setSeries([...series, newSeries]);
  };

  const handleUpdateSeries = (index: number, updates: Partial<ChartSeries>) => {
    const updated = [...series];
    updated[index] = { ...updated[index], ...updates };
    setSeries(updated);
  };

  const handleRemoveSeries = (index: number) => {
    if (series.length <= 1) {
      alert('Chart must have at least one data series');
      return;
    }
    setSeries(series.filter((_, i) => i !== index));
  };

  // Show date range only for time-series groupings
  const showDateRange = groupBy === 'day' || groupBy === 'week';

  // Pie charts only support single series
  const maxSeriesCount = chartType === 'pie' ? 1 : 4;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="large">
      <div className="chart-config-modal">
        <div className="chart-config-modal__header">
          <h2 className="chart-config-modal__title">
            {mode === 'add' ? 'Create New Chart' : 'Edit Chart'}
          </h2>
          <p className="chart-config-modal__subtitle">
            Add multiple data series to compare different metrics
          </p>
        </div>

        <div className="chart-config-modal__body">
          {/* Chart Title */}
          <div className="chart-config-modal__field">
            <label className="chart-config-modal__label">
              Chart Title <span className="chart-config-modal__required">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Applications vs Responses Over Time"
              error={errors.title}
            />
          </div>

          {/* Chart Type Selector */}
          <div className="chart-config-modal__field">
            <label className="chart-config-modal__label">
              Chart Type <span className="chart-config-modal__required">*</span>
            </label>
            <ChartTypeSelector
              selectedType={chartType}
              onSelect={(type) => {
                setChartType(type);
                // If switching to pie, keep only first series
                if (type === 'pie' && series.length > 1) {
                  setSeries([series[0]]);
                }
              }}
              dataSource={series[0]?.dataSource || 'applications-count'}
              customFieldId={series[0]?.customFieldId}
              customFields={customFields}
            />
          </div>

          {/* Data Series */}
          <div className="chart-config-modal__field">
            <div className="chart-config-modal__series-header">
              <label className="chart-config-modal__label">
                Data Series <span className="chart-config-modal__required">*</span> ({series.length}/{maxSeriesCount})
              </label>
              {series.length < maxSeriesCount && chartType !== 'pie' && (
                <Button size="small" onClick={handleAddSeries}>
                  + Add Series
                </Button>
              )}
            </div>

            {errors.series && (
              <p className="chart-config-modal__error">{errors.series}</p>
            )}

            <div className="chart-config-modal__series-list">
              {series.map((s, index) => (
                <div key={s.id} className="chart-config-modal__series-item">
                  <div className="chart-config-modal__series-number">#{index + 1}</div>

                  <div className="chart-config-modal__series-fields">
                    {/* Series Label */}
                    <div className="chart-config-modal__series-field">
                      <label className="chart-config-modal__series-label">Label</label>
                      <Input
                        value={s.label}
                        onChange={(e) => handleUpdateSeries(index, { label: e.target.value })}
                        placeholder="Series name"
                        error={errors[`series-${index}-label`]}
                      />
                    </div>

                    {/* Data Source */}
                    <div className="chart-config-modal__series-field">
                      <label className="chart-config-modal__series-label">Data Source</label>
                      <DataSourceSelector
                        selectedSource={s.dataSource}
                        selectedFieldId={s.customFieldId || ''}
                        onSourceChange={(source) => handleUpdateSeries(index, { dataSource: source, customFieldId: undefined })}
                        onFieldChange={(fieldId) => handleUpdateSeries(index, { customFieldId: fieldId })}
                        customFields={customFields}
                        error={errors[`series-${index}-field`]}
                      />
                    </div>

                    {/* Color Picker */}
                    <div className="chart-config-modal__series-field chart-config-modal__series-field--color">
                      <label className="chart-config-modal__series-label">Color</label>
                      <input
                        type="color"
                        value={s.color || '#000000'}
                        onChange={(e) => handleUpdateSeries(index, { color: e.target.value })}
                        className="chart-config-modal__color-input"
                      />
                    </div>

                    {/* Delete Button */}
                    {series.length > 1 && (
                      <button
                        type="button"
                        className="chart-config-modal__series-delete"
                        onClick={() => handleRemoveSeries(index)}
                        title="Remove series"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group By */}
          <div className="chart-config-modal__field">
            <label className="chart-config-modal__label">
              Group By <span className="chart-config-modal__required">*</span>
            </label>
            <Select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              options={
                chartType === 'pie'
                  ? [{ value: 'value', label: 'By Value' }]
                  : [
                      { value: 'day', label: 'By Day' },
                      { value: 'month', label: 'By Month' },
                    ]
              }
            />
          </div>

          {/* Date Range (conditional) */}
          {showDateRange && chartType !== 'pie' && (
            <div className="chart-config-modal__field">
              <label className="chart-config-modal__label">Date Range</label>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRangePreset)}
                options={[
                  { value: 'last7', label: 'Last 7 Days' },
                  { value: 'last30', label: 'Last 30 Days' },
                  { value: 'last90', label: 'Last 90 Days' },
                  { value: 'all', label: 'All Time' },
                ]}
              />
            </div>
          )}

          {/* Reorder Controls (only in edit mode) */}
          {mode === 'edit' && existingConfig && (
            <div className="chart-config-modal__field">
              <label className="chart-config-modal__label">Position</label>
              <div className="chart-config-modal__reorder">
                <span className="chart-config-modal__position">
                  Position: #{currentIndex + 1} of {existingCharts.length}
                </span>
                <div className="chart-config-modal__reorder-buttons">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleMoveUp}
                    disabled={currentIndex === 0}
                  >
                    Move Up
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleMoveDown}
                    disabled={currentIndex === existingCharts.length - 1}
                  >
                    Move Down
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === 'add' ? 'Create Chart' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default ChartConfigModal;
