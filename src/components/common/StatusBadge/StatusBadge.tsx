// StatusBadge Component
// Displays status with colored background

import './StatusBadge.scss';

export interface StatusBadgeProps {
  label: string;
  color?: string; // Hex color code
  size?: 'small' | 'medium';
}

const StatusBadge = ({ label, color, size = 'medium' }: StatusBadgeProps) => {
  // Helper function to determine if a color is light or dark
  const isLightColor = (hexColor: string): boolean => {
    if (!hexColor) return false;

    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5;
  };

  const badgeStyle = color
    ? {
        backgroundColor: color,
        color: isLightColor(color) ? '#000000' : '#FFFFFF',
      }
    : undefined;

  const badgeClasses = [
    'status-badge',
    `status-badge--${size}`,
    !color && 'status-badge--default',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClasses} style={badgeStyle}>
      {label}
    </span>
  );
};

export default StatusBadge;
