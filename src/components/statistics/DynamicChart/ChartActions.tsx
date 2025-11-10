// Chart Actions Component
// Edit and Delete buttons for charts

interface ChartActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ChartActions = ({ onEdit, onDelete }: ChartActionsProps) => {
  return (
    <div className="chart-actions">
      <button
        type="button"
        className="chart-actions__button chart-actions__button--edit"
        onClick={onEdit}
        title="Edit chart"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M11.3333 2.00004C11.5084 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.419 1.44775 12.6666 1.44775C12.9143 1.44775 13.1598 1.49653 13.3885 1.59129C13.6172 1.68605 13.8248 1.82494 14 2.00004C14.1751 2.17513 14.314 2.38273 14.4087 2.61146C14.5035 2.84019 14.5523 3.08569 14.5523 3.33337C14.5523 3.58106 14.5035 3.82656 14.4087 4.05529C14.314 4.28402 14.1751 4.49162 14 4.66671L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00004Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className="chart-actions__button chart-actions__button--delete"
        onClick={onDelete}
        title="Delete chart"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 4H3.33333H14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.33334 4.00004V2.66671C5.33334 2.31309 5.47381 1.97395 5.72386 1.7239C5.97391 1.47385 6.31305 1.33337 6.66668 1.33337H9.33334C9.68697 1.33337 10.0261 1.47385 10.2762 1.7239C10.5262 1.97395 10.6667 2.31309 10.6667 2.66671V4.00004M12.6667 4.00004V13.3334C12.6667 13.687 12.5262 14.0262 12.2762 14.2762C12.0261 14.5263 11.687 14.6667 11.3333 14.6667H4.66668C4.31305 14.6667 3.97391 14.5263 3.72386 14.2762C3.47381 14.0262 3.33334 13.687 3.33334 13.3334V4.00004H12.6667Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChartActions;
