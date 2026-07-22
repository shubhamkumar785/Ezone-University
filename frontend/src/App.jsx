import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Login from './pages/auth/Login';
import StudentDashboard from './pages/student/Dashboard';
import StudentAttendance from './pages/student/Attendance';
import DayWiseAttendance from './pages/student/DayWiseAttendance';
import TeacherDashboard from './pages/teacher/Dashboard';
import MarkAttendance from './pages/teacher/MarkAttendance';
import UploadAssignment from './pages/teacher/UploadAssignment';
import Unauthorized from './pages/error/Unauthorized';
import DashboardLayout from './components/layout/DashboardLayout';
import Card from './components/common/Card';
import Loader from './components/common/Loader';

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const Teachers = lazy(() => import('./pages/admin/Teachers'));
const Subjects = lazy(() => import('./pages/admin/Subjects'));
const Classrooms = lazy(() => import('./pages/admin/Classrooms'));
const Students = lazy(() => import('./pages/admin/Students'));
const Users = lazy(() => import('./pages/admin/Users'));
const LeaveApproval = lazy(() => import('./pages/admin/LeaveApproval'));
const ActivityLogs = lazy(() => import('./pages/admin/ActivityLogs'));
const Notifications = lazy(() => import('./pages/admin/Notifications'));

import './index.css';

// Component to handle redirecting already logged in users
const AuthRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    switch (user.role) {
      case 'STUDENT': return <Navigate to="/student/dashboard" replace />;
      case 'TEACHER': return <Navigate to="/teacher/dashboard" replace />;
      case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }
  
  return <Login />;
};

// Placeholder component for other admin pages to show a nice premium card
const AdminPlaceholderPage = ({ title }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
        {title}
      </h1>
      <Card style={{ padding: '3.5rem 2rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          {title} Management
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto', lineHeight: '1.6' }}>
          Welcome to the {title} admin workspace. From here, you can manage records, customize configurations, and generate reports. Complete database and CRUD functionalities will sync in future phases.
        </p>
      </Card>
    </div>
  );
};

const RootRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    switch (user.role) {
      case 'STUDENT': return <Navigate to="/student/dashboard" replace />;
      case 'TEACHER': return <Navigate to="/teacher/dashboard" replace />;
      case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }
  
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthRedirect />} />
          
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/student/attendance" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentAttendance />
            </ProtectedRoute>
          } />

          <Route path="/student/attendance/day-wise" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DayWiseAttendance />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/attendance" element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <MarkAttendance />
            </ProtectedRoute>
          } />

          <Route path="/teacher/assignments" element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <UploadAssignment />
            </ProtectedRoute>
          } />
          
          {/* Admin routes wrapped inside the DashboardLayout wrapper */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={
              <Suspense fallback={<div className="suspense-loading-wrapper"><Loader /></div>}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="students" element={
              <Suspense fallback={<div className="suspense-loading-wrapper"><Loader /></div>}>
                <Students />
              </Suspense>
            } />
            <Route path="teachers" element={
              <Suspense fallback={<div className="suspense-loading-wrapper"><Loader /></div>}>
                <Teachers />
              </Suspense>
            } />
            <Route path="departments" element={<AdminPlaceholderPage title="Departments" />} />
            <Route path="courses" element={<AdminPlaceholderPage title="Courses" />} />
            <Route path="subjects" element={
              <Suspense fallback={<div className="suspense-loading-wrapper"><Loader /></div>}>
                <Subjects />
              </Suspense>
            } />
            <Route path="classrooms" element={
              <Suspense fallback={<div className="suspense-loading-wrapper"><Loader /></div>}>
                <Classrooms />
              </Suspense>
            } />
            <Route path="users" element={
              <Suspense fallback={<div className="suspense-loading-wrapper"><Loader /></div>}>
                <Users />
              </Suspense>
            } />
             <Route path="attendance" element={<AdminPlaceholderPage title="Attendance" />} />
            <Route path="leaves" element={
              <Suspense fallback={<div className="suspense-loading-wrapper"><Loader /></div>}>
                <LeaveApproval />
              </Suspense>
            } />
            <Route path="reports" element={<AdminPlaceholderPage title="Reports & Analytics" />} />
            <Route path="finance" element={<AdminPlaceholderPage title="Finance" />} />
            <Route path="notifications" element={
              <Suspense fallback={<div className="suspense-loading-wrapper"><Loader /></div>}>
                <Notifications />
              </Suspense>
            } />
            <Route path="settings" element={<AdminPlaceholderPage title="System Settings" />} />
            <Route path="activity" element={
              <Suspense fallback={<div className="suspense-loading-wrapper"><Loader /></div>}>
                <ActivityLogs />
              </Suspense>
            } />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
