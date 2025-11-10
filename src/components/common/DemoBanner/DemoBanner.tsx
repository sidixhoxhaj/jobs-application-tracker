// Demo Banner
// Shows when user is in demo mode (not authenticated)
// Informs about local storage and encourages sign-in for sync

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import './DemoBanner.scss';

export const DemoBanner: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Don't show if authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="demo-banner">
      <div className="demo-banner__content">
        <div className="demo-banner__text">
          <strong>Demo Mode</strong> You're currently Creating/Viewing/Updating/Deleting with sample data stored locally in your browser. 
          Sign in to create your personal application tracker and sync your data across all devices.
        </div>
      </div>
    </div>
  );
};

