import { CustomField } from '../../../types';
import useMediaQuery from '../../../hooks/useMediaQuery';
import FieldListItem from '../FieldListItem/FieldListItem';
import ExpandableFieldListItem from '../ExpandableFieldListItem/ExpandableFieldListItem';
import './FieldList.scss';

interface FieldListProps {
  fields: CustomField[];
  onEditField: (field: CustomField) => void;
  onDeleteField: (field: CustomField) => void;
  onMoveUp: (field: CustomField) => void;
  onMoveDown: (field: CustomField) => void;
}

const FieldList = ({ fields, onEditField, onDeleteField, onMoveUp, onMoveDown }: FieldListProps) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  // Sort fields by order property
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  if (sortedFields.length === 0) {
    return (
      <div className="field-list field-list--empty">
        <div className="field-list__empty-state">
          <svg
            className="field-list__empty-icon"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="field-list__empty-title">No Custom Fields</h3>
          <p className="field-list__empty-description">
            Get started by adding your first custom field using the button above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="field-list">
      {isMobile ? (
        // Mobile view - expandable items
        <div className="field-list__mobile-container">
          {sortedFields.map((field, index) => (
            <ExpandableFieldListItem
              key={field.id}
              field={field}
              isFirst={index === 0}
              isLast={index === sortedFields.length - 1}
              onEdit={onEditField}
              onDelete={onDeleteField}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
            />
          ))}
        </div>
      ) : (
        // Desktop view - table
        <>
          <div className="field-list__header">
            <div className="field-list__col field-list__col--name">Field Name</div>
            <div className="field-list__col field-list__col--type">Type</div>
            <div className="field-list__col field-list__col--required">Required</div>
            <div className="field-list__col field-list__col--show-in-table">Show in table</div>
            <div className="field-list__col field-list__col--actions">Actions</div>
          </div>
          <div className="field-list__items">
            {sortedFields.map((field, index) => (
              <FieldListItem
                key={field.id}
                field={field}
                isFirst={index === 0}
                isLast={index === sortedFields.length - 1}
                onEdit={onEditField}
                onDelete={onDeleteField}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FieldList;
