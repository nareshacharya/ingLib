import React from 'react';
import type { IconName } from './iconTypes';
import { icons } from './iconConstants';

export interface IconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export const Icon: React.FC<IconProps> = ({ name, size = 'md', className = '' }) => {
  const iconSvg = icons[name];
  
  if (!iconSvg) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const sizeClass = sizeClasses[size];
  const combinedClassName = `${sizeClass} ${className}`.trim();

  return (
    <span
      className={`${combinedClassName} text-current`}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
      role="img"
      aria-label={name}
    />
  );
};