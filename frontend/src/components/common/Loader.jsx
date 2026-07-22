import React from 'react';

const Loader = ({ className = '' }) => {
  return (
    <div className={`ez-loader ${className}`}></div>
  );
};

export default Loader;
