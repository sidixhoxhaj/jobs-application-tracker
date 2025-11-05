// Application Type Definition
// Represents a job application with dynamic field data and notes

import { Note } from './note';

export interface Application {
  id: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  data: Record<string, any>; // Dynamic fields based on custom field configuration
  notes: Note[];
}
