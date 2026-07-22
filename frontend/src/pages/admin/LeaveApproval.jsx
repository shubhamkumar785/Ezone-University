import React, { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../../services/dashboardService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { RefreshCw, FileText, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

const LeaveApprovalContent = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getPendingLeaves(page - 1, itemsPerPage);
      setLeaves(data.content || []);
      setTotalItems(data.totalElements || 0);
    } catch (err) {
      setError('Failed to load pending leave requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleApprove = (id, name) => {
    toast.success(`Leave request approved for ${name}`);
    // Simulate updating list locally (in future CRUD synced with backend)
    setLeaves(prev => prev.filter(l => l.id !== id));
    setTotalItems(prev => prev - 1);
  };

  const handleReject = (id, name) => {
    toast.info(`Leave request rejected for ${name}`);
    setLeaves(prev => prev.filter(l => l.id !== id));
    setTotalItems(prev => prev - 1);
  };

  if (error) {
    return <ErrorState onRetry={fetchLeaves} message={error} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="dashboard-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
          Leave Approval Worklist
        </h1>
        <Button onClick={fetchLeaves} variant="secondary" disabled={loading}>
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
        ) : leaves.length === 0 ? (
          <EmptyState title="No Leave Requests" message="There are no pending leave requests to process." />
        ) : (
          <>
            <div className="ez-table-responsive">
              <table className="ez-data-table">
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>Department</th>
                    <th>Leave Type</th>
                    <th>Time Submitted</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th className="table-actions-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="leave-request-avatar" style={{ margin: 0 }}>
                            {leave.initials || leave.employee.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <span className="table-bold-cell">{leave.employee}</span>
                        </div>
                      </td>
                      <td>{leave.department}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FileText size={16} style={{ color: 'var(--text-muted)' }} />
                          <span>{leave.leaveType}</span>
                        </div>
                      </td>
                      <td>{leave.time}</td>
                      <td className="table-highlight">{leave.duration}</td>
                      <td>
                        <Badge variant="pending">{leave.status}</Badge>
                      </td>
                      <td>
                        <div className="table-actions-container">
                          <Button
                            onClick={() => handleApprove(leave.id, leave.employee)}
                            variant="primary"
                            className="table-action-btn edit"
                            title="Approve Leave"
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            onClick={() => handleReject(leave.id, leave.employee)}
                            variant="secondary"
                            className="table-action-btn delete"
                            title="Reject Leave"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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

const LeaveApproval = () => (
  <ErrorBoundary title="Leave Approval Error" message="An error occurred while loading the leave approval page.">
    <LeaveApprovalContent />
  </ErrorBoundary>
);

export default LeaveApproval;
