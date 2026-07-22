import React from 'react';

const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div 
      className={`ez-card ${className} ${onClick ? 'ez-card-clickable' : ''}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
