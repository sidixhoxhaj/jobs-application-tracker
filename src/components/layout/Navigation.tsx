// Navigation Component
// Main navigation bar with logo, links, and dark mode toggle

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle, Button } from '../common';
import { SignInModal } from '../auth/SignInModal/SignInModal';
import { useAuth } from '../../context/AuthContext';
import useMediaQuery from '../../hooks/useMediaQuery';
import './Navigation.scss';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { user, signOut, loading, isAuthenticated } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    closeMobileMenu();
  };

  const handleSignInClick = () => {
    setShowSignInModal(true);
    closeMobileMenu();
  };

  return (
    <nav className="navigation">
      <div className="navigation__container">
        {/* Logo/App Name */}
        <div className="navigation__brand">
          <h1 className="navigation__title">Job Tracker</h1>
        </div>

        {/* Desktop Navigation Links */}
        <div className="navigation__links navigation__links--desktop">
          {!isAuthenticated && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
              }
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
          )}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
            }
            onClick={closeMobileMenu}
          >
            Dashboard{!isAuthenticated && <sup className="navigation__demo-badge">demo</sup>}
          </NavLink>
          <NavLink
            to="/custom-fields"
            className={({ isActive }) =>
              isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
            }
            onClick={closeMobileMenu}
          >
            Custom Fields{!isAuthenticated && <sup className="navigation__demo-badge">demo</sup>}
          </NavLink>
          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
            }
            onClick={closeMobileMenu}
          >
            Statistics{!isAuthenticated && <sup className="navigation__demo-badge">demo</sup>}
          </NavLink>
        </div>

        {/* Desktop Actions */}
        <div className="navigation__actions navigation__actions--desktop">
          {!loading && (
            <>
              {user ? (
                <div className="navigation__user">
                  <span className="navigation__user-email">{user.email}</span>
                  <Button
                    onClick={handleSignOut}
                    variant="secondary"
                    size="small"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleSignInClick}
                  variant="primary"
                  size="small"
                >
                  Sign In
                </Button>
              )}
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Actions */}
        {isMobile && (
          <div className="navigation__actions navigation__actions--mobile">
            <ThemeToggle />
            <button
              className={`navigation__mobile-toggle ${isMobileMenuOpen ? 'navigation__mobile-toggle--open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <span className="navigation__hamburger-line"></span>
              <span className="navigation__hamburger-line"></span>
              <span className="navigation__hamburger-line"></span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="navigation__mobile-menu">
          <div className="navigation__mobile-menu-content">
            {/* Mobile Navigation Links */}
            <div className="navigation__links navigation__links--mobile">
              {!isAuthenticated && (
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
                  }
                  onClick={closeMobileMenu}
                >
                  Home
                </NavLink>
              )}
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
                }
                onClick={closeMobileMenu}
              >
                Dashboard{!isAuthenticated && <sup className="navigation__demo-badge">demo</sup>}
              </NavLink>
              <NavLink
                to="/custom-fields"
                className={({ isActive }) =>
                  isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
                }
                onClick={closeMobileMenu}
              >
                Custom Fields{!isAuthenticated && <sup className="navigation__demo-badge">demo</sup>}
              </NavLink>
              <NavLink
                to="/statistics"
                className={({ isActive }) =>
                  isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
                }
                onClick={closeMobileMenu}
              >
                Statistics{!isAuthenticated && <sup className="navigation__demo-badge">demo</sup>}
              </NavLink>
            </div>

            {/* Mobile Auth Actions */}
            {!loading && (
              <div className="navigation__mobile-auth">
                {user ? (
                  <>
                    <div className="navigation__mobile-user-email">{user.email}</div>
                    <Button
                      onClick={handleSignOut}
                      variant="secondary"
                      fullWidth
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleSignInClick}
                    variant="primary"
                    fullWidth
                  >
                    Sign In
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </nav>
  );
};

export default Navigation;
