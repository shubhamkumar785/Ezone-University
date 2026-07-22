import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/userService';
import UserTable from '../../components/admin/UserTable';
import Filters from '../../components/common/Filters';
import Pagination from '../../components/common/Pagination';
import ExportDialog from '../../components/admin/ExportDialog';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { Download, X, ShieldAlert, History } from 'lucide-react';
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [lockFilter, setLockFilter] = useState('');

  // Pagination States
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Modals States
  const [historyUser, setHistoryUser] = useState(null);
  const [tempOtpInfo, setTempOtpInfo] = useState(null); // { username, newOtp }
  const [isExportOpen, setIsExportOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch {
      toast.error('Failed to load user accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (id) => {
    try {
      const user = users.find((u) => u.id === id);
      const action = user.status === 'Active' ? 'deactivate' : 'activate';
      await userService.toggleStatus(id);
      toast.success(`User status set to ${action}d`);
      fetchUsers();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleToggleLock = async (id) => {
    try {
      const user = users.find((u) => u.id === id);
      const action = user.locked ? 'unlocked' : 'locked';
      await userService.toggleLock(id);
      toast.success(`Account has been successfully ${action}`);
      fetchUsers();
    } catch {
      toast.error('Failed to toggle lock status');
    }
  };

  const handleResetLogin = async (id) => {
    try {
      await userService.resetLogin(id);
      toast.success('Login access reset. All failed attempts cleared.');
      fetchUsers();
    } catch {
      toast.error('Failed to reset login history');
    }
  };

  const handleResetOtp = async (id) => {
    try {
      const user = users.find((u) => u.id === id);
      const result = await userService.resetOtp(id);
      setTempOtpInfo({
        username: user.username,
        newOtp: result.newOtp
      });
      fetchUsers();
    } catch {
      toast.error('Failed to generate OTP log');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
    setLockFilter('');
    setPage(1);
  };

  // Filters logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    
    let matchesLock = true;
    if (lockFilter === 'Locked') matchesLock = user.locked === true;
    if (lockFilter === 'Unlocked') matchesLock = user.locked === false;

    return matchesSearch && matchesRole && matchesStatus && matchesLock;
  });

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const dropdownsConfig = [
    {
      value: roleFilter,
      onChange: (val) => {
        setRoleFilter(val);
        setPage(1);
      },
      placeholder: 'All Roles',
      options: ['ADMIN', 'TEACHER', 'STUDENT']
    },
    {
      value: statusFilter,
      onChange: (val) => {
        setStatusFilter(val);
        setPage(1);
      },
      placeholder: 'All Statuses',
      options: ['Active', 'Inactive']
    },
    {
      value: lockFilter,
      onChange: (val) => {
        setLockFilter(val);
        setPage(1);
      },
      placeholder: 'Lock Status',
      options: ['Locked', 'Unlocked']
    }
  ];

  return (
    <div className="ez-master-page">
      <div className="master-page-header">
        <h1 className="master-page-title">User Account Security</h1>
        <div className="master-actions-group">
          <Button onClick={() => setIsExportOpen(true)} variant="secondary" className="master-action-btn-group">
            <Download size={16} />
            <span>Export Users</span>
          </Button>
        </div>
      </div>

      <Card className="master-table-card">
        <Filters
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search by username or email..."
          dropdowns={dropdownsConfig}
          onReset={handleResetFilters}
        />

        {loading ? (
          <div className="master-loader-wrapper">
            <Loader />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>Loading accounts list...</span>
          </div>
        ) : (
          <>
            <UserTable
              users={paginatedUsers}
              onToggleStatus={handleToggleStatus}
              onToggleLock={handleToggleLock}
              onResetLogin={handleResetLogin}
              onResetOtp={handleResetOtp}
              onViewHistory={setHistoryUser}
            />
            <Pagination
              currentPage={page}
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      {/* Temp OTP Info Alert Modal */}
      {tempOtpInfo && (
        <div className="ez-modal-overlay">
          <div className="ez-modal-card">
            <button className="ez-modal-close" onClick={() => setTempOtpInfo(null)}>
              <X size={20} />
            </button>
            <div className="otp-alert-modal-content">
              <div className="otp-modal-header">
                <ShieldAlert size={48} className="otp-warning-icon" />
                <h3 className="otp-modal-title">Temporary OTP Generated</h3>
              </div>
              <p className="otp-modal-desc">
                A new authentication OTP has been generated for account <strong>{tempOtpInfo.username}</strong>. Please deliver this to the user securely.
              </p>
              <div className="otp-code-box">{tempOtpInfo.newOtp}</div>
              <div className="otp-modal-footer">
                <Button onClick={() => setTempOtpInfo(null)} variant="primary" className="otp-close-btn">
                  Close OTP Window
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login History Log Modal */}
      {historyUser && (
        <div className="ez-modal-overlay">
          <div className="ez-modal-card">
            <button className="ez-modal-close" onClick={() => setHistoryUser(null)}>
              <X size={20} />
            </button>
            <div className="history-modal-content">
              <div className="history-modal-header">
                <History size={24} className="history-icon" />
                <h3 className="history-title">Login Audits - {historyUser.username}</h3>
              </div>
              <div className="history-logs-container">
                {(!historyUser.loginHistory || historyUser.loginHistory.length === 0) ? (
                  <div className="empty-state-list-wrapper">No logins recorded.</div>
                ) : (
                  <div className="history-logs-list">
                    {historyUser.loginHistory.map((log, idx) => (
                      <div key={idx} className="history-log-item">
                        <div className="history-log-left">
                          <span className="log-ip-address">{log.ip}</span>
                          <span className="log-timestamp">{log.time}</span>
                        </div>
                        <Badge variant={log.status === 'Success' ? 'success' : 'danger'}>
                          {log.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-actions-row">
                <Button onClick={() => setHistoryUser(null)} variant="secondary" className="form-cancel-btn">
                  Close Log
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <div className="ez-modal-overlay">
          <div className="ez-modal-card">
            <button className="ez-modal-close" onClick={() => setIsExportOpen(false)}>
              <X size={20} />
            </button>
            <ExportDialog category="Users" data={filteredUsers} onCancel={() => setIsExportOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
