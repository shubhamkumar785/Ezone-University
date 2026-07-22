import React, { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../../services/dashboardService';
import StatCard from './StatCard';
import EnrollmentChart from './EnrollmentChart';
import DepartmentChart from './DepartmentChart';
import AttendanceChart from './AttendanceChart';
import FeeChart from './FeeChart';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import Button from '../common/Button';
import ErrorBoundary from '../common/ErrorBoundary';
import {
  GraduationCap,
  Users,
  BookOpen,
  Building,
  UserCheck,
  DollarSign,
  AlertTriangle,
  Activity,
  LogIn,
  Calendar,
  Clock,
  FileText,
  Award,
  PlusCircle,
  UserPlus,
  ShieldAlert,
  School,
  Settings
} from 'lucide-react';

const DashboardGrid = () => {
  const navigate = useNavigate();
  const { refreshCallbackRef } = useOutletContext() || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardService.getDashboardOverview();
      setData(result);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Could not connect to dashboard services. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Register the refresh callback with the parent layout
    if (refreshCallbackRef) {
      refreshCallbackRef.current = fetchDashboardData;
    }
    
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 60000); // Auto refresh every 60 seconds
    return () => clearInterval(interval);
  }, [fetchDashboardData, refreshCallbackRef]);

  const getActivityIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('login') && !lowerTitle.includes('failed')) return LogIn;
    if (lowerTitle.includes('failed login')) return ShieldAlert;
    if (lowerTitle.includes('attendance')) return Calendar;
    if (lowerTitle.includes('leave')) return Clock;
    if (lowerTitle.includes('grade')) return Award;
    if (lowerTitle.includes('course')) return PlusCircle;
    if (lowerTitle.includes('student')) return UserPlus;
    return Activity;
  };

  if (error) {
    return <ErrorState onRetry={fetchDashboardData} message={error} />;
  }

  const isEmpty = !loading && (!data || Object.keys(data).length === 0);
  if (isEmpty) {
    return <EmptyState title="No Dashboard Data" message="No data returned from ERP services." />;
  }

  const dummyStats = Array(8).fill(null);

  const quickActions = [
    { icon: GraduationCap, label: 'Students', sublabel: 'Manage Students', color: '#FF6B6B', bg: '#FFE5E5', onClick: () => navigate('/admin/students') },
    { icon: Users, label: 'Faculty', sublabel: 'Manage Teachers', color: '#4ECDC4', bg: '#E0F7F6', onClick: () => navigate('/admin/teachers') },
    { icon: Building, label: 'Departments', sublabel: 'Academic Depts', color: '#FFD93D', bg: '#FFF9E5', onClick: () => navigate('/admin/departments') },
    { icon: BookOpen, label: 'Courses', sublabel: 'Manage Courses', color: '#95E1D3', bg: '#E5F9F5', onClick: () => navigate('/admin/courses') },
    { icon: School, label: 'Classrooms', sublabel: 'Manage Rooms', color: '#F38181', bg: '#FFE5E5', onClick: () => navigate('/admin/classrooms') },
    { icon: FileText, label: 'Leaves', sublabel: 'Leave Approvals', color: '#AA96DA', bg: '#F0EBFA', onClick: () => navigate('/admin/leaves') },
    { icon: DollarSign, label: 'Finance', sublabel: 'Fee & Payments', color: '#FCBAD3', bg: '#FFF0F7', onClick: () => navigate('/admin/finance') },
    { icon: Settings, label: 'Settings', sublabel: 'System Config', color: '#A8D8EA', bg: '#E8F4F8', onClick: () => navigate('/admin/settings') }
  ];

  return (
    <div className="dashboard-grid-container">
      {/* 1. Header bar - Removed refresh button (now in navbar) */}
      <div className="dashboard-header-bar">
        <h1 className="dashboard-section-title">Overview</h1>
      </div>

      {/* 2. Quick Actions Grid (Replaces Welcome Banner to match Student/Faculty UX) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(8, 1fr)', 
        gap: '12px',
        marginBottom: '24px'
      }}>
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={action.onClick}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E0E0E0',
                borderRadius: '12px',
                padding: '16px 8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: action.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={28} color={action.color} />
              </div>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#333', lineHeight: '1.2', marginBottom: '2px' }}>
                  {action.label}
                </div>
                <div style={{ fontSize: '9px', color: '#888', lineHeight: '1.2' }}>
                  {action.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Reusable Stat Cards Grid */}
      <div className="dashboard-stats-grid">
        {loading ? (
          dummyStats.map((_, i) => <StatCard key={i} loading={true} />)
        ) : (
          <>
            <StatCard
              icon={GraduationCap}
              title="Total Students"
              value={data.stats.totalStudents.value}
              trend={data.stats.totalStudents.trend}
              trendType={data.stats.totalStudents.trendType}
              subtitle={data.stats.totalStudents.subtitle}
            />
            <StatCard
              icon={Users}
              title="Faculty Members"
              value={data.stats.facultyMembers.value}
              trend={data.stats.facultyMembers.trend}
              trendType={data.stats.facultyMembers.trendType}
              subtitle={data.stats.facultyMembers.subtitle}
            />
            <StatCard
              icon={BookOpen}
              title="Active Courses"
              value={data.stats.activeCourses.value}
              trend={data.stats.activeCourses.trend}
              trendType={data.stats.activeCourses.trendType}
              subtitle={data.stats.activeCourses.subtitle}
            />
            <StatCard
              icon={Building}
              title="Departments"
              value={data.stats.departments.value}
              trend={data.stats.departments.trend}
              trendType={data.stats.departments.trendType}
              subtitle={data.stats.departments.subtitle}
            />
            <StatCard
              icon={UserCheck}
              title="Average Attendance"
              value={data.stats.avgAttendance.value}
              trend={data.stats.avgAttendance.trend}
              trendType={data.stats.avgAttendance.trendType}
              subtitle={data.stats.avgAttendance.subtitle}
              progress={data.stats.avgAttendance.progress}
            />
            <StatCard
              icon={DollarSign}
              title="Fee Collected"
              value={data.stats.feeCollected.value}
              trend={data.stats.feeCollected.trend}
              trendType={data.stats.feeCollected.trendType}
              progress={data.stats.feeCollected.progress}
            />
            <StatCard
              icon={AlertTriangle}
              title="Pending Leaves"
              value={data.stats.pendingLeavesCount.value}
              trend={data.stats.pendingLeavesCount.trend}
              trendType={data.stats.pendingLeavesCount.trendType}
            />
            <StatCard
              icon={Activity}
              title="Active Alerts"
              value={data.stats.activeAlerts.value}
              trend={data.stats.activeAlerts.trend}
              trendType={data.stats.activeAlerts.trendType}
            />
          </>
        )}
      </div>

      {/* 4. Recharts Graph Grid Row 1 */}
      <div className="dashboard-charts-grid">
        <EnrollmentChart data={data?.enrollmentTrend} loading={loading} />
        <DepartmentChart data={data?.departmentsDistribution} loading={loading} />
      </div>

      {/* 5. Recharts Graph Grid Row 2 */}
      <div className="dashboard-charts-grid">
        <AttendanceChart data={data?.monthlyAttendance} loading={loading} />
        <FeeChart data={data?.feeCollection} loading={loading} />
      </div>

      {/* 6. Lower details row (Pending Leaves & Activities Timeline) */}
      <div className="dashboard-lists-grid">
        {/* Leave Requests Card */}
        <ErrorBoundary title="Pending Leaves Worklist Error">
          <Card className="ez-list-card">
            <div className="list-card-header">
              <h2 className="chart-card-title">Pending Leave Requests</h2>
              <Badge variant="pending">{loading ? '...' : data?.pendingLeaves?.length || 0}</Badge>
            </div>
            {loading ? (
              <div className="list-items-container">
                <div className="skeleton-line skeleton-list-item"></div>
                <div className="skeleton-line skeleton-list-item"></div>
                <div className="skeleton-line skeleton-list-item"></div>
              </div>
            ) : data?.pendingLeaves?.length === 0 ? (
              <div className="empty-state-list-wrapper">No pending requests</div>
            ) : (
              <>
                <div className="list-items-container">
                  {data.pendingLeaves.slice(0, 3).map((req) => (
                    <div key={req.id} className="leave-request-item">
                      <div className="leave-request-left">
                        <div className="leave-request-avatar">
                          {req.initials}
                        </div>
                        <div className="leave-request-info">
                          <span className="leave-request-name">{req.name}</span>
                          <span className="leave-request-meta">{req.type} • {req.dept} • {req.time}</span>
                          <span className="leave-request-duration">Duration: {req.duration}</span>
                        </div>
                      </div>
                      <Badge variant="pending">{req.status}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="secondary" className="list-view-all-btn" onClick={() => navigate('/admin/leaves')}>
                  View All Requests
                </Button>
              </>
            )}
          </Card>
        </ErrorBoundary>

        {/* Activity Logs Timeline Card */}
        <ErrorBoundary title="Recent Activity Logs Error">
          <Card className="ez-list-card">
            <div className="list-card-header">
              <h2 className="chart-card-title">Recent Activity</h2>
            </div>
            {loading ? (
              <div className="list-items-container">
                <div className="skeleton-line skeleton-list-item"></div>
                <div className="skeleton-line skeleton-list-item"></div>
                <div className="skeleton-line skeleton-list-item"></div>
              </div>
            ) : data?.recentActivities?.length === 0 ? (
              <div className="empty-state-list-wrapper">No recent activity logs</div>
            ) : (
              <>
                <div className="activity-timeline-container" style={{ flex: 1 }}>
                  <div className="timeline-bar"></div>
                  <div className="timeline-items-wrapper">
                    {data.recentActivities.slice(0, 4).map((log) => {
                      const IconComponent = getActivityIcon(log.title);
                      return (
                        <div key={log.id} className="timeline-item">
                          <div className={`timeline-dot dot-${log.statusColor}`}>
                            <IconComponent size={14} />
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-header">
                              <span className="timeline-title">{log.title}</span>
                              <span className="timeline-time">{log.time}</span>
                            </div>
                            <p className="timeline-description">{log.desc}</p>
                            <span className="timeline-module">{log.module}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Button variant="secondary" className="list-view-all-btn" onClick={() => navigate('/admin/activity')} style={{ marginTop: '1rem' }}>
                  View All Activities
                </Button>
              </>
            )}
          </Card>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default DashboardGrid;
