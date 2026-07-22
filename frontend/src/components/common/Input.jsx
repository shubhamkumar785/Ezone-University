import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`ez-input-group ${className}`}>
      {label && <label className="ez-input-label">{label}</label>}
      <input
        ref={ref}
        className={`ez-input-field ${error ? 'ez-input-error' : ''}`}
        {...props}
      />
      {error && <span className="ez-error-msg">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
