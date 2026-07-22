import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Sun, Moon, Bell, ChevronDown, RefreshCw } from 'lucide-react';

const Navbar = ({ onRefresh, isRefreshing }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Apply dark mode to document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDark]);

  // Generate breadcrumbs from current path
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return [{ label: 'EZone', path: '#' }];

    const breadcrumbs = [{ label: 'EZone', path: '/admin/dashboard' }];
    
    // Capitalize each path segment
    paths.forEach((path, index) => {
      // Skip the base 'admin' prefix to make breadcrumb clean (e.g. EZone / Dashboard)
      if (path === 'admin') return;
      
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      breadcrumbs.push({
        label,
        path: '/' + paths.slice(0, index + 1).join('/')
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const adminName = user?.fullName || 'Robert Chen';
  // Just show the first name for the dropdown label to match "Robert" in screenshots
  const firstName = adminName.split(' ')[0];

  // Sample notifications
  const notifications = [
    { id: 1, title: 'New Student Enrollment', message: '5 students enrolled today', time: '5m ago', unread: true },
    { id: 2, title: 'Leave Request', message: 'Alex Johnson requested leave', time: '2h ago', unread: true },
    { id: 3, title: 'System Update', message: 'Attendance module updated', time: '1d ago', unread: false },
  ];

  return (
    <header className="ez-navbar">
      {/* Breadcrumbs */}
      <div className="ez-navbar-left">
        <nav className="ez-navbar-breadcrumbs" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span style={{ color: 'var(--text-muted)' }}>/</span>}
                {isLast ? (
                  <span className="ez-navbar-breadcrumb-current">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="ez-navbar-breadcrumb-link">
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="ez-navbar-right">
        {/* Search Bar */}
        <div className="ez-navbar-search">
          <Search size={18} className="ez-navbar-search-icon" />
          <input
            type="text"
            placeholder="Search anything..."
            className="ez-navbar-search-input"
          />
        </div>

        {/* Refresh Button - Small Icon Only */}
        {onRefresh && (
          <button
            className="ez-navbar-action-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Dashboard"
            style={{ marginLeft: '0.5rem' }}
          >
            <RefreshCw size={18} className={isRefreshing ? 'spinning' : ''} />
          </button>
        )}

        {/* Theme Toggle */}
        <button
          className="ez-navbar-action-btn"
          onClick={() => setIsDark(!isDark)}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{ marginLeft: '0.5rem' }}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
          <button 
            className="ez-navbar-action-btn" 
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="ez-navbar-badge-dot"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div 
                className="notifications-overlay"
                onClick={() => setShowNotifications(false)}
              />
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <span className="notification-count">{notifications.filter(n => n.unread).length} new</span>
                </div>
                <div className="notifications-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                      <div className="notification-content">
                        <h4>{notif.title}</h4>
                        <p>{notif.message}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                      {notif.unread && <span className="notification-unread-dot"></span>}
                    </div>
                  ))}
                </div>
                <div className="notifications-footer">
                  <a href="/admin/notifications">View All Notifications</a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="ez-navbar-profile" style={{ marginLeft: '0.75rem' }}>
          <div className="ez-navbar-profile-avatar">
            {firstName.substring(0, 2).toUpperCase()}
          </div>
          <div className="ez-navbar-profile-details">
            <span className="ez-navbar-profile-name">{firstName}</span>
            <span className="ez-navbar-profile-role">Admin</span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
