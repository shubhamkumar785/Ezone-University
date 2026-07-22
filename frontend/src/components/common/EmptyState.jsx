import React from 'react';
import Card from './Card';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No data available', message = 'There are no records to display at this time.' }) => {
  return (
    <Card className="ez-empty-state-card">
      <div className="empty-state-icon-wrapper">
        <Inbox size={48} className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{message}</p>
    </Card>
  );
};

export default EmptyState;
