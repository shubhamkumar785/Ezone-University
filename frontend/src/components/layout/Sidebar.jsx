import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Building,
  BookOpen,
  Book,
  UserCheck,
  Calendar,
  FileText,
  BarChart2,
  DollarSign,
  Bell,
  Settings,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  School
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [leaveCount, setLeaveCount] = useState(3);
  const [alertCount, setAlertCount] = useState(5);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const leaves = await dashboardService.getPendingLeaves(0, 1);
        const alerts = await dashboardService.getSystemAlerts(0, 1);
        setLeaveCount(leaves.totalElements || 0);
        setAlertCount(alerts.totalElements || 0);
      } catch (err) {
        console.error("Failed to load badge counts", err);
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: GraduationCap },
    { label: 'Teachers', path: '/admin/teachers', icon: Users },
    { label: 'Departments', path: '/admin/departments', icon: Building },
    { label: 'Courses', path: '/admin/courses', icon: BookOpen },
    { label: 'Subjects', path: '/admin/subjects', icon: Book },
    { label: 'Classrooms', path: '/admin/classrooms', icon: School },
    { label: 'User Management', path: '/admin/users', icon: UserCheck },
    { label: 'Attendance', path: '/admin/attendance', icon: Calendar },
    { label: 'Leave Approval', path: '/admin/leaves', icon: FileText, badge: leaveCount },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart2 },
    { label: 'Finance', path: '/admin/finance', icon: DollarSign },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell, badge: alertCount },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
    { label: 'Activity Logs', path: '/admin/activity', icon: Activity }
  ];

  // Helper to get user initials
  const getInitials = (name) => {
    if (!name) return 'RC';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const adminName = user?.fullName || 'Robert Chen';
  const adminEmail = user?.loginId ? `${user.loginId.toLowerCase()}@ezone.edu` : 'robert.chen@ezone.edu';
  const initials = getInitials(adminName);

  return (
    <div className={`ez-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="ez-sidebar-header">
        <div className="ez-sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="ez-sidebar-logo-text">
          <span className="ez-sidebar-logo-title">EZone</span>
          <span className="ez-sidebar-logo-subtitle">Admin Console</span>
        </div>

        {/* Collapsible toggle button on border */}
        <button 
          className="ez-sidebar-toggle-btn" 
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="ez-sidebar-nav">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`ez-sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="ez-sidebar-nav-item-icon">
                <IconComponent size={20} />
              </span>
              <span className="ez-sidebar-nav-item-label">{item.label}</span>
              {item.badge && (
                <span className="ez-sidebar-badge">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="ez-sidebar-footer">
        <div className="ez-sidebar-avatar" title={adminName}>
          {initials}
        </div>
        <div className="ez-sidebar-profile-info">
          <span className="ez-sidebar-profile-name">{adminName}</span>
          <span className="ez-sidebar-profile-email">{adminEmail}</span>
        </div>
        <button 
          className="ez-sidebar-logout-btn" 
          onClick={logout}
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
