import React, { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../../services/dashboardService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { RefreshCw, Activity, LogIn, Calendar, Clock, Award, PlusCircle, UserPlus, ShieldAlert } from 'lucide-react';

const ActivityLogsContent = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getRecentActivities(page - 1, itemsPerPage);
      setActivities(data.content || []);
      setTotalItems(data.totalElements || 0);
    } catch (err) {
      setError('Failed to load recent activity logs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const getActivityIcon = (title) => {
    const lowerTitle = (title || '').toLowerCase();
    if (lowerTitle.includes('login') && !lowerTitle.includes('failed')) return LogIn;
    if (lowerTitle.includes('failed login')) return ShieldAlert;
    if (lowerTitle.includes('attendance')) return Calendar;
    if (lowerTitle.includes('leave')) return Clock;
    if (lowerTitle.includes('grade')) return Award;
    if (lowerTitle.includes('course')) return PlusCircle;
    if (lowerTitle.includes('student')) return UserPlus;
    return Activity;
  };

  const getStatusBadgeVariant = (color) => {
    switch (color) {
      case 'green': return 'success';
      case 'yellow': return 'warning';
      case 'red': return 'danger';
      default: return 'neutral';
    }
  };

  if (error) {
    return <ErrorState onRetry={fetchActivities} message={error} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="dashboard-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
          System Activity Logs
        </h1>
        <Button onClick={fetchActivities} variant="secondary" disabled={loading}>
          <RefreshCw size={16} className={`refresh-icon-spin ${loading ? 'spinning' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <Card style={{ backgroundColor: '#FFFFFF', padding: '1.5rem' }}>
        {loading ? (
          <div className="list-items-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton-line skeleton-list-item" style={{ height: '45px' }}></div>
            <div className="skeleton-line skeleton-list-item" style={{ height: '45px' }}></div>
            <div className="skeleton-line skeleton-list-item" style={{ height: '45px' }}></div>
            <div className="skeleton-line skeleton-list-item" style={{ height: '45px' }}></div>
          </div>
        ) : activities.length === 0 ? (
          <EmptyState title="No Activity Logs" message="No recent system activities found." />
        ) : (
          <>
            <div className="ez-table-responsive">
              <table className="ez-data-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Time</th>
                    <th>Module</th>
                    <th>Activity Detail</th>
                    <th>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act) => {
                    const IconComponent = getActivityIcon(act.message);
                    return (
                      <tr key={act.id}>
                        <td className="table-highlight">#{act.id}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{act.time}</td>
                        <td>
                          <Badge variant="info">{act.module}</Badge>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className={`timeline-dot dot-${act.statusColor || 'green'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }}>
                              <IconComponent size={14} style={{ color: 'white' }} />
                            </div>
                            <span className="table-bold-cell">{act.message}</span>
                          </div>
                        </td>
                        <td>
                          <Badge variant={getStatusBadgeVariant(act.statusColor)}>
                            {act.statusColor === 'green' ? 'Info' : act.statusColor === 'yellow' ? 'Warning' : 'Danger'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Pagination
                currentPage={page}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

const ActivityLogs = () => (
  <ErrorBoundary title="Activity Logs Error" message="An error occurred while loading system activity logs.">
    <ActivityLogsContent />
  </ErrorBoundary>
);

export default ActivityLogs;
