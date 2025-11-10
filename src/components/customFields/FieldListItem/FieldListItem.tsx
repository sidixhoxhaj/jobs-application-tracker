import { CustomField } from '../../../types';
import './FieldListItem.scss';

interface FieldListItemProps {
  field: CustomField;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (field: CustomField) => void;
  onDelete: (field: CustomField) => void;
  onMoveUp: (field: CustomField) => void;
  onMoveDown: (field: CustomField) => void;
}

const FieldListItem = ({ field, isFirst, isLast, onEdit, onDelete, onMoveUp, onMoveDown }: FieldListItemProps) => {
  const handleEdit = () => {
    onEdit(field);
  };

  const handleDelete = () => {
    onDelete(field);
  };

  const handleMoveUp = () => {
    onMoveUp(field);
  };

  const handleMoveDown = () => {
    onMoveDown(field);
  };

  // Format field type for display
  const formatFieldType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      text: 'Text',
      textarea: 'Text Area',
      date: 'Date',
      select: 'Select',
      number: 'Number',
      checkbox: 'Checkbox',
    };
    return typeMap[type] || type;
  };

  return (
    <div className="field-list-item">
      <div className="field-list-item__name">
        {field.name}
        {field.type === 'select' && field.options && (
          <span className="field-list-item__options-count">
            ({field.options.length} options)
          </span>
        )}
      </div>

      <div className="field-list-item__type">
        <span className="field-list-item__type-badge">
          {formatFieldType(field.type)}
        </span>
      </div>

      <div className="field-list-item__required">
        {field.required ? (
          <span className="field-list-item__badge field-list-item__badge--required">
            Required
          </span>
        ) : (
          <span className="field-list-item__badge field-list-item__badge--optional">
            Optional
          </span>
        )}
      </div>

      <div className="field-list-item__show-in-table">
        {field.showInTable ? (
          <span className="field-list-item__badge field-list-item__badge--true">
            True
          </span>
        ) : (
          <span className="field-list-item__badge field-list-item__badge--false">
            False
          </span>
        )}
      </div>

      <div className="field-list-item__actions">
        <div className="field-list-item__reorder">
          <button
            className="field-list-item__reorder-btn"
            onClick={handleMoveUp}
            disabled={isFirst}
            aria-label="Move up"
            title="Move up"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <button
            className="field-list-item__reorder-btn"
            onClick={handleMoveDown}
            disabled={isLast}
            aria-label="Move down"
            title="Move down"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <button
          className="field-list-item__action-btn"
          onClick={handleEdit}
          aria-label="Edit field"
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
        </button>

        <button
          className="field-list-item__action-btn field-list-item__action-btn--danger"
          onClick={handleDelete}
          aria-label="Delete field"
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
        </button>
      </div>
    </div>
  );
};

export default FieldListItem;
