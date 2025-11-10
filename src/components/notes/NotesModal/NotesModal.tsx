// Notes Modal Component
// Displays notes timeline for a specific job application

import { useState } from 'react';
import { Application } from '../../../types';
import { useAppSelector } from '../../../redux/hooks';
import Modal from '../../common/Modal/Modal';
import NotesTimeline from '../NotesTimeline/NotesTimeline';
import AddNoteForm from '../AddNoteForm/AddNoteForm';
import './NotesModal.scss';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
}

const NotesModal = ({ isOpen, onClose, application }: NotesModalProps) => {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Get the latest application data from Redux store
  const currentApplication = useAppSelector((state) => 
    state.applications.items.find(app => app.id === application.id)
  ) || application;

  // Get company name and position from application data
  const companyName = currentApplication.data['field_company'] || currentApplication.data['companyName'] || 'Unknown Company';
  const position = currentApplication.data['field_position'] || currentApplication.data['jobPosition'] || 'Unknown Position';

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="notes-modal">
      <div className="notes-modal__content">
        {/* Header */}
        <div className="notes-modal__header">
          <div className="notes-modal__title-section">
            <h2 className="notes-modal__title">Notes</h2>
            <p className="notes-modal__subtitle">
              {companyName} - {position}
            </p>
          </div>
          <button
            className="notes-modal__sort-button"
            onClick={handleSortToggle}
            title={`Sort ${sortOrder === 'newest' ? 'oldest' : 'newest'} first`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {sortOrder === 'newest' ? (
                <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M8 4V12M8 12L12 8M8 12L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        {/* Add Note Form */}
        <AddNoteForm applicationId={currentApplication.id} />

        {/* Notes Timeline */}
        <NotesTimeline
          applicationId={currentApplication.id}
          notes={currentApplication.notes}
          sortOrder={sortOrder}
        />
      </div>
    </Modal>
  );
};

export default NotesModal;
