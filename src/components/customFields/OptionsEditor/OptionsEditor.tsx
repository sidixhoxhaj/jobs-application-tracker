import { useState } from 'react';
import { Button, FormField } from '../../common';
import './OptionsEditor.scss';

interface Option {
  value: string;
  label: string;
  color?: string;
}

interface OptionsEditorProps {
  options: Option[];
  onChange: (options: Option[]) => void;
  error?: string;
}

const predefinedColors = [
  { label: 'Blue', value: '#0070F3' },
  { label: 'Purple', value: '#7928CA' },
  { label: 'Orange', value: '#F5A623' },
  { label: 'Teal', value: '#50E3C2' },
  { label: 'Green', value: '#00C853' },
  { label: 'Red', value: '#EE0000' },
  { label: 'Gray', value: '#A3A3A3' },
  { label: 'Pink', value: '#FF0080' },
];

const OptionsEditor = ({ options, onChange, error }: OptionsEditorProps) => {
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddOption = () => {
    if (!newOptionLabel.trim()) return;

    const newOption: Option = {
      value: newOptionLabel.toLowerCase().replace(/\s+/g, '_'),
      label: newOptionLabel.trim(),
      color: predefinedColors[options.length % predefinedColors.length].value,
    };

    onChange([...options, newOption]);
    setNewOptionLabel('');
  };

  const handleUpdateOption = (index: number, field: keyof Option, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value,
    };

    // Update value when label changes
    if (field === 'label') {
      updatedOptions[index].value = value.toLowerCase().replace(/\s+/g, '_');
    }

    onChange(updatedOptions);
  };

  const handleRemoveOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <FormField
      label="Select Options"
      required
      helperText="Define the options available in this dropdown field. Each option can have a color."
      error={error}
      className="options-editor"
    >
      <div className="options-editor__list">
        {options.length === 0 ? (
          <div className="options-editor__empty">
            No options yet. Add your first option below.
          </div>
        ) : (
          options.map((option, index) => (
            <div key={index} className="options-editor__item">
              <div className="options-editor__item-content">
                <input
                  type="color"
                  value={option.color || '#0070F3'}
                  onChange={(e) => handleUpdateOption(index, 'color', e.target.value)}
                  className="options-editor__color-picker"
                  title="Choose color"
                />

                {editingIndex === index ? (
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
                    onBlur={() => setEditingIndex(null)}
                    className="options-editor__input"
                    autoFocus
                  />
                ) : (
                  <div
                    className="options-editor__label-display"
                    onClick={() => setEditingIndex(index)}
                  >
                    <span
                      className="options-editor__color-indicator"
                      style={{ backgroundColor: option.color }}
                    />
                    {option.label}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                className="options-editor__remove-btn"
                aria-label="Remove option"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="options-editor__add">
        <input
          type="text"
          value={newOptionLabel}
          onChange={(e) => setNewOptionLabel(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter option name (e.g., Applied, Interview, etc.)"
          className="options-editor__add-input"
        />
        <Button
          variant="secondary"
          size="small"
          onClick={handleAddOption}
          disabled={!newOptionLabel.trim()}
        >
          Add Option
        </Button>
      </div>
    </FormField>
  );
};

export default OptionsEditor;
