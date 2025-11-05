// Note Type Definition
// Represents a note/comment attached to a job application

export interface Note {
  id: string;
  content: string;
  createdAt: string; // ISO 8601 date string
  updatedAt?: string; // ISO 8601 date string (optional, for edited notes)
}
