import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

const StudentForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    course: '',
    specialization: '',
    semester: '',
    section: 'A',
    rollNumber: '',
    guardianName: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department || '',
        course: initialData.course || '',
        specialization: initialData.specialization || '',
        semester: initialData.semester || '',
        section: initialData.section || 'A',
        rollNumber: initialData.rollNumber || '',
        guardianName: initialData.guardianName || ''
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) tempErrors.phone = 'Phone number is required';
    if (!formData.department) tempErrors.department = 'Department is required';
    if (!formData.course.trim()) tempErrors.course = 'Course/Program is required';
    if (!formData.semester) tempErrors.semester = 'Semester is required';
    if (!formData.rollNumber.trim()) tempErrors.rollNumber = 'Roll number is required';
    if (!formData.guardianName.trim()) tempErrors.guardianName = 'Guardian name is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const DEPARTMENTS = ['Computer Science', 'Mechanical Eng', 'Electrical Eng', 'Mathematics', 'Physics', 'Civil Eng'];
  const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  const SECTIONS = ['A', 'B', 'C', 'D'];
  const SPECIALIZATIONS = {
    'B.Tech CSE': ['Core', 'AIML (Artificial Intelligence & Machine Learning)', 'Cybersecurity', 'Data Science', 'IoT (Internet of Things)', 'Cloud Computing'],
    'B.Tech': ['Core']
  };

  // Check if course requires specialization
  const showSpecialization = formData.course && (
    formData.course.toUpperCase().includes('B.TECH CSE') || 
    formData.course.toUpperCase().includes('BTECH CSE') ||
    formData.course.toUpperCase().includes('BTech CSE')
  );

  const specializationOptions = SPECIALIZATIONS['B.Tech CSE'] || [];

  return (
    <form className="ez-modal-form" onSubmit={handleSubmit}>
      <h3 className="form-modal-title">{initialData ? 'Edit Student Details' : 'Register New Student'}</h3>
      <div className="form-fields-grid">
        {/* Full Name */}
        <div className="form-group-full">
          <label className="ez-input-label">Student Full Name *</label>
          <input
            type="text"
            className={`ez-input-field ${errors.fullName ? 'ez-input-error' : ''}`}
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
          {errors.fullName && <span className="ez-error-msg">{errors.fullName}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="ez-input-label">Email Address *</label>
          <input
            type="email"
            className={`ez-input-field ${errors.email ? 'ez-input-error' : ''}`}
            placeholder="john.doe@ezone.edu"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <span className="ez-error-msg">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="ez-input-label">Phone Number *</label>
          <input
            type="text"
            className={`ez-input-field ${errors.phone ? 'ez-input-error' : ''}`}
            placeholder="+1 555-0199"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          {errors.phone && <span className="ez-error-msg">{errors.phone}</span>}
        </div>

        {/* Department */}
        <div className="form-group">
          <label className="ez-input-label">Department *</label>
          <select
            className={`ez-input-field ${errors.department ? 'ez-input-error' : ''}`}
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && <span className="ez-error-msg">{errors.department}</span>}
        </div>

        {/* Course */}
        <div className="form-group">
          <label className="ez-input-label">Course / Program *</label>
          <input
            type="text"
            className={`ez-input-field ${errors.course ? 'ez-input-error' : ''}`}
            placeholder="B.Tech CSE"
            value={formData.course}
            onChange={(e) => handleChange('course', e.target.value)}
          />
          {errors.course && <span className="ez-error-msg">{errors.course}</span>}
        </div>

        {/* Specialization - Only show for BTech CSE */}
        {showSpecialization && (
          <div className="form-group">
            <label className="ez-input-label">Specialization *</label>
            <select
              className="ez-input-field"
              value={formData.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
            >
              <option value="">Select Specialization</option>
              {specializationOptions.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Semester */}
        <div className="form-group">
          <label className="ez-input-label">Semester *</label>
          <select
            className={`ez-input-field ${errors.semester ? 'ez-input-error' : ''}`}
            value={formData.semester}
            onChange={(e) => handleChange('semester', e.target.value)}
          >
            <option value="">Select Semester</option>
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                {sem} Semester
              </option>
            ))}
          </select>
          {errors.semester && <span className="ez-error-msg">{errors.semester}</span>}
        </div>

        {/* Section */}
        <div className="form-group">
          <label className="ez-input-label">Section *</label>
          <select
            className="ez-input-field"
            value={formData.section}
            onChange={(e) => handleChange('section', e.target.value)}
          >
            {SECTIONS.map((sec) => (
              <option key={sec} value={sec}>
                Section {sec}
              </option>
            ))}
          </select>
        </div>

        {/* Roll Number */}
        <div className="form-group">
          <label className="ez-input-label">Roll Number *</label>
          <input
            type="text"
            className={`ez-input-field ${errors.rollNumber ? 'ez-input-error' : ''}`}
            placeholder="CS-042"
            value={formData.rollNumber}
            onChange={(e) => handleChange('rollNumber', e.target.value)}
          />
          {errors.rollNumber && <span className="ez-error-msg">{errors.rollNumber}</span>}
        </div>

        {/* Guardian Name */}
        <div className="form-group">
          <label className="ez-input-label">Primary Guardian Name *</label>
          <input
            type="text"
            className={`ez-input-field ${errors.guardianName ? 'ez-input-error' : ''}`}
            placeholder="Richard Doe"
            value={formData.guardianName}
            onChange={(e) => handleChange('guardianName', e.target.value)}
          />
          {errors.guardianName && <span className="ez-error-msg">{errors.guardianName}</span>}
        </div>
      </div>

      <div className="form-actions-row">
        <Button onClick={onCancel} variant="secondary" className="form-cancel-btn">
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="form-submit-btn">
          Save Record
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
