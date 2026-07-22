import React, { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../../services/dashboardService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { RefreshCw, Bell, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const NotificationsContent = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getSystemAlerts(page - 1, itemsPerPage);
      setAlerts(data.content || []);
      setTotalItems(data.totalElements || 0);
    } catch (err) {
      setError('Failed to load system notifications and alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleDismiss = (id, title) => {
    toast.success(`Notification "${title}" dismissed`);
    setAlerts(prev => prev.filter(a => a.id !== id));
    setTotalItems(prev => prev - 1);
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'danger': return AlertCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getSeverityBadgeVariant = (severity) => {
    switch (severity) {
      case 'danger': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'success';
      default: return 'neutral';
    }
  };

  if (error) {
    return <ErrorState onRetry={fetchAlerts} message={error} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="dashboard-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
          System Notifications & Alerts
        </h1>
        <Button onClick={fetchAlerts} variant="secondary" disabled={loading}>
          <RefreshCw size={16} className={`refresh-icon-spin ${loading ? 'spinning' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <Card style={{ backgroundColor: '#FFFFFF', padding: '1.5rem' }}>
        {loading ? (
          <div className="list-items-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton-line skeleton-list-item" style={{ height: '50px' }}></div>
            <div className="skeleton-line skeleton-list-item" style={{ height: '50px' }}></div>
            <div className="skeleton-line skeleton-list-item" style={{ height: '50px' }}></div>
            <div className="skeleton-line skeleton-list-item" style={{ height: '50px' }}></div>
          </div>
        ) : alerts.length === 0 ? (
          <EmptyState title="No Notifications" message="All systems are clear. There are no active system alerts." />
        ) : (
          <>
            <div className="ez-table-responsive">
              <table className="ez-data-table">
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th>Alert Title</th>
                    <th>Detail Message</th>
                    <th>Severity</th>
                    <th>Timestamp</th>
                    <th className="table-actions-header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert) => {
                    const IconComponent = getAlertIcon(alert.severity);
                    return (
                      <tr key={alert.id}>
                        <td className="table-highlight">#{alert.id}</td>
                        <td className="table-bold-cell">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IconComponent
                              size={16}
                              className={
                                alert.severity === 'danger'
                                  ? 'text-danger'
                                  : alert.severity === 'warning'
                                  ? 'text-warning'
                                  : 'text-info'
                              }
                            />
                            <span>{alert.title}</span>
                          </div>
                        </td>
                        <td>{alert.message}</td>
                        <td>
                          <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{alert.timestamp}</td>
                        <td>
                          <div className="table-actions-container">
                            <Button
                              onClick={() => handleDismiss(alert.id, alert.title)}
                              variant="secondary"
                              className="table-action-btn edit"
                              title="Acknowledge Alert"
                            >
                              <CheckCircle size={14} />
                            </Button>
                          </div>
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

const Notifications = () => (
  <ErrorBoundary title="Notifications Page Error" message="An error occurred while loading system alerts.">
    <NotificationsContent />
  </ErrorBoundary>
);

export default Notifications;
