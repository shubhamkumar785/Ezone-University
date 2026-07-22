import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

const TeacherForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    qualification: '',
    designation: '',
    experience: '',
    joiningDate: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        department: initialData.department || '',
        qualification: initialData.qualification || '',
        designation: initialData.designation || '',
        experience: initialData.experience || '',
        joiningDate: initialData.joiningDate || ''
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
    if (!formData.department) tempErrors.department = 'Department is required';
    if (!formData.qualification.trim()) tempErrors.qualification = 'Qualification is required';
    if (!formData.designation) tempErrors.designation = 'Designation is required';
    if (!formData.experience.trim()) tempErrors.experience = 'Experience is required';
    if (!formData.joiningDate) tempErrors.joiningDate = 'Joining Date is required';

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
  const DESIGNATIONS = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];

  return (
    <form className="ez-modal-form" onSubmit={handleSubmit}>
      <h3 className="form-modal-title">{initialData ? 'Edit Teacher Profile' : 'Add New Teacher'}</h3>
      <div className="form-fields-grid">
        {/* Full Name */}
        <div className="form-group-full">
          <label className="ez-input-label">Full Name *</label>
          <input
            type="text"
            className={`ez-input-field ${errors.fullName ? 'ez-input-error' : ''}`}
            placeholder="Dr. Sarah Mitchell"
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
            placeholder="sarah.mitchell@ezone.edu"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <span className="ez-error-msg">{errors.email}</span>}
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

        {/* Qualification */}
        <div className="form-group">
          <label className="ez-input-label">Qualification *</label>
          <input
            type="text"
            className={`ez-input-field ${errors.qualification ? 'ez-input-error' : ''}`}
            placeholder="PhD in Computer Science"
            value={formData.qualification}
            onChange={(e) => handleChange('qualification', e.target.value)}
          />
          {errors.qualification && <span className="ez-error-msg">{errors.qualification}</span>}
        </div>

        {/* Designation */}
        <div className="form-group">
          <label className="ez-input-label">Designation *</label>
          <select
            className={`ez-input-field ${errors.designation ? 'ez-input-error' : ''}`}
            value={formData.designation}
            onChange={(e) => handleChange('designation', e.target.value)}
          >
            <option value="">Select Designation</option>
            {DESIGNATIONS.map((desig) => (
              <option key={desig} value={desig}>
                {desig}
              </option>
            ))}
          </select>
          {errors.designation && <span className="ez-error-msg">{errors.designation}</span>}
        </div>

        {/* Experience */}
        <div className="form-group">
          <label className="ez-input-label">Experience (e.g. "8 years") *</label>
          <input
            type="text"
            className={`ez-input-field ${errors.experience ? 'ez-input-error' : ''}`}
            placeholder="10 years"
            value={formData.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
          />
          {errors.experience && <span className="ez-error-msg">{errors.experience}</span>}
        </div>

        {/* Joining Date */}
        <div className="form-group">
          <label className="ez-input-label">Joining Date *</label>
          <input
            type="date"
            className={`ez-input-field ${errors.joiningDate ? 'ez-input-error' : ''}`}
            value={formData.joiningDate}
            onChange={(e) => handleChange('joiningDate', e.target.value)}
          />
          {errors.joiningDate && <span className="ez-error-msg">{errors.joiningDate}</span>}
        </div>
      </div>

      <div className="form-actions-row">
        <Button onClick={onCancel} variant="secondary" className="form-cancel-btn">
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="form-submit-btn">
          Save Details
        </Button>
      </div>
    </form>
  );
};

export default TeacherForm;
