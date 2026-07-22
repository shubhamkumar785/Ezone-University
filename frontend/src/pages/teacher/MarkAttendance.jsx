import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Search, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import { teacherDashboardService } from '../../services/teacherDashboardService';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [students, setStudents] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const markAll = (status) => {
    setStudents(students.map(s => ({ ...s, status })));
  };

  const handleLoadStudents = async () => {
    if (!selectedSection) {
      toast.error('Please select a section');
      return;
    }
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    if (!selectedTime) {
      toast.error('Please select a time period');
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await teacherDashboardService.getStudentsBySection(selectedSection);
      setStudents(data);
      setIsLoaded(true);
      setIsSubmitted(false);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!isLoaded) return;
    // Simulate API call to save attendance
    setIsSubmitted(true);
    toast.success(`Attendance submitted successfully`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', padding: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button 
            onClick={() => navigate('/teacher/dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <ArrowLeft size={20} color="#333" />
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#333', margin: 0 }}>
            Mark Student Attendance
          </h1>
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '8px' }}>Select Section</label>
            <select 
              value={selectedSection}
              onChange={(e) => { setSelectedSection(e.target.value); setIsLoaded(false); setIsSubmitted(false); }}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            >
              <option value="">-- Select Section --</option>
              <option value="CSE-B">Computer Science - Section B</option>
              <option value="ECE-A">Electronics - Section A</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '8px' }}>Date</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setIsLoaded(false); setIsSubmitted(false); }}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '8px' }}>Time Period</label>
            <select 
              value={selectedTime}
              onChange={(e) => { setSelectedTime(e.target.value); setIsLoaded(false); setIsSubmitted(false); }}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            >
              <option value="">-- Select Time --</option>
              <option value="09:00-10:00">09:00 AM - 10:00 AM</option>
              <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
              <option value="11:15-12:15">11:15 AM - 12:15 PM</option>
              <option value="13:00-14:00">01:00 PM - 02:00 PM</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button variant="primary" onClick={handleLoadStudents} disabled={isLoading} style={{ width: '100%', height: '42px', whiteSpace: 'nowrap', padding: '0 24px', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Loading...' : 'Load Students'}
            </Button>
          </div>
        </div>

        {/* Success Container */}
        {isSubmitted && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ 
              width: '64px', height: '64px', backgroundColor: '#ECFDF5', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' 
            }}>
              <Check size={32} color="#10B981" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>
              Attendance Submitted Successfully!
            </h2>
            <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
              The attendance records for {selectedSection} on {selectedDate} at {selectedTime} have been saved securely.
            </p>
            <Button variant="outline" onClick={() => { setIsLoaded(false); setIsSubmitted(false); setSelectedSection(''); }}>
              Mark Another Attendance
            </Button>
          </div>
        )}

        {/* Student List */}
        {isLoaded && !isSubmitted && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Student List</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => markAll('present')}
                style={{ padding: '6px 16px', backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #34D399', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              >
                Mark All Present
              </button>
              <button 
                onClick={() => markAll('absent')}
                style={{ padding: '6px 16px', backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #F87171', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              >
                Mark All Absent
              </button>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E0E0E0' }}>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Roll No</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Student Name</th>
                <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#333', fontWeight: 500 }}>{student.rollNo}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#333' }}>{student.name}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', borderRadius: '8px', border: '1px solid #E0E0E0', overflow: 'hidden' }}>
                      <button 
                        onClick={() => handleStatusChange(student.id, 'present')}
                        style={{ 
                          padding: '8px 16px', 
                          backgroundColor: student.status === 'present' ? '#10B981' : '#FFFFFF',
                          color: student.status === 'present' ? '#FFFFFF' : '#666',
                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500
                        }}
                      >
                        <Check size={16} /> Present
                      </button>
                      <button 
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        style={{ 
                          padding: '8px 16px', 
                          backgroundColor: student.status === 'absent' ? '#EF4444' : '#FFFFFF',
                          color: student.status === 'absent' ? '#FFFFFF' : '#666',
                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500
                        }}
                      >
                        <X size={16} /> Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ padding: '20px', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="outline" onClick={() => navigate('/teacher/dashboard')}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18} /> Save Attendance
            </Button>
          </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default MarkAttendance;
