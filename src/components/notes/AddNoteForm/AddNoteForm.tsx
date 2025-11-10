// Add Note Form Component
// Form for adding new notes to job applications

import { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { addNote } from '../../../redux/slices/applicationsSlice';
import { Button } from '../../common';
import './AddNoteForm.scss';

interface AddNoteFormProps {
  applicationId: string;
}

const AddNoteForm = ({ applicationId }: AddNoteFormProps) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!content.trim()) {
      setError('Note content is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create note object
      const newNote = {
        id: `note-${Date.now()}`,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Dispatch add note action
      dispatch(addNote({ applicationId, note: newNote }));

      // Reset form
      setContent('');
    } catch (err) {
      setError('Failed to add note. Please try again.');
      console.error('Error adding note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <form className="add-note-form" onSubmit={handleSubmit}>
      <div className="add-note-form__field">
        <label htmlFor="note-content" className="add-note-form__label">
          Add a Note
        </label>
        <textarea
          id="note-content"
          className={`add-note-form__textarea ${error ? 'add-note-form__textarea--error' : ''}`}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type your note here... (Ctrl+Enter to submit)"
          rows={4}
          disabled={isSubmitting}
        />
        {error && <p className="add-note-form__error">{error}</p>}
        <p className="add-note-form__hint">
          Press Ctrl+Enter (Cmd+Enter on Mac) to quickly add your note
        </p>
      </div>

      <div className="add-note-form__actions">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          size="small"
        >
          {isSubmitting ? 'Adding...' : 'Add Note'}
        </Button>
      </div>
    </form>
  );
};

export default AddNoteForm;
