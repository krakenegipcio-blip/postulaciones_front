interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
  className?: string;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) };
}

function isLight(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  return luminance > 128;
}

export default function Badge({ label, color = '#6b7280', size = 'sm', className = '' }: BadgeProps) {
  const textColor = isLight(color) ? '#1f2937' : '#f9fafb';
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${className}`}
      style={{ backgroundColor: color, color: textColor }}
    >
      {label}
    </span>
  );
}
