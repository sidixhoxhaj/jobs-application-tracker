// Sign In Modal
// Email magic link authentication with Supabase

import { useState } from 'react';
import Modal from '../../common/Modal/Modal';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import { useAuth } from '../../../context/AuthContext';
import './SignInModal.scss';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email);

    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Failed to send magic link');
      return;
    }

    setSuccess(true);
  };

  const handleClose = () => {
    setEmail('');
    setError(null);
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign In">
      <div className="sign-in-modal">
        {!success ? (
          <form onSubmit={handleSubmit} className="sign-in-modal__form">
            <p className="sign-in-modal__description">
              Enter your email to receive a magic link. No password required!
            </p>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="you@example.com"
              disabled={loading}
              error={error || undefined}
              autoFocus
            />

            {error && <p className="sign-in-modal__error">{error}</p>}

            <div className="sign-in-modal__actions">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !email.trim()}
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="sign-in-modal__success">
            <div className="sign-in-modal__success-icon">✓</div>
            <h3 className="sign-in-modal__success-title">Check your email!</h3>
            <p className="sign-in-modal__success-message">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className="sign-in-modal__success-note">
              Click the link in your email to sign in. You can close this window.
            </p>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
