import { useState, useEffect } from 'react';
import { CustomField, FieldType } from '../../../types';
import { Modal, Input, Button, ModalFooter, Checkbox } from '../../common';
import FieldTypeSelector from '../FieldTypeSelector/FieldTypeSelector';
import OptionsEditor from '../OptionsEditor/OptionsEditor';
import './FieldModal.scss';

interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Omit<CustomField, 'id' | 'order'>) => void;
  mode: 'add' | 'edit';
  field?: CustomField;
}

const FieldModal = ({ isOpen, onClose, onSave, mode, field }: FieldModalProps) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('text');
  const [isRequired, setIsRequired] = useState(false);
  const [showInTable, setShowInTable] = useState(false);
  const [options, setOptions] = useState<Array<{ value: string; label: string; color?: string }>>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize form with field data in edit mode
  useEffect(() => {
    if (mode === 'edit' && field) {
      setFieldName(field.name);
      setFieldType(field.type);
      setIsRequired(field.required);
      setShowInTable(field.showInTable);
      setOptions(field.options || []);
    } else {
      // Reset form in add mode
      setFieldName('');
      setFieldType('text');
      setIsRequired(false);
      setShowInTable(false);
      setOptions([]);
    }
    setErrors({});
  }, [mode, field, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!fieldName.trim()) {
      newErrors.fieldName = 'Field name is required';
    }

    if (fieldType === 'select' && options.length === 0) {
      newErrors.options = 'Select fields must have at least one option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const fieldData: Omit<CustomField, 'id' | 'order'> = {
      name: fieldName.trim(),
      type: fieldType,
      required: isRequired,
      showInTable: showInTable,
    };

    if (fieldType === 'select') {
      fieldData.options = options;
    }

    onSave(fieldData);
    handleClose();
  };

  const handleClose = () => {
    setFieldName('');
    setFieldType('text');
    setIsRequired(false);
    setShowInTable(false);
    setOptions([]);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={mode === 'add' ? 'Add New Field' : 'Edit Field'} size="large">
      <div className="field-modal">
        <div className="field-modal__form">
          <Input
            label="Field Name"
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            error={errors.fieldName}
            required
            placeholder="e.g., Company Name, Job Position"
          />

          <FieldTypeSelector
            value={fieldType}
            onChange={setFieldType}
            label="Field Type"
            required
          />

          <Checkbox
            label="Required Field"
            description="You must fill this field when adding an application"
            checked={isRequired}
            onChange={setIsRequired}
          />

          <Checkbox
            label="Show in Table"
            description="Display this field as a column in the dashboard table"
            checked={showInTable}
            onChange={setShowInTable}
          />

          {fieldType === 'select' && (
            <div className="field-modal__options">
              <OptionsEditor
                options={options}
                onChange={setOptions}
                error={errors.options}
              />
            </div>
          )}
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {mode === 'add' ? 'Add Field' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default FieldModal;
