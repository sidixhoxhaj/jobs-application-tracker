// Application View Modal Component
// Displays all application details in read-only mode with notes timeline

import { Application } from '../../../types';
import { useAppSelector } from '../../../redux/hooks';
import Modal from '../../common/Modal/Modal';
import { StatusBadge } from '../../common';
import NotesTimeline from '../../notes/NotesTimeline/NotesTimeline';
import { formatDateShort, formatDateTime } from '../../../utils/date';
import './ApplicationViewModal.scss';

interface ApplicationViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onEdit: (application: Application) => void;
}

const ApplicationViewModal = ({ isOpen, onClose, application, onEdit }: ApplicationViewModalProps) => {
  const customFields = useAppSelector((state) => state.customFields.fields);
  
  // Get the latest application data from Redux store
  const currentApplication = useAppSelector((state) => 
    state.applications.items.find(app => app.id === application.id)
  ) || application;

  // Get company name and position for header
  const companyName = currentApplication.data['companyName'] || 'Unknown Company';
  const position = currentApplication.data['jobPosition'] || 'Unknown Position';

  // Render field value based on type
  const renderFieldValue = (field: any) => {
    const value = currentApplication.data[field.id];

    if (value === undefined || value === null || value === '') {
      return <span className="application-view-modal__empty">—</span>;
    }

    // Select field - render as StatusBadge
    if (field.type === 'select' && field.options) {
      const option = field.options.find((opt: any) => opt.value === value);
      if (option) {
        return <StatusBadge label={option.label} color={option.color} size="medium" />;
      }
      return <span>{value}</span>;
    }

    // Date field
    if (field.type === 'date') {
      return <span>{formatDateShort(value)}</span>;
    }

    // Checkbox field
    if (field.type === 'checkbox') {
      return (
        <span className={`application-view-modal__checkbox ${value ? 'application-view-modal__checkbox--checked' : ''}`}>
          {value ? '✓ Yes' : '✗ No'}
        </span>
      );
    }

    // Textarea - preserve line breaks
    if (field.type === 'textarea') {
      return <p className="application-view-modal__textarea">{String(value)}</p>;
    }

    // Default - text, number
    return <span>{String(value)}</span>;
  };

  // Sort fields by order
  const sortedFields = [...customFields].sort((a, b) => a.order - b.order);

  // Separate fields for special layout
  const applicationDateField = sortedFields.find(f => f.id === 'applicationDate');
  const jobDescriptionField = sortedFields.find(f => f.id === 'jobDescription');
  const firstResponseField = sortedFields.find(f => f.id === 'firstResponseDate');
  const statusField = sortedFields.find(f => f.id === 'status');
  const specialFieldIds = ['applicationDate', 'status', 'firstResponseDate', 'jobDescription'];
  const regularFields = sortedFields.filter(f => !specialFieldIds.includes(f.id));

  const notesCount = currentApplication.notes.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large" className="application-view-modal">
      <div className="application-view-modal__container">
        {/* Header */}
        <div className="application-view-modal__header">
          <div className="application-view-modal__title-section">
            <h2 className="application-view-modal__title">{companyName}</h2>
            <p className="application-view-modal__subtitle">{position}</p>
          </div>
          <button
            className="application-view-modal__edit-btn"
            onClick={() => onEdit(currentApplication)}
            title="Edit application"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L2.66634 14L3.33301 11.3334L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit
          </button>
        </div>

        {/* Content */}
        <div className="application-view-modal__content">
          {/* First Row: Job Description (Full Width) */}
          {jobDescriptionField && (
            <div className="application-view-modal__field application-view-modal__field--full">
              <label className="application-view-modal__label">
                {jobDescriptionField.name}
                {jobDescriptionField.required && <span className="application-view-modal__required">*</span>}
              </label>
              <div className="application-view-modal__value">
                {renderFieldValue(jobDescriptionField)}
              </div>
            </div>
          )}

          {/* Second Row: Application Date, Status, First Response Date */}
          <div className="application-view-modal__fields">
            {applicationDateField && (
              <div className="application-view-modal__field">
                <label className="application-view-modal__label">
                  {applicationDateField.name}
                  {applicationDateField.required && <span className="application-view-modal__required">*</span>}
                </label>
                <div className="application-view-modal__value">
                  {renderFieldValue(applicationDateField)}
                </div>
              </div>
            )}
            {statusField && (
              <div className="application-view-modal__field">
                <label className="application-view-modal__label">
                  {statusField.name}
                  {statusField.required && <span className="application-view-modal__required">*</span>}
                </label>
                <div className="application-view-modal__value">
                  {renderFieldValue(statusField)}
                </div>
              </div>
            )}
            {firstResponseField && (
              <div className="application-view-modal__field">
                <label className="application-view-modal__label">
                  {firstResponseField.name}
                  {firstResponseField.required && <span className="application-view-modal__required">*</span>}
                </label>
                <div className="application-view-modal__value">
                  {renderFieldValue(firstResponseField)}
                </div>
              </div>
            )}
          </div>

          {/* Regular Fields Grid */}
          {regularFields.length > 0 && (
            <div className="application-view-modal__fields">
              {regularFields.map((field) => (
                <div key={field.id} className="application-view-modal__field">
                  <label className="application-view-modal__label">
                    {field.name}
                    {field.required && <span className="application-view-modal__required">*</span>}
                  </label>
                  <div className="application-view-modal__value">
                    {renderFieldValue(field)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Metadata Section */}
          <div className="application-view-modal__metadata">
            <div className="application-view-modal__meta-item">
              <span className="application-view-modal__meta-label">Created:</span>
              <span className="application-view-modal__meta-value">{formatDateTime(currentApplication.createdAt)}</span>
            </div>
            <div className="application-view-modal__meta-item">
              <span className="application-view-modal__meta-label">Last Updated:</span>
              <span className="application-view-modal__meta-value">{formatDateTime(currentApplication.updatedAt)}</span>
            </div>
            <div className="application-view-modal__meta-item">
              <span className="application-view-modal__meta-label">Application ID:</span>
              <span className="application-view-modal__meta-value application-view-modal__meta-value--mono">{currentApplication.id}</span>
            </div>
          </div>

          {/* Notes Section */}
          <div className="application-view-modal__notes-section">
            <div className="application-view-modal__notes-header">
              <h3 className="application-view-modal__notes-title">
                Notes
                {notesCount > 0 && (
                  <span className="application-view-modal__notes-count">{notesCount}</span>
                )}
              </h3>
            </div>
            <div className="application-view-modal__notes-timeline">
              <NotesTimeline
                applicationId={currentApplication.id}
                notes={currentApplication.notes}
                sortOrder="newest"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicationViewModal;
