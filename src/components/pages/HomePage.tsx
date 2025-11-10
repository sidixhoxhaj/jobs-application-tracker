// HomePage Component
// Landing page for unauthenticated users with hero image and CTAs

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button/Button';
import { SignInModal } from '../auth/SignInModal/SignInModal';
import './HomePage.scss';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleExploreDemoClick = async () => {
    // Import loadDemoData dynamically to avoid circular dependencies
    const { loadDemoData } = await import('../../data/demoData');

    // Load demo data into localStorage
    loadDemoData();

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleSignInClick = () => {
    setShowSignInModal(true);
  };

  return (
    <div className="home-page">
      <div className="home-page__container">
        <div className="home-page__image">
          <img
            src="/homepage.jpg"
            alt="Job Application Tracker Dashboard"
            loading="lazy"
          />
        </div>

        <div className="home-page__content">
          <h1 className="home-page__title">Job Application Tracker</h1>

          <h2 className="home-page__subtitle">
            Organize your job search, track applications, and land your dream job
          </h2>

          <div className="home-page__description">
            <p>
              A powerful yet simple tool to manage your job search journey:
            </p>
            <ul className="home-page__features">
              <li>Track all your applications in one place</li>
              <li>Customize fields to match your workflow</li>
              <li>Visualize your progress with interactive charts</li>
              <li>Add notes and track interview details</li>
              <li>Works offline with local storage</li>
              <li>Sign in to sync across devices</li>
            </ul>
          </div>

          <div className="home-page__actions">
            <Button
              variant="primary"
              size="large"
              onClick={handleSignInClick}
            >
              Sign In
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={handleExploreDemoClick}
            >
              Explore Demo
            </Button>
          </div>
        </div>
      </div>

      {showSignInModal && (
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
