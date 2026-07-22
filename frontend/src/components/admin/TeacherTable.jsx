import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Edit2, UserX, UserCheck } from 'lucide-react';

const TeacherTable = ({ teachers = [], onEdit, onDeactivate }) => {
  return (
    <div className="ez-table-responsive">
      <table className="ez-data-table">
        <thead>
          <tr>
            <th>Teacher ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Experience</th>
            <th>Status</th>
            <th className="table-actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length === 0 ? (
            <tr>
              <td colSpan="8" className="table-empty-row">
                No teacher records found.
              </td>
            </tr>
          ) : (
            teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="table-highlight">{teacher.id}</td>
                <td>
                  <div className="table-cell-profile">
                    <div className="table-avatar-initials">
                      {teacher.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <span className="table-profile-name">{teacher.fullName}</span>
                      <span className="table-profile-sub">{teacher.qualification}</span>
                    </div>
                  </div>
                </td>
                <td>{teacher.email}</td>
                <td>{teacher.department}</td>
                <td>{teacher.designation}</td>
                <td>{teacher.experience}</td>
                <td>
                  <Badge variant={teacher.status === 'Active' ? 'success' : 'danger'}>
                    {teacher.status}
                  </Badge>
                </td>
                <td>
                  <div className="table-actions-container">
                    <Button
                      onClick={() => onEdit(teacher)}
                      variant="secondary"
                      className="table-action-btn edit"
                      title="Edit Teacher"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      onClick={() => onDeactivate(teacher.id)}
                      variant="secondary"
                      className={`table-action-btn ${teacher.status === 'Active' ? 'deactivate' : 'activate'}`}
                      title={teacher.status === 'Active' ? 'Deactivate' : 'Activate'}
                    >
                      {teacher.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;
