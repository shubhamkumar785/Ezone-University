import React from 'react';
import Badge from '../common/Badge';
import { X, Mail, Phone, User, GraduationCap, Calendar, Hash } from 'lucide-react';

const ProfileCard = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="profile-drawer-container">
      <div className="profile-drawer-header">
        <h3 className="drawer-header-title">Student Profile</h3>
        <button className="drawer-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="profile-drawer-body">
        {/* Profile Card Banner */}
        <div className="drawer-profile-banner">
          <div className="drawer-avatar-wrapper">
            <div className="drawer-avatar-placeholder">
              {student.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
          </div>
          <h4 className="drawer-profile-name">{student.fullName}</h4>
          <span className="drawer-profile-id">{student.id}</span>
          <div className="drawer-profile-badge-row">
            <Badge variant={student.status === 'Active' ? 'success' : 'danger'}>
              {student.status}
            </Badge>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="drawer-details-section">
          <h5 className="details-section-title">Academic Details</h5>
          
          <div className="details-grid-item">
            <GraduationCap size={16} className="details-item-icon" />
            <div className="details-item-content">
              <span className="details-item-label">Department</span>
              <span className="details-item-val">{student.department}</span>
            </div>
          </div>

          <div className="details-grid-item">
            <GraduationCap size={16} className="details-item-icon" />
            <div className="details-item-content">
              <span className="details-item-label">Course Program</span>
              <span className="details-item-val">{student.course}</span>
            </div>
          </div>

          <div className="details-grid-item">
            <Calendar size={16} className="details-item-icon" />
            <div className="details-item-content">
              <span className="details-item-label">Semester & Section</span>
              <span className="details-item-val">Semester {student.semester} • Section {student.section}</span>
            </div>
          </div>

          <div className="details-grid-item">
            <Hash size={16} className="details-item-icon" />
            <div className="details-item-content">
              <span className="details-item-label">Roll Number</span>
              <span className="details-item-val">{student.rollNumber}</span>
            </div>
          </div>
        </div>

        <div className="drawer-details-section">
          <h5 className="details-section-title">Contact & Guardian</h5>

          <div className="details-grid-item">
            <Mail size={16} className="details-item-icon" />
            <div className="details-item-content">
              <span className="details-item-label">Email Address</span>
              <span className="details-item-val">{student.email}</span>
            </div>
          </div>

          <div className="details-grid-item">
            <Phone size={16} className="details-item-icon" />
            <div className="details-item-content">
              <span className="details-item-label">Phone Number</span>
              <span className="details-item-val">{student.phone}</span>
            </div>
          </div>

          <div className="details-grid-item">
            <User size={16} className="details-item-icon" />
            <div className="details-item-content">
              <span className="details-item-label">Primary Guardian</span>
              <span className="details-item-val">{student.guardianName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
