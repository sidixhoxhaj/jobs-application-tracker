// TableFilters Component
// Search and filter controls for the applications table

import { CustomField } from '../../../types';
import { Input, Dropdown, Button } from '../../common';
import './TableFilters.scss';

export interface FilterState {
  [fieldId: string]: string;
}

export interface TableFiltersProps {
  fields: CustomField[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterState;
  onFilterChange: (fieldId: string, value: string) => void;
  onClearFilters: () => void;
}

const TableFilters = ({
  fields,
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
}: TableFiltersProps) => {
  // Get only select-type fields for filtering
  const selectFields = fields.filter((field) => field.type === 'select');

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== ''
  ).length;

  const hasActiveFilters = searchQuery || activeFilterCount > 0;

  return (
    <div className="table-filters">
      <div className="table-filters__search">
        <Input
          type="text"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
        />
      </div>

      {hasActiveFilters && (
        <div className="table-filters__actions">
          <Button variant="secondary" size="small" onClick={onClearFilters}>
            Clear Filters
            {activeFilterCount > 0 && (
              <span className="table-filters__badge">{activeFilterCount}</span>
            )}
          </Button>
        </div>
      )}

      {selectFields.length > 0 && (
        <div className="table-filters__dropdowns">
          {selectFields.map((field) => (
            <Dropdown
              key={field.id}
              options={[
                { value: '', label: `All ${field.name}` },
                ...(field.options || []),
              ]}
              value={filters[field.id] || ''}
              onChange={(value) => onFilterChange(field.id, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TableFilters;
