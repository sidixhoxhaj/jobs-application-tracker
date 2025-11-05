import { Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch } from './redux/hooks';
import { setApplications } from './redux/slices/applicationsSlice';
import { setFields } from './redux/slices/customFieldsSlice';
import { setPreferences } from './redux/slices/preferencesSlice';
import { loadApplications, loadCustomFields, loadPreferences, initializeDefaultData } from './services/localStorageService';
import DashboardPage from './components/pages/DashboardPage';
import CustomFieldsPage from './components/pages/CustomFieldsPage';
import StatisticsPage from './components/pages/StatisticsPage';

function App() {
  const dispatch = useAppDispatch();

  // Load data from localStorage on app start
  useEffect(() => {
    initializeDefaultData();
    dispatch(setApplications(loadApplications()));
    dispatch(setFields(loadCustomFields()));
    dispatch(setPreferences(loadPreferences()));
  }, [dispatch]);

  return (
    <div>
      {/* Temporary navigation - will be replaced with proper Navigation component later */}
      <nav style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid #E5E5E5',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Job Tracker</h2>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ fontSize: '0.875rem' }}>Dashboard</Link>
          <Link to="/custom-fields" style={{ fontSize: '0.875rem' }}>Custom Fields</Link>
          <Link to="/statistics" style={{ fontSize: '0.875rem' }}>Statistics</Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/custom-fields" element={<CustomFieldsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Routes>
    </div>
  );
}

export default App;
