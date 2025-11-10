// ApplicationTable Component
// Main table component for displaying job applications

import { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { setDefaultPagination } from '../../../redux/slices/preferencesSlice';
import { Application } from '../../../types';
import { useDebounce } from '../../../hooks/useDebounce';
import useMediaQuery from '../../../hooks/useMediaQuery';
import TableHeader, { SortConfig } from './TableHeader';
import TableRow from './TableRow';
import ExpandableTableRow from '../ExpandableTableRow/ExpandableTableRow';
import TableFilters, { FilterState } from '../TableFilters/TableFilters';
import TablePagination from '../TablePagination/TablePagination';
import './ApplicationTable.scss';

export interface ApplicationTableProps {
  onView: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  onViewNotes: (application: Application) => void;
}

const ApplicationTable = ({
  onView,
  onEdit,
  onDelete,
  onViewNotes,
}: ApplicationTableProps) => {
  const dispatch = useAppDispatch();
  const applications = useAppSelector((state) => state.applications.items);
  const fields = useAppSelector((state) => state.customFields.fields);
  const defaultPageSize = useAppSelector((state) => state.preferences.defaultPagination);

  const isMobile = useMediaQuery('(max-width: 767px)');

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Sort fields by order
  const sortedFields = useMemo(() => {
    return [...fields].sort((a, b) => a.order - b.order);
  }, [fields]);

  // Handle sort
  const handleSort = (fieldId: string) => {
    setSortConfig((prevConfig) => {
      // If clicking the same column, toggle direction
      if (prevConfig?.fieldId === fieldId) {
        if (prevConfig.direction === 'asc') {
          return { fieldId, direction: 'desc' };
        }
        if (prevConfig.direction === 'desc') {
          return null; // Reset sort
        }
      }
      // New column - start with ascending
      return { fieldId, direction: 'asc' };
    });
  };

  // Filter and search applications
  const filteredApplications = useMemo(() => {
    let result = [...applications];

    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter((app) => {
        // Search across all field values
        return Object.values(app.data).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });
    }

    // Apply field filters
    Object.entries(filters).forEach(([fieldId, filterValue]) => {
      if (filterValue) {
        result = result.filter((app) => app.data[fieldId] === filterValue);
      }
    });

    return result;
  }, [applications, debouncedSearchQuery, filters]);

  // Sort applications based on sortConfig
  const sortedApplications = useMemo(() => {
    if (!sortConfig) {
      return filteredApplications;
    }

    const { fieldId, direction } = sortConfig;

    return [...filteredApplications].sort((a, b) => {
      const aValue = a.data[fieldId];
      const bValue = b.data[fieldId];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Get field type
      const field = fields.find((f) => f.id === fieldId);

      // Number comparison
      if (field?.type === 'number') {
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Date comparison
      if (field?.type === 'date') {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return direction === 'asc' ? aDate - bDate : bDate - aDate;
      }

      // String comparison (default)
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredApplications, sortConfig, fields]);

  // Handlers
  const handleFilterChange = (fieldId: string, value: string) => {
    setFilters((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({});
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    // Save to Redux preferences
    dispatch(setDefaultPagination(size));
  };

  // Paginate the sorted applications
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedApplications.slice(startIndex, endIndex);
  }, [sortedApplications, currentPage, pageSize]);

  // Empty state
  if (applications.length === 0) {
    return (
      <div className="application-table application-table--empty">
        <div className="application-table__empty-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="8"
              y="16"
              width="48"
              height="40"
              rx="4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="8"
              y1="24"
              x2="56"
              y2="24"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="16"
              y1="32"
              x2="32"
              y2="32"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="16"
              y1="40"
              x2="40"
              y2="40"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="16"
              y1="48"
              x2="28"
              y2="48"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h3>No applications yet</h3>
          <p>Click "Add Application" to create your first job application entry.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TableFilters
        fields={sortedFields}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <div className="application-table">
        {sortedApplications.length === 0 ? (
          <div className="application-table__empty-state">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="8"
                y="16"
                width="48"
                height="40"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="8"
                y1="24"
                x2="56"
                y2="24"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="16"
                y1="32"
                x2="32"
                y2="32"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="16"
                y1="40"
                x2="40"
                y2="40"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="16"
                y1="48"
                x2="28"
                y2="48"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <h3>No matching applications</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : isMobile ? (
          // Mobile view - expandable rows
          <div className="application-table__mobile-container">
            {paginatedApplications.map((application) => (
              <ExpandableTableRow
                key={application.id}
                application={application}
                fields={sortedFields}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewNotes={onViewNotes}
              />
            ))}

            <TablePagination
              currentPage={currentPage}
              totalItems={sortedApplications.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        ) : (
          // Desktop view - table
          <div className="application-table__container">
            <table className="application-table__table">
              <TableHeader
                fields={sortedFields}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <tbody>
                {paginatedApplications.map((application) => (
                  <TableRow
                    key={application.id}
                    application={application}
                    fields={sortedFields}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewNotes={onViewNotes}
                  />
                ))}
              </tbody>
            </table>

            <TablePagination
              currentPage={currentPage}
              totalItems={sortedApplications.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ApplicationTable;
