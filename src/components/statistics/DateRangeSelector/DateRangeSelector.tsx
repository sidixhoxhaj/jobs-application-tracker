// DateRangeSelector Component
// Allows users to select date range for statistics: preset options or custom range

import { useState } from 'react';
import './DateRangeSelector.scss';

export type DateRangePreset = 'last7' | 'last30' | 'last90' | 'all' | 'custom';

export interface DateRangeSelectorProps {
  onRangeChange: (preset: DateRangePreset, customStart?: string, customEnd?: string) => void;
  initialPreset?: DateRangePreset;
}

const DateRangeSelector = ({ onRangeChange, initialPreset = 'last30' }: DateRangeSelectorProps) => {
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>(initialPreset);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showCustomInputs, setShowCustomInputs] = useState(false);

  const handlePresetClick = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      setShowCustomInputs(true);
      setSelectedPreset(preset);
    } else {
      setShowCustomInputs(false);
      setSelectedPreset(preset);
      onRangeChange(preset);
    }
  };

  const handleApplyCustomRange = () => {
    if (customStartDate && customEndDate) {
      onRangeChange('custom', customStartDate, customEndDate);
      setShowCustomInputs(false);
    }
  };

  const handleCancelCustomRange = () => {
    setShowCustomInputs(false);
    // Reset to previous preset
    if (selectedPreset === 'custom') {
      setSelectedPreset('last30');
      onRangeChange('last30');
    }
  };

  return (
    <div className="date-range-selector">
      <div className="date-range-selector__label">Date Range:</div>

      <div className="date-range-selector__buttons">
        <button
          className={`date-range-selector__button ${selectedPreset === 'last7' ? 'active' : ''}`}
          onClick={() => handlePresetClick('last7')}
        >
          Last 7 Days
        </button>

        <button
          className={`date-range-selector__button ${selectedPreset === 'last30' ? 'active' : ''}`}
          onClick={() => handlePresetClick('last30')}
        >
          Last 30 Days
        </button>

        <button
          className={`date-range-selector__button ${selectedPreset === 'last90' ? 'active' : ''}`}
          onClick={() => handlePresetClick('last90')}
        >
          Last 90 Days
        </button>

        <button
          className={`date-range-selector__button ${selectedPreset === 'all' ? 'active' : ''}`}
          onClick={() => handlePresetClick('all')}
        >
          All Time
        </button>

        <button
          className={`date-range-selector__button ${selectedPreset === 'custom' ? 'active' : ''}`}
          onClick={() => handlePresetClick('custom')}
        >
          Custom Range
        </button>
      </div>

      {showCustomInputs && (
        <div className="date-range-selector__custom">
          <div className="date-range-selector__custom-inputs">
            <div className="date-range-selector__input-group">
              <label htmlFor="start-date">Start Date:</label>
              <input
                id="start-date"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                max={customEndDate || undefined}
              />
            </div>

            <div className="date-range-selector__input-group">
              <label htmlFor="end-date">End Date:</label>
              <input
                id="end-date"
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                min={customStartDate || undefined}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="date-range-selector__custom-actions">
            <button
              className="date-range-selector__apply-button"
              onClick={handleApplyCustomRange}
              disabled={!customStartDate || !customEndDate}
            >
              Apply
            </button>
            <button
              className="date-range-selector__cancel-button"
              onClick={handleCancelCustomRange}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
