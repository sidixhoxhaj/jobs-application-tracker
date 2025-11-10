import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import { useAppDispatch } from './redux/hooks';
import { fetchApplications } from './redux/slices/applicationsSlice';
import { fetchCustomFields } from './redux/slices/customFieldsSlice';
import { fetchPreferences } from './redux/slices/preferencesSlice';
import { fetchChartConfigs } from './redux/slices/chartConfigsSlice';
import {
  isFirstVisit,
  loadDemoData,
  startFromScratch,
} from './services/dataService';
import { WelcomeModal, LoadingSpinner } from './components/common';
import { DemoBanner } from './components/common/DemoBanner/DemoBanner';
import Navigation from './components/layout/Navigation';
import { useAuth } from './context/AuthContext';

// Lazy load route components for code splitting
const HomePage = lazy(() => import('./components/pages/HomePage'));
const DashboardPage = lazy(() => import('./components/pages/DashboardPage'));
const CustomFieldsPage = lazy(() => import('./components/pages/CustomFieldsPage'));
const StatisticsPage = lazy(() => import('./components/pages/StatisticsPage'));

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();

  // Welcome modal state
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data when app mounts or auth state changes
  useEffect(() => {
    const loadData = async () => {
      // Check for first visit (not on homepage)
      if (location.pathname !== '/') {
        const firstVisit = await isFirstVisit();
        if (firstVisit) {
          setShowWelcomeModal(true);
          setDataLoaded(true);
          return;
        }
      }

      // Load data from appropriate source (Supabase or localStorage)
      try {
        await Promise.all([
          dispatch(fetchApplications()),
          dispatch(fetchCustomFields()),
          dispatch(fetchPreferences()),
          dispatch(fetchChartConfigs()),
        ]);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
        setDataLoaded(true);
      }
    };

    if (!authLoading) {
      loadData();
    }
  }, [dispatch, isAuthenticated, authLoading, location.pathname]);

  // Handle user choice: Start from scratch
  const handleStartFromScratch = async () => {
    if (!isAuthenticated) {
      // Demo mode - use localStorage
      startFromScratch();
    }
    // For authenticated users, just close modal (they'll start with empty data)
    setShowWelcomeModal(false);

    // Reload data from appropriate source
    try {
      await Promise.all([
        dispatch(fetchApplications()),
        dispatch(fetchCustomFields()),
        dispatch(fetchPreferences()),
        dispatch(fetchChartConfigs()),
      ]);
    } catch (error) {
      console.error('Error loading data after start from scratch:', error);
    }
  };

  // Handle user choice: Use demo data
  const handleUseDemoData = async () => {
    // Load demo data (routes to Supabase if authenticated, localStorage if not)
    await loadDemoData();
    setShowWelcomeModal(false);

    // Reload demo data from appropriate source
    try {
      await Promise.all([
        dispatch(fetchApplications()),
        dispatch(fetchCustomFields()),
        dispatch(fetchPreferences()),
        dispatch(fetchChartConfigs()),
      ]);
    } catch (error) {
      console.error('Error loading demo data:', error);
    }
  };

  // Show loading spinner while auth is initializing or data is loading
  if (authLoading || !dataLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {location.pathname !== '/' && (
        <WelcomeModal
          isOpen={showWelcomeModal}
          onStartFromScratch={handleStartFromScratch}
          onUseDemoData={handleUseDemoData}
        />
      )}

      <Navigation />

      {location.pathname !== '/' && (
        <DemoBanner />
      )}
      
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />
            }
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/custom-fields" element={<CustomFieldsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
