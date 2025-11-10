// Welcome Modal Component
// Shows on first visit with options to start from scratch or use demo data

import { Button, Modal } from '../';
import './WelcomeModal.scss';

interface WelcomeModalProps {
  isOpen: boolean;
  onStartFromScratch: () => void;
  onUseDemoData: () => void;
}

const WelcomeModal = ({ isOpen, onStartFromScratch, onUseDemoData }: WelcomeModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="medium" className="welcome-modal">
      <div className="welcome-modal__container">
        <p className="welcome-modal__description">
          Get started by choosing how you'd like to begin your job search journey.
        </p>

        <div className="welcome-modal__options">
          <div className="welcome-modal__option" onClick={onStartFromScratch}>
            <div className="welcome-modal__option-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="welcome-modal__option-content">
              <h3 className="welcome-modal__option-title">Start from Scratch</h3>
              <p className="welcome-modal__option-description">
                Begin with an empty workspace and add your applications manually.
              </p>
            </div>
            <Button className="welcome-modal__option-button">Choose</Button>
          </div>

          <div className="welcome-modal__option" onClick={onUseDemoData}>
            <div className="welcome-modal__option-icon welcome-modal__option-icon--demo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="welcome-modal__option-content">
              <h3 className="welcome-modal__option-title">Try Demo Data</h3>
              <p className="welcome-modal__option-description">
                Explore the app with sample applications to see how it works.
              </p>
            </div>
            <Button className="welcome-modal__option-button" variant="primary">Choose</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
