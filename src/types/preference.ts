// User Preference Type Definition
// Represents user settings and preferences

export type Theme = 'light' | 'dark';

export interface UserPreference {
  theme: Theme;
  defaultPagination: number; // 20, 40, or 60
}
