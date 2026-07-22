import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Lock, Unlock, Key, RefreshCw, Eye, UserCheck, UserX } from 'lucide-react';

const UserTable = ({ users = [], onToggleStatus, onToggleLock, onResetLogin, onResetOtp, onViewHistory }) => {
  const getRoleVariant = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'TEACHER':
        return 'info';
      case 'STUDENT':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="ez-table-responsive">
      <table className="ez-data-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Security Status</th>
            <th className="table-actions-header">Access Control Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7" className="table-empty-row">
                No user records found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td className="table-highlight">{user.id}</td>
                <td className="table-bold-cell">{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Badge variant={getRoleVariant(user.role)}>
                    {user.role}
                  </Badge>
                </td>
                <td>
                  <Badge variant={user.status === 'Active' ? 'success' : 'danger'}>
                    {user.status}
                  </Badge>
                </td>
                <td>
                  <Badge variant={user.locked ? 'danger' : 'success'}>
                    {user.locked ? 'Locked' : 'Unlocked'}
                  </Badge>
                </td>
                <td>
                  <div className="table-actions-container">
                    {/* Toggle lock */}
                    <Button
                      onClick={() => onToggleLock(user.id)}
                      variant="secondary"
                      className={`table-action-btn ${user.locked ? 'activate' : 'deactivate'}`}
                      title={user.locked ? 'Unlock Account' : 'Lock Account'}
                    >
                      {user.locked ? <Unlock size={14} /> : <Lock size={14} />}
                    </Button>

                    {/* Reset Login History / failures */}
                    <Button
                      onClick={() => onResetLogin(user.id)}
                      variant="secondary"
                      className="table-action-btn edit"
                      title="Reset Login Failures"
                    >
                      <RefreshCw size={14} />
                    </Button>

                    {/* Reset OTP */}
                    <Button
                      onClick={() => onResetOtp(user.id)}
                      variant="secondary"
                      className="table-action-btn edit"
                      title="Reset / Generate OTP"
                    >
                      <Key size={14} />
                    </Button>

                    {/* View Login History */}
                    <Button
                      onClick={() => onViewHistory(user)}
                      variant="secondary"
                      className="table-action-btn view"
                      title="View Login History"
                    >
                      <Eye size={14} />
                    </Button>

                    {/* Toggle Active status */}
                    <Button
                      onClick={() => onToggleStatus(user.id)}
                      variant="secondary"
                      className={`table-action-btn ${user.status === 'Active' ? 'deactivate' : 'activate'}`}
                      title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                    >
                      {user.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
