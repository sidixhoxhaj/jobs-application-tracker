// Note Item Component
// Individual note display with edit and delete functionality

import { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { updateNote, deleteNote } from '../../../redux/slices/applicationsSlice';
import { Note } from '../../../types';
import Button from '../../common/Button/Button';
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog';
import { formatDateShort } from '../../../utils/date';
import './NoteItem.scss';

interface NoteItemProps {
  note: Note;
  applicationId: string;
  isFirst: boolean;
  isLast: boolean;
}

const NoteItem = ({ note, applicationId, isFirst, isLast }: NoteItemProps) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isEdited = note.createdAt !== note.updatedAt;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(note.content);
  };

  const handleSave = () => {
    if (editedContent.trim() && editedContent !== note.content) {
      dispatch(updateNote({
        applicationId,
        noteId: note.id,
        content: editedContent.trim(),
      }));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(note.content);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteNote({ applicationId, noteId: note.id }));
    setIsDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className={`note-item ${isFirst ? 'note-item--first' : ''} ${isLast ? 'note-item--last' : ''}`}>
        {/* Timeline connector */}
        <div className="note-item__timeline">
          <div className="note-item__dot" />
          {!isLast && <div className="note-item__line" />}
        </div>

        {/* Note content */}
        <div className="note-item__content">
          <div className="note-item__header">
            <div className="note-item__meta">
              <span className="note-item__date">{formatDateShort(note.createdAt)}</span>
              <span className="note-item__time">{formatTime(note.createdAt)}</span>
              {isEdited && (
                <span className="note-item__edited" title={`Last edited ${formatDateShort(note.updatedAt || note.createdAt)}`}>
                  (edited)
                </span>
              )}
            </div>
            {!isEditing && (
              <div className="note-item__actions">
                <button
                  className="note-item__action-btn"
                  onClick={handleEdit}
                  title="Edit note"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M11.3333 2.00004C11.5084 1.82494 11.7163 1.68605 11.9451 1.5916C12.1739 1.49715 12.4191 1.44879 12.6666 1.44879C12.9142 1.44879 13.1594 1.49715 13.3882 1.5916C13.617 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.383 14.4084 2.61178C14.5029 2.84055 14.5512 3.08575 14.5512 3.33337C14.5512 3.58099 14.5029 3.82619 14.4084 4.05497C14.314 4.28374 14.1751 4.49161 14 4.66671L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  className="note-item__action-btn note-item__action-btn--danger"
                  onClick={handleDelete}
                  title="Delete note"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4H3.33333H14M5.33333 4V2.66667C5.33333 2.31304 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31304 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31304 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="note-item__edit-form">
              <textarea
                className="note-item__textarea"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={3}
                autoFocus
              />
              <div className="note-item__edit-actions">
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="small"
                  onClick={handleSave}
                  disabled={!editedContent.trim() || editedContent === note.content}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="note-item__text">{note.content}</div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};

export default NoteItem;
