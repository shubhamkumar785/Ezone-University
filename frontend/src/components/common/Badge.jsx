import React from 'react';

const Badge = ({ children, variant = 'info', className = '', ...props }) => {
  return (
    <span 
      className={`ez-badge ez-badge-${variant} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
