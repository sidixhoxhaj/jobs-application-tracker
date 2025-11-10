// ExpandableTableRow Component
// Mobile-friendly table row that expands to show all fields

import { useState, memo } from 'react';
import { Application, CustomField } from '../../../types';
import { StatusBadge } from '../../common';
import { formatDateDisplay } from '../../../utils/date';
import './ExpandableTableRow.scss';

export interface ExpandableTableRowProps {
  application: Application;
  fields: CustomField[];
  onView: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  onViewNotes: (application: Application) => void;
}

const ExpandableTableRow = ({
  application,
  fields,
  onView,
  onEdit,
  onDelete,
  onViewNotes,
}: ExpandableTableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Render field value based on field type
  const renderFieldValue = (field: CustomField) => {
    const value = application.data[field.id];

    if (value === undefined || value === null || value === '') {
      return <span className="expandable-row__empty">—</span>;
    }

    // Select field - render as StatusBadge
    if (field.type === 'select' && field.options) {
      const option = field.options.find((opt) => opt.value === value);
      if (option) {
        return <StatusBadge label={option.label} color={option.color} size="small" />;
      }
      return <span>{value}</span>;
    }

    // Date field - format as dd/mm/yyyy
    if (field.type === 'date') {
      return <span>{formatDateDisplay(value)}</span>;
    }

    // Checkbox field
    if (field.type === 'checkbox') {
      return <span>{value ? 'Yes' : 'No'}</span>;
    }

    // Textarea - truncate if too long
    if (field.type === 'textarea') {
      const text = String(value);
      if (text.length > 100) {
        return <span title={text}>{text.substring(0, 100)}...</span>;
      }
      return <span>{text}</span>;
    }

    // Default - text, number
    return <span>{String(value)}</span>;
  };

  const notesCount = application.notes.length;

  // Filter to only show fields that should be visible in table
  const visibleFields = fields.filter(field => field.showInTable);

  // Get the first field (usually company name) for collapsed view
  const firstField = visibleFields[0];
  const otherFields = visibleFields.slice(1);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="expandable-row">
      {/* Collapsed Row */}
      <div className="expandable-row__header" onClick={toggleExpanded}>
        <div className="expandable-row__primary-field">
          {firstField && renderFieldValue(firstField)}
        </div>
        <button
          className={`expandable-row__toggle ${isExpanded ? 'expandable-row__toggle--expanded' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}
          aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="expandable-row__content">
          {/* Other Fields */}
          <div className="expandable-row__fields">
            {otherFields.map((field) => (
              <div key={field.id} className="expandable-row__field">
                <div className="expandable-row__field-label">{field.name}:</div>
                <div className="expandable-row__field-value">
                  {renderFieldValue(field)}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="expandable-row__actions">
            <button
              type="button"
              className="expandable-row__action"
              onClick={() => onView(application)}
              aria-label="View details"
              title="View details"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 8C1 8 3 3 8 3C13 3 15 8 15 8C15 8 13 13 8 13C3 13 1 8 1 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              View
            </button>
            <button
              type="button"
              className="expandable-row__action"
              onClick={() => onViewNotes(application)}
              aria-label="View notes"
              title={`View notes (${notesCount})`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 2H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H11C11.5523 14 12 13.5523 12 13V6M9 2L12 6M9 2V6H12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Notes
              {notesCount > 0 && (
                <span className="expandable-row__badge">{notesCount}</span>
              )}
            </button>
            <button
              type="button"
              className="expandable-row__action"
              onClick={() => onEdit(application)}
              aria-label="Edit application"
              title="Edit"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L2.66634 14L3.33301 11.3334L11.333 2.00004Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </button>
            <button
              type="button"
              className="expandable-row__action expandable-row__action--danger"
              onClick={() => onDelete(application.id)}
              aria-label="Delete application"
              title="Delete"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4H14M12.6667 4V13.3333C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2 6 1.33333 6.66667 1.33333H9.33333C10 1.33333 10.6667 2 10.6667 2.66667V4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ExpandableTableRow);