// Overview Card Configuration Modal
// Modal for creating and editing custom overview metrics

import { useState, useEffect } from 'react';
import { Modal, Button, Input, ModalFooter } from '../../common';
import MetricSelector from './MetricSelector';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addOverviewCard, updateOverviewCard, moveOverviewCardUp, moveOverviewCardDown } from '../../../redux/slices/chartConfigsSlice';
import { OverviewCardConfig, BuiltInMetric, AggregationType } from '../../../types';
import './OverviewCardConfigModal.scss';

interface OverviewCardConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  existingConfig?: OverviewCardConfig;
}

const OverviewCardConfigModal = ({
  isOpen,
  onClose,
  mode,
  existingConfig,
}: OverviewCardConfigModalProps) => {
  const dispatch = useAppDispatch();
  const customFields = useAppSelector((state) => state.customFields.fields);
  const existingCards = useAppSelector((state) => state.chartConfigs.overviewCards);

  // Form state
  const [title, setTitle] = useState('');
  const [dataSource, setDataSource] = useState<BuiltInMetric | 'custom-field-aggregate'>(
    'total-applications'
  );
  const [customFieldId, setCustomFieldId] = useState<string>('');
  const [aggregationType, setAggregationType] = useState<AggregationType>('count');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with existing config if editing
  useEffect(() => {
    if (mode === 'edit' && existingConfig) {
      setTitle(existingConfig.title);
      setDataSource(existingConfig.dataSource);
      setCustomFieldId(existingConfig.customFieldId || '');
      setAggregationType(existingConfig.aggregationType || 'count');
    } else {
      // Reset form for add mode
      setTitle('');
      setDataSource('total-applications');
      setCustomFieldId('');
      setAggregationType('count');
    }
    setErrors({});
  }, [mode, existingConfig, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Card title is required';
    }

    if (dataSource === 'custom-field-aggregate') {
      if (!customFieldId) {
        newErrors.customFieldId = 'Please select a custom field';
      }
      if (!aggregationType) {
        newErrors.aggregationType = 'Please select an aggregation type';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Check maximum limit for add mode
    if (mode === 'add' && existingCards.length >= 4) {
      alert('Maximum 4 overview cards allowed. Please delete a card before adding a new one.');
      return;
    }

    const config: OverviewCardConfig = {
      id: mode === 'edit' && existingConfig ? existingConfig.id : `card-${Date.now()}`,
      title: title.trim(),
      dataSource,
      customFieldId: dataSource === 'custom-field-aggregate' ? customFieldId : undefined,
      aggregationType: dataSource === 'custom-field-aggregate' ? aggregationType : undefined,
      order: mode === 'edit' && existingConfig ? existingConfig.order : existingCards.length + 1,
      createdAt:
        mode === 'edit' && existingConfig ? existingConfig.createdAt : new Date().toISOString(),
    };

    if (mode === 'add') {
      dispatch(addOverviewCard(config));
    } else {
      dispatch(updateOverviewCard(config));
    }

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleMoveUp = () => {
    if (existingConfig) {
      dispatch(moveOverviewCardUp(existingConfig.id));
    }
  };

  const handleMoveDown = () => {
    if (existingConfig) {
      dispatch(moveOverviewCardDown(existingConfig.id));
    }
  };

  // Get current position
  const currentIndex = existingConfig
    ? existingCards.findIndex((card) => card.id === existingConfig.id)
    : -1;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="medium">
      <div className="overview-card-config-modal">
        <div className="overview-card-config-modal__header">
          <h2 className="overview-card-config-modal__title">
            {mode === 'add' ? 'Add Overview Metric' : 'Edit Overview Metric'}
          </h2>
          <p className="overview-card-config-modal__subtitle">
            Create a custom metric card to display key statistics
          </p>
        </div>

        <div className="overview-card-config-modal__body">
          {/* Card Title */}
          <div className="overview-card-config-modal__field">
            <label className="overview-card-config-modal__label">
              Card Title <span className="overview-card-config-modal__required">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Average Salary, Total Interviews"
              error={errors.title}
            />
          </div>

          {/* Metric Selector */}
          <div className="overview-card-config-modal__field">
            <label className="overview-card-config-modal__label">
              Metric Type <span className="overview-card-config-modal__required">*</span>
            </label>
            <MetricSelector
              selectedMetric={dataSource}
              selectedFieldId={customFieldId}
              selectedAggregation={aggregationType}
              onMetricChange={setDataSource}
              onFieldChange={setCustomFieldId}
              onAggregationChange={setAggregationType}
              customFields={customFields}
              fieldError={errors.customFieldId}
              aggregationError={errors.aggregationType}
            />
          </div>

          {/* Reorder Controls (only in edit mode) */}
          {mode === 'edit' && existingConfig && (
            <div className="overview-card-config-modal__field">
              <label className="overview-card-config-modal__label">Position</label>
              <div className="overview-card-config-modal__reorder">
                <span className="overview-card-config-modal__position">
                  Position: #{currentIndex + 1} of {existingCards.length}
                </span>
                <div className="overview-card-config-modal__reorder-buttons">
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
                    disabled={currentIndex === existingCards.length - 1}
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
            {mode === 'add' ? 'Add Metric' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default OverviewCardConfigModal;
