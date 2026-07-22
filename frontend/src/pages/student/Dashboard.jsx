import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentDashboardService } from '../../services/studentDashboardService';
import { toast } from 'react-toastify';
import { 
  Menu, Bell, User, ChevronDown, LogOut, Search,
  BookOpen, Calendar, FileText, UserCheck, 
  MessageSquare, CreditCard, Award, BookMarked,
  Clock, ClipboardList, AlertCircle, CheckCircle
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import { SkeletonCard } from '../../components/common/SkeletonLoader';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showHolidaysExpanded, setShowHolidaysExpanded] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState('2601');
  const [selectedCAYear, setSelectedCAYear] = useState('2026');
  const [selectedCATerm, setSelectedCATerm] = useState(null);
  const [profileView, setProfileView] = useState('student'); // 'student', 'mentor', 'parent'
  const [availableTerms, setAvailableTerms] = useState([]);
  const [caMarksData, setCAMarksData] = useState(null);
  const [caMarksLoading, setCAMarksLoading] = useState(false);
  const [caMarksError, setCAMarksError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCATerm) {
      fetchCAMarks(selectedCATerm);
    }
  }, [selectedCATerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileData, dashboardData, activeTermData, termsData] = await Promise.all([
        studentDashboardService.getStudentProfile(),
        studentDashboardService.getStudentDashboard(),
        studentDashboardService.getActiveTerm(),
        studentDashboardService.getAllTerms()
      ]);
      setProfile(profileData);
      setDashboard(dashboardData);
      setAvailableTerms(termsData);
      
      // Set active term as default
      if (activeTermData) {
        setSelectedCATerm(activeTermData.termCode);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCAMarks = async (termCode) => {
    setCAMarksLoading(true);
    setCAMarksError(null);
    try {
      const marks = await studentDashboardService.getCAMarks(termCode);
      setCAMarksData(marks);
    } catch (error) {
      console.error('Error fetching CA marks:', error);
      setCAMarksError('Failed to load CA marks');
      // Don't show toast here to avoid too many notifications
    } finally {
      setCAMarksLoading(false);
    }
  };

  const quickActions = [
    { icon: BookOpen, label: 'Study Material', sublabel: 'E-Notes & Docs', color: '#FF6B6B', bg: '#FFE5E5', onClick: () => {} },
    { icon: Calendar, label: 'Time Table', sublabel: 'Class Schedule', color: '#4ECDC4', bg: '#E0F7F6', onClick: () => {} },
    { icon: FileText, label: 'Assignments', sublabel: 'Pending Tasks', color: '#FFD93D', bg: '#FFF9E5', onClick: () => {} },
    { icon: UserCheck, label: 'Attendance', sublabel: 'Track Progress', color: '#95E1D3', bg: '#E5F9F5', onClick: () => navigate('/student/attendance') },
    { icon: MessageSquare, label: 'Portal', sublabel: 'Course Portal', color: '#F38181', bg: '#FFE5E5', onClick: () => {} },
    { icon: CreditCard, label: 'Fee Payment', sublabel: 'Online Pay', color: '#AA96DA', bg: '#F0EBFA', onClick: () => {} },
    { icon: Award, label: 'Marks', sublabel: 'View Results', color: '#FCBAD3', bg: '#FFF0F7', onClick: () => {} },
    { icon: FileText, label: 'Leaves', sublabel: 'Apply Leave', color: '#A8D8EA', bg: '#E8F4F8', onClick: () => {} },
    { icon: BookMarked, label: 'Syllabus', sublabel: 'Course Content', color: '#FFD93D', bg: '#FFF9E5', onClick: () => {} },
    { icon: BookOpen, label: 'Online Exam', sublabel: 'Take Test', color: '#6BCB77', bg: '#E8F7EA', onClick: () => {} },
    { icon: MessageSquare, label: 'Student Feedback', sublabel: 'Share Views', color: '#4D96FF', bg: '#E5F1FF', onClick: () => {} },
    { icon: Calendar, label: 'Mentoring', sublabel: 'Book Session', color: '#FF6B9D', bg: '#FFE5F0', onClick: () => {} }
  ];

  // Holidays will be fetched from API - empty array for now until admin uploads academic calendar
  const holidays = [];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
        {/* Top Navigation Bar Skeleton */}
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

        {/* Main Content Skeleton */}
        <div style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
            {/* Left Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Quick Actions Skeleton */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E0E0E0',
                    borderRadius: '12px',
                    padding: '16px 8px',
                    height: '120px'
                  }}>
                    <div style={{ width: '56px', height: '56px', backgroundColor: '#E5E7EB', borderRadius: '12px', margin: '0 auto 8px' }} />
                    <div style={{ width: '80%', height: '12px', backgroundColor: '#E5E7EB', borderRadius: '4px', margin: '0 auto 4px' }} />
                    <div style={{ width: '60%', height: '10px', backgroundColor: '#E5E7EB', borderRadius: '4px', margin: '0 auto' }} />
                  </div>
                ))}
              </div>

              {/* Cards Skeleton */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E0E0E0', height: '180px' }}>
                  <div style={{ width: '150px', height: '20px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '16px' }} />
                  <div style={{ width: '100%', height: '100px', backgroundColor: '#E5E7EB', borderRadius: '8px' }} />
                </div>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E0E0E0', height: '180px' }}>
                  <div style={{ width: '150px', height: '20px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '16px' }} />
                  <div style={{ width: '100%', height: '100px', backgroundColor: '#E5E7EB', borderRadius: '8px' }} />
                </div>
              </div>
            </div>

            {/* Right Sidebar Skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#4F7CFE', borderRadius: '12px', padding: '20px', height: '400px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ flex: 1, height: '32px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '6px' }} />
                  <div style={{ flex: 1, height: '32px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '6px' }} />
                  <div style={{ flex: 1, height: '32px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '6px' }} />
                </div>
              </div>
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
            Welcome To XYZ E-Zone
          </h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: '8px',
            position: 'relative',
            display: 'flex'
          }}>
            <Bell size={20} color="#666" />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              backgroundColor: '#EF4444',
              borderRadius: '50%',
              border: '2px solid #FFFFFF'
            }} />
          </button>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              <img 
                src={profile?.profilePhoto || 'https://ui-avatars.com/api/?name=Student&background=4F7CFE&color=fff&size=128'} 
                alt={profile?.studentName || 'Student'}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #E0E0E0'
                }}
              />
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
                {profile?.studentName?.split(' ')[0] || 'Student'}
              </span>
              <span style={{ fontSize: '12px', color: '#888' }}>B.te - Student</span>
              <ChevronDown size={16} color="#666" />
            </button>
            
            {showUserDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                minWidth: '200px',
                zIndex: 50
              }}>
                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#DC2626',
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={16} />
                  Logout
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
            {/* Quick Actions Grid - 6 columns */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(6, 1fr)', 
              gap: '12px'
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

            {/* Total Attendance & Backlog Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Total Attendance Card */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E0E0E0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0 }}>
                    Total Attendance
                  </h3>
                  <button style={{
                    padding: '4px 12px',
                    fontSize: '11px',
                    color: '#4F7CFE',
                    backgroundColor: 'transparent',
                    border: '1px solid #4F7CFE',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}>
                    View all &gt;&gt;
                  </button>
                </div>
                
                <div style={{
                  backgroundColor: '#1E3A8A',
                  borderRadius: '8px',
                  padding: '20px',
                  color: '#FFFFFF',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '16px',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.85, marginBottom: '4px' }}>Total</div>
                    <div style={{ fontSize: '32px', fontWeight: 700 }}>0</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.85, marginBottom: '4px' }}>Present</div>
                    <div style={{ fontSize: '32px', fontWeight: 700 }}>0</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.85, marginBottom: '4px' }}>Absent</div>
                    <div style={{ fontSize: '32px', fontWeight: 700 }}>0</div>
                  </div>
                </div>
              </div>

              {/* Backlog Card */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E0E0E0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0 }}>
                    Backlog
                  </h3>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <select 
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #E0E0E0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#333',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="2601">Term = 2601</option>
                    <option value="2602">Term = 2602</option>
                  </select>
                  <button style={{
                    padding: '8px 20px',
                    fontSize: '12px',
                    color: '#FFFFFF',
                    backgroundColor: '#10B981',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}>
                    Pass
                  </button>
                </div>

                <div style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '13px',
                  color: '#166534',
                  fontWeight: 500,
                  textAlign: 'center'
                }}>
                  0 Backlog
                </div>
              </div>
            </div>

            {/* Today's Class Card */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E0E0E0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0 }}>
                  Today's Class (Tuesday, 14 July 2026)
                </h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#3B82F6', borderRadius: '2px' }} />
                    <span style={{ fontSize: '11px', color: '#666' }}>Room Number</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#EF4444', borderRadius: '2px' }} />
                    <span style={{ fontSize: '11px', color: '#666' }}>H</span>
                  </div>
                  <button style={{
                    padding: '4px 12px',
                    fontSize: '11px',
                    color: '#4F7CFE',
                    backgroundColor: 'transparent',
                    border: '1px solid #4F7CFE',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}>
                    View all &gt;&gt;
                  </button>
                </div>
              </div>
              
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#999',
                fontSize: '14px',
                backgroundColor: '#FAFAFA',
                borderRadius: '8px',
                border: '1px dashed #E0E0E0'
              }}>
                No Record Found.
              </div>
            </div>

            {/* Continuous Assessment (CA) Marks Card */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E0E0E0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0, flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Continuous Assessment (CA) Marks</span>
                  {selectedCATerm && (
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      backgroundColor: '#3B82F6',
                      padding: '4px 12px',
                      borderRadius: '6px'
                    }}>
                      {selectedCATerm}
                    </span>
                  )}
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {availableTerms.map((term) => (
                    <button 
                      key={term.termCode}
                      onClick={() => setSelectedCATerm(term.termCode)}
                      style={{
                        padding: '6px 16px',
                        border: selectedCATerm === term.termCode ? '2px solid #3B82F6' : '1px solid #E0E0E0',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: selectedCATerm === term.termCode ? '#3B82F6' : '#333',
                        backgroundColor: selectedCATerm === term.termCode ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                        fontWeight: selectedCATerm === term.termCode ? 600 : 500
                      }}
                    >
                      {term.termCode}
                    </button>
                  ))}
                </div>
              </div>
              
              {caMarksData && (
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
                  Year: <strong>{caMarksData.year}</strong> | Term: <strong>{caMarksData.termName}</strong>
                </div>
              )}

              {caMarksLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                  <Loader />
                </div>
              ) : caMarksData ? (
                <>
                  {/* Theory Courses Table */}
                  {caMarksData.theoryMarks && caMarksData.theoryMarks.length > 0 ? (
                    <div style={{ marginBottom: '24px', overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#1E40AF', color: '#FFFFFF' }}>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>Theory Courses</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>Assignment 1 (Max - 5)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>Assessment 1 (Max - 10)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>Assignment 2 (Max - 5)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>Assessment 2 (Max - 5)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {caMarksData.theoryMarks.map((course, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #E0E0E0', backgroundColor: idx % 2 === 0 ? '#FAFAFA' : '#FFFFFF' }}>
                              <td style={{ padding: '12px', fontSize: '12px', color: '#333' }}>
                                {course.subjectName} [{course.subjectCode}]
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#333' }}>
                                {course.assignment1 !== null ? course.assignment1 : '-'}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#333' }}>
                                {course.assessment1 !== null ? course.assessment1 : '-'}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#333' }}>
                                {course.assignment2 !== null ? course.assignment2 : '-'}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#333' }}>
                                {course.assessment2 !== null ? course.assessment2 : '-'}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#333', fontWeight: 600 }}>
                                {course.total !== null ? course.total : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '13px', marginBottom: '24px' }}>
                      No theory courses enrolled for this term.
                    </div>
                  )}

                  {/* Practical Courses Table */}
                  {caMarksData.practicalMarks && caMarksData.practicalMarks.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#1E40AF', color: '#FFFFFF' }}>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>Practical Courses</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>CA AI (Max - 75)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>CA NAAL (Max - 100)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>CA Jury (Max - 50)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>Continuous Assessment (Max - 30)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>Continuous Evaluation (Max - 30)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {caMarksData.practicalMarks.map((course, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #E0E0E0', backgroundColor: idx % 2 === 0 ? '#FAFAFA' : '#FFFFFF' }}>
                              <td style={{ padding: '12px', fontSize: '12px', color: '#333' }}>
                                {course.subjectName} [{course.subjectCode}]
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#333' }}>
                                {course.caAi !== null ? course.caAi : '-'}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#333' }}>
                                {course.caNaal !== null ? course.caNaal : '-'}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#333' }}>
                                {course.caJury !== null ? course.caJury : '-'}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#333' }}>
                                {course.continuousAssessment !== null ? course.continuousAssessment : '-'}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#333' }}>
                                {course.continuousEvaluation !== null ? course.continuousEvaluation : '-'}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#333', fontWeight: 600 }}>
                                {course.total !== null ? course.total : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
                      No practical courses enrolled for this term.
                    </div>
                  )}
                </>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                  Select a term to view CA marks.
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Profile Card */}
            <div style={{ backgroundColor: '#4F7CFE', borderRadius: '12px', padding: '20px', color: '#FFFFFF', position: 'relative', boxShadow: '0 2px 8px rgba(79, 124, 254, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', gap: '8px' }}>
                <button 
                onClick={() => setProfileView('student')}
                style={{
                  padding: '6px 16px',
                  fontSize: '12px',
                  backgroundColor: profileView === 'student' ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
                  color: profileView === 'student' ? '#4F7CFE' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: profileView === 'student' ? 600 : 500,
                  flex: 1
                }}
                >
                  Student
                </button>
                <button 
                onClick={() => setProfileView('mentor')}
                style={{
                  padding: '6px 16px',
                  fontSize: '12px',
                  backgroundColor: profileView === 'mentor' ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
                  color: profileView === 'mentor' ? '#4F7CFE' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: profileView === 'mentor' ? 600 : 500,
                  flex: 1
                }}>
                  Mentor
                </button>
                <button 
                onClick={() => setProfileView('parent')}
                style={{
                  padding: '6px 16px',
                  fontSize: '12px',
                  backgroundColor: profileView === 'parent' ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
                  color: profileView === 'parent' ? '#4F7CFE' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: profileView === 'parent' ? 600 : 500,
                  flex: 1
                }}>
                  Parent
                </button>
              </div>

              {profileView === 'student' && (
                <>
                  <div style={{ 
                    backgroundColor: 'rgba(255,255,255,0.15)', 
                    borderRadius: '8px', 
                    padding: '20px',
                    fontSize: '13px',
                    marginTop: '16px',
                    textAlign: 'left'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', margin: '0 0 16px 0' }}>
                      Student Information
                    </h3>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Name
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>
                        {profile?.studentName || 'Shubham Kumar'}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Program
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>
                        {profile?.course || 'Computer Science and Engineering - (DQSIT)'}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Department
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>
                        {profile?.department || 'Computer Science and Engineering'}
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Email
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '13px', wordBreak: 'break-all' }}>
                        {profile?.email || '2023286582.shubham@ug.sharda.ac.in'}
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Semester
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>
                        {profile?.semester || '6th Semester'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        System ID
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>
                        {profile?.studentId || '2023970092'}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {profileView === 'mentor' && (
                <div style={{ 
                  backgroundColor: 'rgba(255,255,255,0.15)', 
                  borderRadius: '8px', 
                  padding: '20px',
                  fontSize: '13px',
                  marginTop: '16px',
                  textAlign: 'left'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', margin: '0 0 16px 0' }}>
                    Mentor Information
                  </h3>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Name
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      Dr. Rajesh Kumar
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Phone Number
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      +91-9876543200
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Email ID
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '13px', wordBreak: 'break-all' }}>
                      rajesh.kumar@sharda.ac.in
                    </div>
                  </div>
                </div>
              )}

              {profileView === 'parent' && (
                <div style={{ 
                  backgroundColor: 'rgba(255,255,255,0.15)', 
                  borderRadius: '8px', 
                  padding: '20px',
                  fontSize: '13px',
                  marginTop: '16px',
                  textAlign: 'left'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', margin: '0 0 16px 0' }}>
                    Parent Information
                  </h3>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Name
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      Mr. Suresh Kumar
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Phone Number
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      +91-9876543210
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Email ID
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '13px', wordBreak: 'break-all' }}>
                      suresh.kumar@gmail.com
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Holiday's Card */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E0E0E0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ 
                fontSize: '15px', 
                fontWeight: 600, 
                color: '#333', 
                margin: '0 0 16px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                Holiday's
                <button 
                  onClick={() => setShowHolidaysExpanded(!showHolidaysExpanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#666',
                    padding: '4px'
                  }}
                >
                  {showHolidaysExpanded ? '▼' : '▲'}
                </button>
              </h3>
              
              {showHolidaysExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {holidays.length > 0 ? (
                    holidays.map((holiday, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                        <CheckCircle size={18} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: '#333', marginBottom: '2px' }}>
                            {holiday.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {holiday.date}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '20px',
                      color: '#999',
                      fontSize: '13px',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '8px',
                      border: '1px dashed #E0E0E0'
                    }}>
                      No holidays available. Academic calendar will be uploaded by admin.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
