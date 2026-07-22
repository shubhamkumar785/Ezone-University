import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentDashboardService } from '../../services/studentDashboardService';
import { toast } from 'react-toastify';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import Loader from '../../components/common/Loader';
import { SkeletonCard, SkeletonTable } from '../../components/common/SkeletonLoader';

const StudentAttendance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [availableTerms, setAvailableTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedTerm) {
      fetchAttendance(selectedTerm);
    }
  }, [selectedTerm]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [activeTermData, termsData] = await Promise.all([
        studentDashboardService.getActiveTerm(),
        studentDashboardService.getAllTerms()
      ]);
      
      setAvailableTerms(termsData);
      
      // Set active term as default
      if (activeTermData) {
        setSelectedTerm(activeTermData.termCode);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load attendance page. Please try again.');
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Unauthorized access. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error('Failed to load attendance page');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (termCode) => {
    setAttendanceLoading(true);
    setError(null);
    try {
      const data = await studentDashboardService.getAttendance(termCode);
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Failed to load attendance data for this term.');
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Unauthorized access. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 404) {
        toast.error('Attendance data not found for this term');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to load attendance data');
      }
    } finally {
      setAttendanceLoading(false);
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage === null || percentage === undefined) return '#999';
    if (percentage >= 75) return '#10B981'; // Green
    if (percentage >= 65) return '#F59E0B'; // Yellow/Orange
    return '#EF4444'; // Red
  };

  const getAttendanceLabel = (percentage) => {
    if (percentage === null || percentage === undefined) return '-';
    if (percentage >= 75) return 'Attendance ≥ 75%';
    return 'Attendance < 75%';
  };

  const handleExport = async () => {
    if (!selectedTerm || !attendanceData) {
      toast.warning('No attendance data to export');
      return;
    }

    setExporting(true);
    try {
      const exportData = await studentDashboardService.exportAttendance(selectedTerm);
      
      if (!exportData || !exportData.subjects || exportData.subjects.length === 0) {
        toast.warning('No attendance data available to export');
        setExporting(false);
        return;
      }
      
      // Generate CSV content
      const csvContent = generateCSV(exportData);
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `Attendance_${exportData.studentId}_Term_${exportData.termCode}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Attendance report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export attendance report');
    } finally {
      setExporting(false);
    }
  };

  const generateCSV = (data) => {
    const headers = [
      'Sr No.',
      'Course Name',
      'Course Code',
      'Course Type',
      'Course Instructor',
      'Course Credit',
      'Delivered',
      'Attended',
      'Event',
      'Medical',
      'Percentage'
    ];

    const rows = data.subjects.map((subject, index) => [
      index + 1,
      subject.subjectName,
      subject.subjectCode,
      subject.subjectType === 'THEORY' ? 'PP' : 'PR',
      subject.facultyName,
      `${subject.credits}.0`,
      subject.totalClasses || 0,
      subject.attendedClasses || 0,
      subject.eventLeaves || 0,
      subject.medicalLeaves || 0,
      subject.attendancePercentage !== null ? `${subject.attendancePercentage.toFixed(2)}%` : '-'
    ]);

    // Calculate totals
    const totalClasses = data.subjects.reduce((sum, s) => sum + (s.totalClasses || 0), 0);
    const totalAttended = data.subjects.reduce((sum, s) => sum + (s.attendedClasses || 0), 0);
    const totalEvents = data.subjects.reduce((sum, s) => sum + (s.eventLeaves || 0), 0);
    const totalMedical = data.subjects.reduce((sum, s) => sum + (s.medicalLeaves || 0), 0);
    const overallPercentage = totalClasses > 0 ? `${((totalAttended / totalClasses) * 100).toFixed(2)}%` : '-';

    rows.push([
      '',
      '',
      '',
      '',
      'Total',
      '',
      totalClasses,
      totalAttended,
      totalEvents,
      totalMedical,
      overallPercentage
    ]);

    // Header info
    const headerInfo = [
      ['Attendance Report'],
      [`Student Name: ${data.studentName}`],
      [`Student ID: ${data.studentId}`],
      [`Academic Year: ${data.year}`],
      [`Term: ${data.termCode} (${data.termName})`],
      [`Generated On: ${new Date().toLocaleString()}`],
      [''],
      headers
    ];

    const csvRows = [...headerInfo, ...rows];

    return csvRows.map(row => 
      row.map(cell => {
        // Escape commas and quotes in cell content
        const cellStr = String(cell || '');
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ).join('\n');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
        {/* Header Skeleton */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '80px', height: '32px', backgroundColor: '#E5E7EB', borderRadius: '6px' }} />
          <div style={{ flex: 1, height: '24px', backgroundColor: '#E5E7EB', borderRadius: '4px', maxWidth: '400px' }} />
          <div style={{ width: '150px', height: '36px', backgroundColor: '#E5E7EB', borderRadius: '6px' }} />
        </div>
        
        {/* Content Skeleton */}
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <SkeletonTable />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E0E0E0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <button
          onClick={() => navigate('/student/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#333',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#333', margin: 0, flex: 1 }}>
          Enrolled Course List
          {attendanceData && (
            <span style={{ fontSize: '13px', fontWeight: 400, color: '#666', marginLeft: '8px' }}>
              (System ID: {attendanceData.studentId} With Term: {attendanceData.termCode})
            </span>
          )}
        </h1>
        <button
          onClick={() => navigate(`/student/attendance/day-wise${selectedTerm ? `?term=${selectedTerm}` : ''}`)}
          style={{
            padding: '8px 20px',
            fontSize: '13px',
            color: '#FFFFFF',
            backgroundColor: '#4F7CFE',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3d6ae0'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F7CFE'; }}
        >
          📅 Day Wise Attendance
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', maxWidth: '100%', margin: '0 auto' }}>
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={20} color="#DC2626" />
            <span style={{ color: '#DC2626', fontSize: '14px' }}>{error}</span>
          </div>
        )}
        
        {attendanceLoading ? (
          <div>
            {/* Skeleton for subject cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
            {/* Skeleton for table */}
            <SkeletonTable />
          </div>
        ) : attendanceData ? (
          <>
            {/* Subject Cards Grid */}
            {attendanceData.subjects && attendanceData.subjects.length > 0 ? (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px'
                }}>
                  {attendanceData.subjects.map((subject, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #E0E0E0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#333',
                        marginBottom: '8px',
                        lineHeight: '1.4'
                      }}>
                        {subject.subjectName}
                      </h3>
                      <p style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '12px'
                      }}>
                        Faculty: <strong>{subject.facultyName}</strong>
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: subject.subjectType === 'THEORY' ? '#DBEAFE' : '#FCE7F3',
                          color: subject.subjectType === 'THEORY' ? '#1E40AF' : '#BE185D',
                          borderRadius: '4px'
                        }}>
                          {subject.subjectType === 'THEORY' ? 'PP' : 'PR'}
                        </span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#FEF3C7',
                          color: '#92400E',
                          borderRadius: '4px'
                        }}>
                          {subject.credits}.0
                        </span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#F3F4F6',
                          color: '#374151',
                          borderRadius: '4px'
                        }}>
                          {subject.subjectCode}
                        </span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: subject.attendancePercentage === null ? '#F3F4F6' : (subject.attendancePercentage >= 75 ? '#D1FAE5' : '#FEE2E2'),
                          color: getAttendanceColor(subject.attendancePercentage),
                          borderRadius: '4px'
                        }}>
                          {subject.attendancePercentage !== null 
                            ? `${subject.attendancePercentage.toFixed(2)}%` 
                            : 'No Record'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed Table */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #E0E0E0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#333', margin: 0 }}>
                      Enrolled Course List
                    </h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {availableTerms.map((term) => (
                        <button
                          key={term.termCode}
                          onClick={() => setSelectedTerm(term.termCode)}
                          style={{
                            padding: '6px 16px',
                            border: selectedTerm === term.termCode ? '2px solid #4F7CFE' : '1px solid #E0E0E0',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: selectedTerm === term.termCode ? '#4F7CFE' : '#333',
                            backgroundColor: selectedTerm === term.termCode ? '#EFF6FF' : '#FFFFFF',
                            cursor: 'pointer',
                            fontWeight: selectedTerm === term.termCode ? 600 : 500
                          }}
                        >
                          {term.termCode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: '#DBEAFE',
                        borderRadius: '2px'
                      }} />
                      <span>Theory/Practical</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: '#FEF3C7',
                        borderRadius: '2px'
                      }} />
                      <span>Course Number</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: '#D1FAE5',
                        borderRadius: '2px'
                      }} />
                      <span>Attendance ≥ 75%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: '#FEE2E2',
                        borderRadius: '2px'
                      }} />
                      <span>Attendance &lt; 75%</span>
                    </div>
                    <button
                      onClick={handleExport}
                      disabled={exporting || !attendanceData || attendanceData.subjects.length === 0}
                      style={{
                        marginLeft: 'auto',
                        padding: '6px 16px',
                        fontSize: '12px',
                        color: '#FFFFFF',
                        backgroundColor: exporting || !attendanceData || attendanceData.subjects.length === 0 ? '#D1D5DB' : '#EC4899',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: exporting || !attendanceData || attendanceData.subjects.length === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {exporting ? 'Exporting...' : 'Export'}
                    </button>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    padding: '12px 16px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '13px', color: '#EC4899', fontWeight: 600 }}>
                      System ID: {attendanceData.studentId}
                    </div>
                    <div style={{ fontSize: '13px', color: '#EC4899', fontWeight: 600 }}>
                      Term: {attendanceData.termCode}
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Sr No.</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Course Name</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Course Code</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Course Type</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Course Instructor</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>Course Credit</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>Delivered</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>Attended</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>Event</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>Medical</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.subjects.map((subject, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '12px', color: '#374151' }}>{idx + 1}</td>
                            <td style={{ padding: '12px', color: '#374151' }}>{subject.subjectName}</td>
                            <td style={{ padding: '12px', color: '#374151' }}>{subject.subjectCode}</td>
                            <td style={{ padding: '12px', color: '#374151' }}>{subject.subjectType === 'THEORY' ? 'PP' : 'PR'}</td>
                            <td style={{ padding: '12px', color: '#374151' }}>{subject.facultyName}</td>
                            <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>{subject.credits}.0</td>
                            <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>{subject.totalClasses}</td>
                            <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>{subject.attendedClasses}</td>
                            <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>{subject.eventLeaves}</td>
                            <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>{subject.medicalLeaves}</td>
                            <td style={{
                              padding: '12px',
                              textAlign: 'center',
                              color: getAttendanceColor(subject.attendancePercentage),
                              fontWeight: 600
                            }}>
                              {subject.attendancePercentage !== null 
                                ? `${subject.attendancePercentage.toFixed(2)}%` 
                                : '-'}
                            </td>
                          </tr>
                        ))}
                        <tr style={{ borderTop: '2px solid #E5E7EB', fontWeight: 600, backgroundColor: '#F9FAFB' }}>
                          <td colSpan="6" style={{ padding: '12px', textAlign: 'right', color: '#374151' }}>Total</td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>
                            {attendanceData.subjects.reduce((sum, s) => sum + (s.totalClasses || 0), 0)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>
                            {attendanceData.subjects.reduce((sum, s) => sum + (s.attendedClasses || 0), 0)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>
                            {attendanceData.subjects.reduce((sum, s) => sum + (s.eventLeaves || 0), 0)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>
                            {attendanceData.subjects.reduce((sum, s) => sum + (s.medicalLeaves || 0), 0)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#EC4899', fontWeight: 600 }}>
                            {(() => {
                              const totalClasses = attendanceData.subjects.reduce((sum, s) => sum + (s.totalClasses || 0), 0);
                              const totalAttended = attendanceData.subjects.reduce((sum, s) => sum + (s.attendedClasses || 0), 0);
                              return totalClasses > 0 ? `${((totalAttended / totalClasses) * 100).toFixed(2)}%` : '-';
                            })()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '60px',
                textAlign: 'center',
                border: '1px solid #E0E0E0'
              }}>
                <BookOpen size={48} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
                  No enrolled courses found for this term.
                </p>
              </div>
            )}
          </>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid #E0E0E0'
          }}>
            <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
              Select a term to view attendance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
