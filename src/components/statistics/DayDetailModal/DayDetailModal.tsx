// DayDetailModal Component
// Shows list of applications for a selected day from the chart

import Modal from '../../common/Modal/Modal';
import { Application } from '../../../types/application';
import { CustomField } from '../../../types/customField';
import { formatDateFull } from '../../../utils/date';
import './DayDetailModal.scss';

export interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string; // YYYY-MM-DD format
  applications: Application[];
  customFields: CustomField[];
  onApplicationClick?: (application: Application) => void;
}

const DayDetailModal = ({
  isOpen,
  onClose,
  date,
  applications,
  customFields,
  onApplicationClick,
}: DayDetailModalProps) => {
  // Get field value by field name
  const getFieldValue = (application: Application, fieldName: string): string => {
    const field = customFields.find(
      (f) => f.name.toLowerCase().includes(fieldName.toLowerCase())
    );

    if (!field) return 'N/A';

    const value = application.data[field.id];

    // Handle select fields - show label instead of value
    if (field.type === 'select' && field.options) {
      const option = field.options.find((opt) => opt.value === value);
      return option ? option.label : value || 'N/A';
    }

    return value || 'N/A';
  };

  const handleApplicationClick = (application: Application) => {
    if (onApplicationClick) {
      onApplicationClick(application);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Applications on ${formatDateFull(date)}`}>
      <div className="day-detail-modal">
        <div className="day-detail-modal__header">
          <p className="day-detail-modal__count">
            {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="day-detail-modal__empty">
            <p>No applications found for this day.</p>
          </div>
        ) : (
          <div className="day-detail-modal__list">
            {applications.map((application) => {
              const companyName = getFieldValue(application, 'company');
              const jobPosition = getFieldValue(application, 'position');
              const status = getFieldValue(application, 'status');

              return (
                <div
                  key={application.id}
                  className="day-detail-modal__item"
                  onClick={() => handleApplicationClick(application)}
                >
                  <div className="day-detail-modal__item-header">
                    <h4 className="day-detail-modal__company">{companyName}</h4>
                    <span className="day-detail-modal__status">{status}</span>
                  </div>
                  <p className="day-detail-modal__position">{jobPosition}</p>
                  <p className="day-detail-modal__hint">Click to view full details</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DayDetailModal;
