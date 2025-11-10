// TableHeader Component
// Renders table column headers with sorting functionality

import { CustomField } from '../../../types';
import './TableHeader.scss';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  fieldId: string;
  direction: SortDirection;
}

export interface TableHeaderProps {
  fields: CustomField[];
  sortConfig: SortConfig | null;
  onSort: (fieldId: string) => void;
}

const TableHeader = ({ fields, sortConfig, onSort }: TableHeaderProps) => {
  const getSortIcon = (fieldId: string) => {
    if (sortConfig?.fieldId !== fieldId) {
      return (
        <svg
          className="table-header__sort-icon table-header__sort-icon--inactive"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 3L8 13M8 3L11 6M8 3L5 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (sortConfig.direction === 'asc') {
      return (
        <svg
          className="table-header__sort-icon table-header__sort-icon--asc"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 3L8 13M8 3L11 6M8 3L5 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    return (
      <svg
        className="table-header__sort-icon table-header__sort-icon--desc"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 13L8 3M8 13L5 10M8 13L11 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  // Filter to only show fields that should be visible in table
  const visibleFields = fields.filter(field => field.showInTable);

  return (
    <thead className="table-header">
      <tr className="table-header__row">
        {visibleFields.map((field) => {
          const isActive = sortConfig?.fieldId === field.id;
          const headerClasses = [
            'table-header__cell',
            isActive && 'table-header__cell--active',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <th key={field.id} className={headerClasses}>
              <button
                type="button"
                className="table-header__button"
                onClick={() => onSort(field.id)}
                aria-label={`Sort by ${field.name}`}
              >
                <span>{field.name}</span>
                {getSortIcon(field.id)}
              </button>
            </th>
          );
        })}
        <th className="table-header__cell table-header__cell--actions">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
