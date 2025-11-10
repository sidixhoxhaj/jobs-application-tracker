// ModalFooter Component
// Reusable footer for modals with action buttons

import { ReactNode } from 'react';
import './ModalFooter.scss';

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

const ModalFooter = ({ children, className = '' }: ModalFooterProps) => {
  const footerClass = `modal-footer ${className}`.trim();

  return <div className={footerClass}>{children}</div>;
};

export default ModalFooter;
