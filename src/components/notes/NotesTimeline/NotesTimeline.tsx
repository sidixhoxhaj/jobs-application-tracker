// Notes Timeline Component
// Displays a chronological list of notes

import { Note } from '../../../types';
import NoteItem from '../NoteItem/NoteItem';
import './NotesTimeline.scss';

interface NotesTimelineProps {
  applicationId: string;
  notes: Note[];
  sortOrder: 'newest' | 'oldest';
}

const NotesTimeline = ({ applicationId, notes, sortOrder }: NotesTimelineProps) => {
  // Sort notes based on sortOrder
  const sortedNotes = [...notes].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Empty state
  if (sortedNotes.length === 0) {
    return (
      <div className="notes-timeline notes-timeline--empty">
        <div className="notes-timeline__empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="notes-timeline__empty-icon">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="notes-timeline__empty-text">No notes yet</p>
          <p className="notes-timeline__empty-subtext">Add your first note using the form above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-timeline">
      <div className="notes-timeline__list">
        {sortedNotes.map((note, index) => (
          <NoteItem
            key={note.id}
            note={note}
            applicationId={applicationId}
            isFirst={index === 0}
            isLast={index === sortedNotes.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesTimeline;
