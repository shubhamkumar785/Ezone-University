import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { teacherDashboardService } from '../../services/teacherDashboardService';
import { toast } from 'react-toastify';
import { 
  Menu, Bell, User, ChevronDown, LogOut,
  UserCheck, Upload, BookOpen, Calendar, Clock,
  FileText, ClipboardList
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import { SkeletonCard } from '../../components/common/SkeletonLoader';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileData, dashboardData] = await Promise.all([
        teacherDashboardService.getTeacherProfile(),
        teacherDashboardService.getDashboardSummary()
      ]);
      setProfile(profileData);
      setDashboard(dashboardData);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: UserCheck, label: 'Mark Attendance', sublabel: 'Students', color: '#FF6B6B', bg: '#FFE5E5', onClick: () => navigate('/teacher/attendance') },
    { icon: Upload, label: 'Upload Assignment', sublabel: 'Section-wise', color: '#4ECDC4', bg: '#E0F7F6', onClick: () => navigate('/teacher/assignments') },
    { icon: Calendar, label: 'Time Table', sublabel: 'Class Schedule', color: '#FFD93D', bg: '#FFF9E5', onClick: () => {} },
    { icon: ClipboardList, label: 'Grades', sublabel: 'Update Marks', color: '#95E1D3', bg: '#E5F9F5', onClick: () => {} },
    { icon: FileText, label: 'Leaves', sublabel: 'Apply Leave', color: '#F38181', bg: '#FFE5E5', onClick: () => {} },
    { icon: BookOpen, label: 'Course Portal', sublabel: 'Materials', color: '#AA96DA', bg: '#F0EBFA', onClick: () => {} }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderBottom: '1px solid #E0E0E0',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: '#E5E7EB', borderRadius: '4px' }} />
            <div style={{ width: '200px', height: '20px', backgroundColor: '#E5E7EB', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#E5E7EB', borderRadius: '50%' }} />
            <div style={{ width: '150px', height: '32px', backgroundColor: '#E5E7EB', borderRadius: '16px' }} />
          </div>
        </div>

        <div style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{
                    backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '12px', padding: '16px 8px', height: '120px'
                  }}>
                    <div style={{ width: '56px', height: '56px', backgroundColor: '#E5E7EB', borderRadius: '12px', margin: '0 auto 8px' }} />
                    <div style={{ width: '80%', height: '12px', backgroundColor: '#E5E7EB', borderRadius: '4px', margin: '0 auto 4px' }} />
                    <div style={{ width: '60%', height: '10px', backgroundColor: '#E5E7EB', borderRadius: '4px', margin: '0 auto' }} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#4F7CFE', borderRadius: '12px', padding: '20px', height: '400px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* Top Navigation Bar */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderBottom: '1px solid #E0E0E0',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex' }}>
            <Menu size={24} color="#333" />
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: 500, color: '#333', margin: 0 }}>
            Welcome To Faculty Dashboard
          </h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ 
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px', position: 'relative', display: 'flex'
          }}>
            <Bell size={20} color="#666" />
            <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid #FFFFFF' }} />
          </button>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
            >
              <img 
                src={profile?.profilePhoto || 'https://ui-avatars.com/api/?name=Teacher&background=4F7CFE&color=fff&size=128'} 
                alt={profile?.facultyName || 'Teacher'}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E0E0E0' }}
              />
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
                {profile?.facultyName?.split(' ')[0] || 'Teacher'}
              </span>
              <span style={{ fontSize: '12px', color: '#888' }}>{profile?.department || 'Faculty'}</span>
              <ChevronDown size={16} color="#666" />
            </button>
            
            {showUserDropdown && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', minWidth: '200px', zIndex: 50
              }}>
                <button
                  onClick={logout}
                  style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#DC2626', textAlign: 'left' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
          
          {/* Left Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Quick Actions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    style={{
                      backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '12px', padding: '16px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={28} color={action.color} />
                    </div>
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#333', lineHeight: '1.2', marginBottom: '2px' }}>{action.label}</div>
                      <div style={{ fontSize: '9px', color: '#888', lineHeight: '1.2' }}>{action.sublabel}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* My Attendance Card */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E0E0E0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0 }}>
                  My Attendance Summary
                </h3>
              </div>
              
              <div style={{
                backgroundColor: '#1E3A8A', borderRadius: '8px', padding: '20px', color: '#FFFFFF', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.85, marginBottom: '4px' }}>Total Working Days</div>
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>{dashboard?.totalWorkingDays || 0}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.85, marginBottom: '4px' }}>Days Present</div>
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>{dashboard?.daysPresent || 0}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.85, marginBottom: '4px' }}>Leaves Taken</div>
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>{dashboard?.leavesTaken || 0}</div>
                </div>
              </div>
            </div>

            {/* Today's Classes Card */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E0E0E0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0 }}>
                  Today's Classes
                </h3>
              </div>
              
              <div style={{
                padding: '40px', textAlign: 'center', color: '#999', fontSize: '14px', backgroundColor: '#FAFAFA', borderRadius: '8px', border: '1px dashed #E0E0E0'
              }}>
                Next class: {dashboard?.nextClass || 'No upcoming classes today'} <br/>
                Time: {dashboard?.nextClassTime || '-'}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E0E0E0', height: 'fit-content' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img 
                  src={profile?.profilePhoto || 'https://ui-avatars.com/api/?name=Teacher&background=4F7CFE&color=fff&size=128'} 
                  alt="Profile"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 12px' }}
                />
                <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#333' }}>{profile?.facultyName}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>ID: {profile?.facultyId}</p>
              </div>
              <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Department:</span> <strong>{profile?.department}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Designation:</span> <strong>{profile?.designation}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Email:</span> <strong>{profile?.email}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Phone:</span> <strong>{profile?.phone}</strong>
                </div>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E0E0E0' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: '0 0 16px' }}>Overview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                   <span style={{ fontSize: '13px', color: '#64748B' }}>Total Classes Assigned</span>
                   <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{dashboard?.totalClassesAssigned || 0}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                   <span style={{ fontSize: '13px', color: '#64748B' }}>Assignments to Grade</span>
                   <span style={{ fontSize: '14px', fontWeight: 600, color: '#EF4444' }}>{dashboard?.pendingAssignmentsToGrade || 0}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                   <span style={{ fontSize: '13px', color: '#64748B' }}>Students Mentored</span>
                   <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{dashboard?.totalStudentsMentored || 0}</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
