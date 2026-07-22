import React from 'react';
import Card from './Card';
import Button from './Button';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ 
  title = 'Failed to load data', 
  message = 'An error occurred while fetching information. Please verify your connection and try again.', 
  onRetry 
}) => {
  return (
    <Card className="ez-error-state-card">
      <div className="error-state-icon-wrapper">
        <AlertCircle size={48} className="error-state-icon" />
      </div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-description">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" className="error-state-retry-btn">
          Retry Connection
        </Button>
      )}
    </Card>
  );
};

export default ErrorState;
