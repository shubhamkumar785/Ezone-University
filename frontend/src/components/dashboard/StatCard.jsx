import React, { memo } from 'react';
import Card from '../common/Card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, trend, trendType, subtitle, progress, loading }) => {
  if (loading) {
    return (
      <Card className="ez-stat-card skeleton-card">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-val"></div>
        <div className="skeleton-line skeleton-foot"></div>
      </Card>
    );
  }

  const getTrendClass = () => {
    switch (trendType) {
      case 'up':
        return 'trend-up';
      case 'down':
        return 'trend-down';
      default:
        return 'trend-neutral';
    }
  };

  const getTrendIcon = () => {
    switch (trendType) {
      case 'up':
        return <ArrowUpRight size={14} className="stat-trend-icon" />;
      case 'down':
        return <ArrowDownRight size={14} className="stat-trend-icon" />;
      default:
        return <Minus size={14} className="stat-trend-icon" />;
    }
  };

  const getIconClass = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('student')) return 'icon-purple';
    if (lowerTitle.includes('faculty') || lowerTitle.includes('attendance')) return 'icon-green';
    if (lowerTitle.includes('course')) return 'icon-blue';
    if (lowerTitle.includes('department')) return 'icon-pink';
    if (lowerTitle.includes('fee')) return 'icon-green';
    if (lowerTitle.includes('leave')) return 'icon-yellow';
    if (lowerTitle.includes('alert')) return 'icon-red';
    return 'icon-purple';
  };

  return (
    <Card className="ez-stat-card">
      <div className="stat-card-header">
        <span className="stat-card-label">{title}</span>
        <div className={`stat-card-icon-wrapper ${getIconClass()}`}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-footer">
        {trend && (
          <span className={`stat-card-trend ${getTrendClass()}`}>
            {getTrendIcon()}
            <span>{trend}</span>
          </span>
        )}
        {subtitle && (
          <span className="stat-card-subtitle">
            {subtitle}
          </span>
        )}
      </div>
      {progress !== undefined && (
        <div className="stat-card-progress-wrapper">
          <div className="stat-card-progress-info">
            <span className="stat-card-progress-label">Progress</span>
            <span className="stat-card-progress-val">{progress}%</span>
          </div>
          <div className="stat-card-progress-bar-bg">
            <div 
              className={`stat-card-progress-bar-fill ${title.toLowerCase().includes('fee') ? 'purple' : ''}`} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default memo(StatCard);
