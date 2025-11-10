// LoadingSpinner Component
// Centered loading spinner for async content loading

import './LoadingSpinner.scss';

export interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }: LoadingSpinnerProps) => {
  return (
    <div className={`loading-spinner ${fullScreen ? 'loading-spinner--fullscreen' : ''}`}>
      <div className="loading-spinner__content">
        <div className="loading-spinner__icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="80 50"
              className="loading-spinner__circle"
            />
          </svg>
        </div>
        {message && <p className="loading-spinner__message">{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
